//RUTAS EN DONDE APLICARE METODOS DEL CONTROLADOR
//Importo express y luego el metodo Router de express
const express = require("express");
//libreria multer para subir img
const multer = require("multer");
//importo controlador de article que contiene todos metodos:
const ArticleController = require("../controllers/article");
const router = express.Router();

//en almacenamiento guardo img que se van a subir con multer:
const almacenamiento = multer.diskStorage({
  //carpeta destino:
  destination: (req, file, cb) => {
    cb(null, "./images/articles");
  },
  filename: (req, file, cb) => {
    cb(null, "article" + Date.now() + file.originalname);
  },
});

//constante uploads donde llamo multer para subir img 
//guardadas en almacenamiento creado
const uploads = multer({
  storage: almacenamiento
});

//ruta de GET test:
//router.metodo("path",import-controller.methodController)
router.get("/testing-route", ArticleController.testingRoute);

//ruta para hacer GET de courses
router.get("/courses", ArticleController.courses);

//ruta para POST de crear/guardar datos
router.post("/create", ArticleController.create);

//rutas para GET obtener articulos
router.get("/articles", ArticleController.getArticles);

//ruta para GET article BY PARAMS ? == OPCIONAL
router.get("/articles/:ultimos?", ArticleController.getByParamsOpcional);

//ruta para GET article BY PARAMS TIPO ID.(UNICO) Especifico
router.get("/article/:id", ArticleController.getById);

//ruta para DELETE article, recuerda busca y borra por id
router.delete("/article/:id", ArticleController.deleteArticle);

//ruta para PATCH article, actualizar registro
router.put("/article/:id", ArticleController.updateArticle);

//ruta para subir img con multer.js, uploads seria el middleware de multer, antes del controlador
//aqui tambien asigno la img a un doc, actualizando el mismo
router.post("/upload-img/:id", [uploads.single("file0")],ArticleController.uploadImg);
//img seria el nombre del key del campo cuando hago el post

//ruta GET para DISPLAY IMG DEL FICHERO Especifico
//http://localhost:3900/api/image/article1721999697079erizo.jpg
router.get("/image/:fichero", ArticleController.displayImg);


//ruta GET para SEARCH. BUSCADOR
router. get("/search/:my_search", ArticleController.search);

//ruta GET para SEARCH FAILED, SIN PARAMETROS-CONTROLANDO ERROR BUSQUEDA VACIA
router.get("/search/", ArticleController.emptySearch);

//exporto routes, porque todas iran dentro de ella:
module.exports = router;
