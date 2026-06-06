# 🎓 UFRA — App Professeurs & Matières
**Projet académique | JavaScript + MySQL**

---

## 📁 Structure du projet
```
prof-app/
├── database.sql          ← Script SQL (créer + peupler la BD)
├── frontend/
│   └── index.html        ← Interface web (HTML/CSS/JS vanilla)
└── backend/
    ├── server.js          ← API REST Node.js/Express
    └── package.json
```

---

## ⚙️ Installation & démarrage

### 1. Base de données MySQL
```bash
mysql -u root -p < database.sql
```

### 2. Backend Node.js
```bash
cd backend
npm install
node server.js
```
> ✅ Le serveur démarre sur **http://localhost:3000**

**⚠️ Modifier les identifiants MySQL dans `server.js` :**
```js
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'TON_MOT_DE_PASSE',   // ← changer ici
    database: 'ufra_db'
};
```

### 3. Frontend
Ouvrir http://localhost:3000 dans le navigateur.
*(le backend sert automatiquement le dossier `frontend/`)*

---

## 🔌 Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/professeurs` | Liste tous les profs + leurs matières |
| GET | `/api/professeurs/:id` | Un prof précis |
| GET | `/api/matieres` | Liste toutes les matières |
| GET | `/api/stats` | Statistiques globales |

---

## 🗄️ Modèle de données

```
professeurs (id, nom, prenom, email, telephone, grade)
    ↓ 1,N
enseignements (professeur_id, matiere_id, annee_academique)
    ↓ N,1
matieres (id, code, libelle, credits, niveau)
```

---

*Koissy Melvin Thomas — UFRA / ESG Abidjan — 2025–2026*
