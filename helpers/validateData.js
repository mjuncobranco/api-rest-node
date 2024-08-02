//importar validador

const validator = require("validator");

const validateData = (parametros) => {
  let validate_title =
    !validator.isEmpty(parametros.title) &&
    validator.isLength(parametros.title, { min: 5, max: undefined });
  let validate_content = !validator.isEmpty(parametros.content);

  if (!validate_title || !validate_content) {
    throw new Error("Unable to validate data provided");
  };

};

module.exports = {
  validateData
}