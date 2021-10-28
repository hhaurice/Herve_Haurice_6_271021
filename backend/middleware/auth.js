"use strict";

//middleware vérifie le token envoyé par l'app frontend avec sa requête, vérifie si token valable et si userid correspond bien à celui encodé dans le token

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // on utilise les headers de la requête et le header authorization qu'on split autour de l'espace (' ') avec le bearer d'un côté, et le token de l'autre[1]
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // on vérifie le token avec la fonction verify du package de jwt, on donne la clé secrète en 2nd argument
    const userId = decodedToken.userId; // on récupère l'userId de l'objet javascript
    if (req.body.userId && req.body.userId !== userId) { // on vérifie que l'useriD ds le corps de la requête corresponde bien avec l'userId encodé du Token 
      throw "Invalid user ID"; // si userId du corps de la requête différent de celui du token, on renvoie une erreur 
    } else {
      next(); // si tout va bien, on passe la requête au prochain middleware
    }
  } catch { 
    res.status(401).json({error: error | "Ta requête est invalide"});
  }
};

// Ensuite il faut ajouter auth aux routes qu'on souhaite protéger