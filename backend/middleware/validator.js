const { body, validationResult } = require('express-validator')

const passwordValidator = () => {
  return [
    // password must be at least 8 characters long
    body("password")
    .isStrongPassword({ 
        minLength: 8, 
        minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, 
        returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, 
        pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 
    })
    .withMessage("Mot de passe doit contenir au moins 8 caractères contenant une majuscule, un symbole et un chiffre")
  ]
};


const validate = (req, res, next) => {
  const error = validationResult(req)
  if (error.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  error.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({error: "Mot de passe doit contenir au moins 8 caractères contenant une majuscule, un symbole et un chiffre"})

};


module.exports = { passwordValidator, validate };