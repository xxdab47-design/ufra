// ============================================
//  BACKEND : server.js
//  Node.js + Express + MySQL
//  Projet académique UFRA
// ============================================

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ---- Middlewares ----
app.use(cors());
app.use(express.json());
app.use(express.static('frontend')); // Sert les fichiers du frontend

// ---- Configuration MySQL ----
// ⚠️  Modifie ces paramètres selon ton environnement
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',          // Ton mot de passe MySQL
    database: 'ufra_db',
    waitForConnections: true,
    connectionLimit: 10
};

let pool;

async function initDB() {
    try {
        pool = mysql.createPool(dbConfig);
        await pool.query('SELECT 1'); // Test de connexion
        console.log('✅ Connexion MySQL établie');
    } catch (err) {
        console.error('❌ Erreur MySQL :', err.message);
        process.exit(1);
    }
}

// ============================================
//  ROUTES API
// ============================================

// GET /api/professeurs
// Retourne tous les professeurs avec leurs matières
app.get('/api/professeurs', async (req, res) => {
    try {
        const sql = `
            SELECT
                p.id,
                p.nom,
                p.prenom,
                p.email,
                p.telephone,
                p.grade,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id',      m.id,
                        'code',    m.code,
                        'libelle', m.libelle,
                        'credits', m.credits,
                        'niveau',  m.niveau
                    )
                ) AS matieres
            FROM professeurs p
            LEFT JOIN enseignements e ON e.professeur_id = p.id
            LEFT JOIN matieres m      ON m.id = e.matiere_id
            GROUP BY p.id
            ORDER BY p.nom, p.prenom;
        `;
        const [rows] = await pool.query(sql);

        // Nettoyer les matières null (si un prof n'a aucune matière)
        const result = rows.map(prof => ({
            ...prof,
            matieres: prof.matieres.filter(m => m.id !== null)
        }));

        res.json({ success: true, data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// GET /api/professeurs/:id
// Retourne un professeur précis avec ses matières
app.get('/api/professeurs/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, m.code, m.libelle, m.credits, m.niveau
            FROM professeurs p
            LEFT JOIN enseignements e ON e.professeur_id = p.id
            LEFT JOIN matieres m      ON m.id = e.matiere_id
            WHERE p.id = ?
        `, [req.params.id]);

        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'Professeur non trouvé' });
        }

        // Regroupe les matières
        const prof = {
            id: rows[0].id, nom: rows[0].nom, prenom: rows[0].prenom,
            email: rows[0].email, telephone: rows[0].telephone, grade: rows[0].grade,
            matieres: rows
                .filter(r => r.code)
                .map(r => ({ code: r.code, libelle: r.libelle, credits: r.credits, niveau: r.niveau }))
        };

        res.json({ success: true, data: prof });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// GET /api/matieres
// Retourne toutes les matières
app.get('/api/matieres', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM matieres ORDER BY niveau, code');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// GET /api/stats
// Retourne quelques statistiques
app.get('/api/stats', async (req, res) => {
    try {
        const [[{ total_profs }]] = await pool.query('SELECT COUNT(*) AS total_profs FROM professeurs');
        const [[{ total_matieres }]] = await pool.query('SELECT COUNT(*) AS total_matieres FROM matieres');
        const [[{ total_enseignements }]] = await pool.query('SELECT COUNT(*) AS total_enseignements FROM enseignements');
        res.json({ success: true, data: { total_profs, total_matieres, total_enseignements } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// ---- Démarrage ----
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
});
