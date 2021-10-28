"use strict";

const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema(
    {
 userId:                { type: String, required: true, unique: true }, // unique pour s'assurer qu'il est unique
 name:                  { type: String },
 manufacturer:          { type: String },
 description:           { type: String },
 mainPepper:            { type: String },
 imageUrl:              { type: String },
 heat:                  { type: Number },
 likes:                 { type: Number, default: 0 }, // default initialise le nombre de like sur le front
 dislikes:              { type: Number, default: 0 },
 usersLiked:            [{type: String}],
 usersDisliked:         [{type: String}]
});


module.exports = mongoose.model("Sauce", sauceSchema);