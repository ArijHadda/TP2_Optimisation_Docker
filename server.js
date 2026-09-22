const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();


// Middleware verbeux et un peu inutile
app.use((req, res, next) => {
console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
next();
});


app.get('/', (req, res) => {
res.send('Hello world — serveur volontairement non optimisé mais fonctionnel');
});


app.get('/big', (req, res) => {
  const filePath = path.join(__dirname, 'maybe-big-file.txt');
  const stream = fs.createReadStream(filePath, 'utf8');

  stream.on('error', (err) => {
    res.status(404).send('Fichier introuvable');
  });

  stream.pipe(res);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Serveur démarré sur le port ${PORT}`);
});