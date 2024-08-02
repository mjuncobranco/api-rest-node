const mongoose = require("mongoose");
const connection= async() => {
  try {
    console.log("You've successfully connected to db my_blog");
    await mongoose.connect("mongodb://127.0.0.1:27017/my_blog");
    //parametros en caso de aviso de warning de url:
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useCreateIndex: true,
  } catch (error) {
    console.log(error);
    throw new Error("Unable to connect to db my_blog")
  }
}

module.exports = {connection}