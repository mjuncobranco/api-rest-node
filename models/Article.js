//importo Schema y model de mongoose
const { Schema, model } = require("mongoose");

const ArticleSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  img: {
    type: String,
    default: "default.png",
  },

},
{versionKey: false});
//model con 3 params
//exporto con model("nombre_collection_mayYsing, schema, nombre_collection")
module.exports = model("Article", ArticleSchema, "articles");
