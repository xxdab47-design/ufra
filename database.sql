
CREATE DATABASE IF NOT EXISTS ufra_db;
USE ufra_db;

-- Table des professeurs
CREATE TABLE IF NOT EXISTS professeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    grade VARCHAR(80),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des matières
CREATE TABLE IF NOT EXISTS matieres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    credits INT DEFAULT 3,
    niveau VARCHAR(20) DEFAULT 'L1'
);

-- Table de liaison (un prof peut enseigner plusieurs matières)
CREATE TABLE IF NOT EXISTS enseignements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professeur_id INT NOT NULL,
    matiere_id INT NOT NULL,
    annee_academique VARCHAR(20) DEFAULT '2025-2026',
    FOREIGN KEY (professeur_id) REFERENCES professeurs(id) ON DELETE CASCADE,
    FOREIGN KEY (matiere_id) REFERENCES matieres(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enseignement (professeur_id, matiere_id, annee_academique)
);

-- ============================================
-- INSERTION DES DONNÉES DE TEST
-- ============================================

INSERT INTO professeurs (nom, prenom, email, telephone, grade) VALUES
('KONAN', 'Brice Alain', 'b.konan@ufra.ci', '+225 07 01 02 03', 'Maître de Conférences'),
('TOURÉ', 'Aminata', 'a.toure@ufra.ci', '+225 05 22 33 44', 'Professeur Titulaire'),
('N\'GUESSAN', 'Kouamé Eric', 'k.nguessan@ufra.ci', '+225 01 44 55 66', 'Assistant'),
('DIABATÉ', 'Fatoumata', 'f.diabate@ufra.ci', '+225 07 88 99 00', 'Chargé de Cours'),
('OUATTARA', 'Seydou Marc', 's.ouattara@ufra.ci', '+225 05 11 22 33', 'Maître-Assistant');

INSERT INTO matieres (code, libelle, credits, niveau) VALUES
('INF101', 'Algorithmique et Programmation', 4, 'L1'),
('INF102', 'Bases de Données', 4, 'L1'),
('INF103', 'Développement Web', 3, 'L1'),
('INF201', 'Systèmes d\'Exploitation Linux', 3, 'L2'),
('INF202', 'Réseaux Informatiques', 3, 'L2'),
('MATH101', 'Mathématiques Discrètes', 4, 'L1'),
('MATH102', 'Algèbre Linéaire', 3, 'L1'),
('ECO101', 'Analyse Financière', 3, 'L1');

INSERT INTO enseignements (professeur_id, matiere_id) VALUES
(1, 1), (1, 6),
(2, 2), (2, 8),
(3, 3), (3, 4),
(4, 5), (4, 3),
(5, 7), (5, 1);
