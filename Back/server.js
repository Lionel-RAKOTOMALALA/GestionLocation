const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require('body-parser');



const app = express();

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "agentloc"
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ' + err.stack);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

app.get("/", (req, res) => {
    // Première requête pour sélectionner toutes les données des locations
    const sqlLocations = "SELECT *, nbrjour * t_journalier AS loyer FROM location ORDER BY num_loc DESC;";
  
    // Deuxième requête pour calculer le loyer total
    const sqlTotalRent = "SELECT SUM(nbrjour * t_journalier) AS totalRent FROM location;";
  
    // Troisième requête pour récupérer le loyer minimal
    const sqlMinRent = "SELECT CONCAT(MIN(nbrjour * t_journalier), ' Ariary') AS minRent FROM location;";
  
    // Quatrième requête pour récupérer le loyer maximal
    const sqlMaxRent = "SELECT CONCAT(MAX(nbrjour * t_journalier), ' Ariary') AS maxRent FROM location;";
  
    // Exécution de toutes les requêtes en parallèle
    db.query(sqlLocations, (errLocations, dataLocations) => {
      if (errLocations) return res.json({ error: "Error fetching locations data" });
  
      db.query(sqlTotalRent, (errTotalRent, dataTotalRent) => {
        if (errTotalRent) return res.json({ error: "Error fetching total rent" });
  
        db.query(sqlMinRent, (errMinRent, dataMinRent) => {
          if (errMinRent) return res.json({ error: "Error fetching minimum rent" });
  
          db.query(sqlMaxRent, (errMaxRent, dataMaxRent) => {
            if (errMaxRent) return res.json({ error: "Error fetching maximum rent" });
  
            // Renvoyer les résultats dans un objet JSON
            return res.json({
              locations: dataLocations,
              totalRent: dataTotalRent[0].totalRent,
              minRent: dataMinRent[0].minRent,
              maxRent: dataMaxRent[0].maxRent
            });
          });
        });
      });
    });
  });
  
app.get("/:id",(req,res) =>{
    const params = req.params.id;
    const sql = "SELECT * FROM location WHERE num_loc = ?"
    db.query(sql, params,(err,data) =>{
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête SQL : ' + err.stack);
            return res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
        }
        return res.json(data);
    });
} )

app.post("/", (req, res) => {
    const sql = "INSERT INTO location (num_loc,nom_loc,design_voiture,nbrjour,t_journalier) VALUES (?, ?, ?, ?,?)";
    const values = [
        req.body.num_loc,
        req.body.nom_loc,
        req.body.design_voiture,
        req.body.nbrjour,
        req.body.t_journalier
    ]
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête SQL : ' + err.stack);
            return res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
        }
        return res.status(201).json({ message: 'Lieu ajouté avec succès', location_id: result.insertId });
    });
});

app.put("/:locationId", (req, res) => {
    const locationId = req.params.locationId;
    const { num_loc, nom_loc, design_voiture, nbrjour, t_journalier } = req.body;
    const sql = "UPDATE location SET num_loc = ?, nom_loc = ?, design_voiture = ?, nbrjour = ?, t_journalier = ? WHERE num_loc = ?";
    const values = [num_loc, nom_loc, design_voiture, nbrjour, t_journalier, locationId];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête SQL : ' + err.stack);
            return res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Lieu non trouvé' });
        }
        return res.status(200).json({ message: 'Lieu mis à jour avec succès', locationId: locationId });
    });
});


app.delete("/:locationId", (req, res) => {
    const locationId = req.params.locationId;
    const sql = "DELETE FROM location WHERE num_loc = ?";
    db.query(sql, locationId, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête SQL : ' + err.stack);
            return res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Lieu non trouvé' });
        }
        return res.status(200).json({ message: 'Lieu supprimé avec succès', locationId: locationId });
    });
});


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log("Serveur démarré sur le port " + PORT);
});
