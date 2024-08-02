const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

//inicializar la app de node
console.log("App de node funcionando");

//conectandome a la bd
connection();

//crear el servidor Node

const app = express();
const port = 3900;

//configurar el cors
app.use(cors());

//convertir body a objeto js
app.use(express.json()); //recibir datos con content-type de json
app.use(express.urlencoded({ extended: true })); //form-urlencoded

//crear rutas
app.get("/probando", (req, res) => {
  console.log("ejecutando endpoint/probando");

  //probando retornar un json, array de obj
  return res.status(200).json([
    {
      curso: "FSWD",
      autor: "melina",
      url: "htt://melina.com",
    },
    {
      curso: "FSWD",
      autor: "melina",
      url: "htt://melina.com",
    },
  ]);
});
//RUTAS : importo rutas para poder usar

const routes_articles = require("./routes/article");

//cargar rutas para usarla con app:
app.use("/api", routes_articles);


//probando retornar un objeto en port
// return res.status(200).send({
//   curso: "FSWD",
//   autor: "melina",
//   url: "htt://melina.com"
// })

//probando retornar un html element en port
// `<div>
// <h1>probando ruta node.js</h1>
// <p>creando api con rest Nod.js</p>
// </div>`


//lanzando el servidor en puerto

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
