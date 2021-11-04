"use strict";

const Sauce = require("../models/Sauce");
const fs = require("fs"); // Module node.js permettant de gérer les fichiers sur l'ordinateur. Ici on l'utilisera pour supprimer le fichier dans la fonction deleteSauce

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // Nous permet de créer un objet javascript sous une chaîne de caractère qui nous permettra d'extraire l'objet json de sauce
  delete sauceObject._id; // On supprime l'id créé automatiquement par Mongodb du corps de la requête
  const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }); // req.protocol c'est http ou https, req.get host c'est le host de notre serveur et req.file name pour le nom du fichier
  sauce.save()
    .then(() => res.status(201).json({message: "Votre sauce a été enregistrée"}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
 Sauce.findOne({_id: req.params.id} ) //On veut que l'id de Sauce soit le même que le paramètre de requête
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json( {error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file? // S'il y a une nouvelle image, il y aura un req.file?, s'il y'en a pas, on pourra traiter la requête comme objet simplement
    { ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`} : { ...req.body}; // S'il n'existe pas, on fait juste req.body, s'il existe on créé une chaine de caractère et une nouvelle photo
  Sauce.updateOne({_id: req.params.id }, { ...sauceObject, _id: req.params.id}) // Pour être sur d'avoir le bon id
    .then(() => res.status(200).json({message: "Objet modifié"}))
    .catch(error => res.status(403).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}) // On trouve l'objet dans la database, là encore il faut que l'Id soit le même que la requête pour qu'on le trouve dans la database
    .then(sauce => {
      const fileName = sauce.imageUrl.split("/images/")[1]; // On extrait le nom du fichier de sauce retourné en promesse, le split nous retourne un tableau de tout ce qui avant /images et images/
      fs.unlink(`images/${fileName}`, () => { // fonction du package fs. 1er argu correspond au chemin du fichier, le 2nd c'est le callback pour supprimer le fichier
        Sauce.deleteOne({_id: req.params.id}) // Puis dans le callback, on supprime l'objet dans la database en précisant son id en paramètre
          .then(() => res.status(200).json({message: "Objet supprimé"}))
          .catch(error => res.status(400).json({ error }));
      })
    .catch(error => {res.status(400).json({ error })});  
    });
}

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then((sauces) => {res.status(200).json(sauces)})
    .catch(error => {res.status(400).json({ error })});
  };

exports.likeSauce = (req, res, next) => {
  switch(req.body.like) {

    case 0: 
    Sauce.findOne({_id: req.params.id}) // On cherche la sauce dans la database à travers son id
      .then((sauce) => {
        if(sauce.usersLiked.find(user => user === req.body.userId)) { // Si id utilisateur se trouve dans le tableau usersLiked, on appelle une méthode qui va mettre à jour les données
          Sauce.updateOne({_id: req.params.id},
            {$inc: {likes: -1}, // on décrémente son like
             $pull: {usersLiked: req.body.userId}, // on retire son id du tableau usersLiked
            _id: req.params.id
          })
            .then(() => res.status(201).json({message: "Vous avez annulé votre like"}))
            .catch(error => res.status(400).json({ error }));
        };
        if(sauce.usersDisliked.find(user => user === req.body.userId)) {
          Sauce.updateOne({_id: req.params.id}, 
            {$inc: {dislikes: -1},
             $pull: {usersDisliked: req.body.userId}, 
            _id: req.params.id
          })
            .then(() => res.status(201).json({message: "Vous avez annulé votre dislike"}))
            .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }));
        
    break;

    case 1: 
    Sauce.updateOne({_id: req.params.id}, // On cherche la sauce dans notre database en prenant l'id de la sauce en paramètre de requête puis on met à jour
    {$inc: {likes: 1}, // on incrémente le like
    $push: {usersLiked: req.body.userId}, // on ajoute au tableau usersLiked pour garder les préférences de l'utilisateur
    _id: req.params.id
    })
      .then(() => res.status(201).json({message: "Like enregistré"}))
      .catch(error => res.status(400).json({ error }));
    break;

    case -1: 
    Sauce.updateOne({_id: req.params.id}, 
    {$inc: {dislikes: 1},
    $push: {usersDisliked: req.body.userId},
    _id: req.params.id
    })
      .then(() => res.status(201).json({message: "Dislike enregistré"}))
      .catch(error => res.status(400).json({ error }));
    break;

    default:
      console.log(Error)
  }
};





