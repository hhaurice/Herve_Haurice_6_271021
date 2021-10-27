const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // plugin pour s'assurer que les adresses email sont uniques

const userSchema = mongoose.Schema({
 email:    { type: String, required: true, unique: true },
 password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // on applique le plugin à notre schéma

module.exports = mongoose.model("User", userSchema);