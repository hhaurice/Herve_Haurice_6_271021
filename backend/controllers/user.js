"use strict";

const bcrypt = require("bcrypt"); // plugin mongoose pour hasher les mots de passe
const jwt = require("jsonwebtoken"); // plugin qui permet l'échange de données de façon sécurisée entre 2 parties à travers une chaîne de caractère(token). une fois l'user connecté, toutes ses requêtes pour accéder aux routes, ressources seront autorisées grâce à ce token
const User = require("../models/User"); // on importe notre modèle User.js

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // on appelle la fonction bcrypt pr saler le mot de passe 10 fois, cette fonction renvoie le hash généré. Renforce la sécurité en ajoutant une info supplémentaire. Le sel ajoute une valeur aléatoire qd par exemple, 2 users ont le mm mdp. 
      .then(hash => { // Permet d'éviter de stocker en clair le mdp ds la database et de créer une empreinte unique
        const user = new User({
          email: req.body.email,
          password: hash
        });
        console.log(user.password)
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès!' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: "Invalid password" });
            }
            res.status(200).json({ // Pour une bonne connexion
              userId: user._id,
              token: jwt.sign( // fonction pour encoder un nouveau token contenant l'id de l'utilisateur. ci-desous on indique les données qu'on veut encoder (le payload)
                { userId: user._id }, // on encode ici l'user id pour s'assurer que la requête correspond bien à cet user id. ça servira aussi pour ne pas modifier les objets créés par d'autres users
                'RANDOM_TOKEN_SECRET', // en production utiliser un string beaucoup plus long, là c'est juste pour le projet
                { expiresIn: '24h' } // durée de validité du token. L'utilisateur devra se reconnecter sous 1h
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };