"use strict";

const multer = require("multer");

// Ci-dessous un dictionnaire qui va définir de créer l'extension du fichier dans const extension
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => { // requête, fichier, callback
    callback(null, "images"); // images étant le nom du dossier
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // on créé le nom du fichier, on retire les espaces avec la méthode split() et en mettant des undescores à la place des espaces avec join()
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); // on appelle le call back en créant le file name entier avec la date (un timestamp)
  }
});

module.exports = multer({storage: storage}).single("image"); // on l'exporte, on y passe notre objet storage et on explique qu'il s'agit de fichier image uniquement