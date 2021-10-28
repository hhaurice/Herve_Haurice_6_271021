"use strict";

const bcrypt = require("bcrypt"); // plugin mongoose pour hasher les mots de passe
const jwt = require("jsonwebtoken"); // plugin qui permet l'échange de données de façon sécurisée entre 2 parties à travers une chaîne de caractère(token). une fois l'user connecté, toutes ses requêtes pour accéder aux routes, ressources seront autorisées grâce à ce token
const User = require("../models/User"); // on importe notre modèle User.js

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // on appelle la fonction bcrypt pr saler le mot de passe 10 fois, cette fonction renvoie le hash généré
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès!' }))
          .catch(error => res.status(400).json({error }));
      })
      .catch(error => res.status(500).json({error}));
  };


  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé!!" });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect" });
            }
            res.status(200).json({ // Pour une bonne connexion
              userId: user._id,
              token: jwt.sign( // fonction pour encoder un nouveau token contenant l'id de l'utilisateur. ci-desous on indique les données qu'on veut encoder (le payload)
                { userId: user._id }, // on encode ici l'user id pour s'assurer que la requête correspond bien à cet user id. ça servira aussi pour ne pas modifier les objets créés par d'autres users
                'RANDOM_TOKEN_SECRET', // en production utiliser un string beaucoup plus long, là c'est juste pour le projet
                { expiresIn: '24h' } // durée de validité du token. L'utilisateur devra se reconnecter sous 24h
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ message: "Erreur du serveur!" }));
  };