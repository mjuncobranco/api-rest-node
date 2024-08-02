//metodos http
const mongoose = require("mongoose");

//importo mi modelo que usare para guardar datos
const Article = require("../models/Article");

const { validateData } = require("../helpers/validateData");
//cada metodo aplicado a una ruta que devuelve un resultado;

//importar libreria fs, file-system para borrar archivos, es de node
const fs = require("fs");

//importar libreria path:
const path = require("path");

//metodo GET Test console.log
const testingRoute = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una accion de prueba del controlador de articulos",
  });
};
//metodo GET courses(json)
const courses = (req, res) => {
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
};

//crear un POST para agregar articulo
const create = (req, res) => {
  //recoger parametros(data) que post va a guardar
  let parametros = req.body;

  //validar datos usando libreria validator.js

  //datos a validar si titulo o content NOT EMPTY

  try {
    validateData(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing data.",
    });
  }

  //fin de validacion

  //crear el objeto a guardar,
  // conectado a la bbdd, desde el modelo
  //crear el objeto de manera automatica new Model(variable contiene req.body):
  const article = new Article(parametros);

  //forma manual de guardar datos en objeto
  // article.title= parametros.title;
  // article.content= parametros.content;
  //Recordar que puedo asignar valores a objeto basado en el modelo(manual o automatico)

  //guardar articulo en bbdd con .save
  article
    .save()
    .then((error, articleSaved) => {
      //devolver resultado
      return res.status(201).json({
        status: "success",
        mensaje: "articulo guardado con exito",
        article: articleSaved,
      });

      //devolver error si captura error
    })
    .catch((error) => {
      if (error || !articleSaved) {
        return res.status(400).json({
          status: "error",
          mensaje: "No se ha guardado el article",
        });
      }
    });
};
//**RECORDAR QUE FIND() Y EXEC() NO ACEPTAN CALLBACK,
//UTILIZAN::::::::::::::::::::::::::::::::::::::
//metodo GET ASYNC Y TRY-CATCH para obtener todos los articulos
//::::::::::::::::::::::::::::::::::::::::::::::
const getArticles = async (req, res) => {
  //consulto para obtener articulos, llamando al modelo, con find y exec error, articulos

  try {
    const articles = await Article.find({}).exec();

    return res.status(200).json({
      status: "success",
      articles,

      //contador muestra cantidad de resultados obtenidos
      // counter: Article.length
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "can't find the articles!",
    });
  }
};

//Hacer GET BY PARAMS OPTIONAL USADO COMO FILTRO

const getByParamsOpcional = async (req, res) => {
  try {
    //declaro con let para cambiar resultados si hay params luego
    let resultados = await Article.find({})

      //ordenando con .sort({date:-1})fecha mas nueva

      .sort({ date: -1 })
      .exec();
    //si hay params,cambio resultado limitando a 3
    if (req.params.ultimos) {
      //limitando a 3 resultados
      resultados = await Article.find({}).limit(3).sort({ date: -1 }).exec();
    }
    return res.status(200).json({
      status: "success",
      resultados,
      counter: Article.length,
      parametro_opcional: req.params.ultimos,
      //muestro value de parametros opcionales recibidos
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "can't get articles with optional params",
    });
  }
};
//metodo para traer un elemento especifico
//GET BY ID OBLIGATORIO
const getById = async (req, res) => {
  try {
    //recoger el id por la url
    const id = req.params.id;

    //buscar el articulo por id

    let articulo = await Article.findById(id);

    if (articulo) {
      //devolver resultado si existe el id
      return res.status(200).json({
        status: "success",
        articulo,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "can't find the id or the article is empty",
      });
    }

    //sino existe ese id, devolver error
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Unable to get this article.",
    });
  }
};

//metodo DELETE, Borrar un articulo
const deleteArticle = async (req, res) => {
  try {
    //recoger el id por la url
    let article_id = req.params.id;

    // Verificar si el ID tiene un formato válido
    if (!mongoose.Types.ObjectId.isValid(article_id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid ID format.",
      });
    }
    //buscar el articulo por id
    let articulo = await Article.findByIdAndDelete(article_id);
    //otra opcion: .findOneAndDelete({_id: articulo_id})

    //condicion para mostrar articulo si lo encuentra

    if (articulo) {
      return res.status(200).json({
        status: "success",
        mensaje: "article deleted!",
        articulo,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "can't find the id",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Unable to delete.",
    });
  }
};

//metodo UPDATE para modificar/actualizar un articulo

const updateArticle = async (req, res) => {
  //recoger id de req.params.id
  let article_id = req.params.id;
  // Verificar si el ID tiene un formato válido
  if (!mongoose.Types.ObjectId.isValid(article_id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format.",
    });
  }
  //recoger todo el body del req y guardarlo en parametros
  let parametros = req.body;

  //valido titulo y content con funcion helper validateData

  try {
    validateData(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing data.",
    });
  }

  //fin validacion

  //********fin codigo de validacion id mongoose****

  //si el articulo tiene contenido y la actualizacion es exitosa
  try {
    // Verificar si el artículo existe antes de intentar actualizarlo
    const articleExists = await Article.exists({ _id: article_id });
    if (!articleExists) {
      return res.status(404).json({
        status: "error",
        message: "Article not found for updating.",
      });
    }

    let articulo = await Article.findByIdAndUpdate(article_id, parametros, {
      new: true,
    });
    if (articulo) {
      return res.status(200).json({
        status: "success",
        mensaje: "article updated!",
        articulo,
      });

      //respuesta si no se concreto la actualizacion
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

///funcion para validar, recibe parametros a validar.
// const validateData = (parametros) => {
//   let validate_title =
//     !validator.isEmpty(parametros.title) &&
//     validator.isLength(parametros.title, { min: 5, max: undefined });
//   let validate_content = !validator.isEmpty(parametros.content);

//   if (!validate_title || !validate_content) {
//     throw new Error("Unable to validate data provided");
//   };

// };

const uploadImg = async (req, res) => {
  //config multer

  //recoger fichero
  if (!req.file && !req.files) {
    return res.status(400).json({
      status: "error",
      message: "Invalid request.",
    });
  }
  //nombre del archivo
  let archivo = req.file.originalname;
  // guardo la extension del archivo con split (jpg)
  // en solicitud http se ve:   "archivo_split": [
  //     "cat",
  //     "jpg"
  // ],
  let archivo_split = archivo.split(".");
  let archivo_extension = archivo_split[1];
  //comprobar extension correcta
  if (
    archivo_extension !== "jpg" &&
    archivo_extension !== "png" &&
    archivo_extension !== "gif" &&
    archivo_extension !== "jpeg"
  ) {
    //borrar archivo que subamos que no sea formato permitido
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        message: "File format invalid.",
      });
    });
  } else {
    //recoger id del articulo a editar:
    let article_id = req.params.id;
    //buscar el documento y actualizar con img/file subida
    try {
      let article = await Article.findByIdAndUpdate(
        article_id,
        { img: req.file.filename },
        { new: true }
      );

      if (article) {
        //devolver mensaje de exito y actualizar el articulo
        return res.status(200).json({
          status: "success",
          message: "document updated successfully.",
          article,
          fichero: req.file,
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "Can't find id to update document.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Can't find id to update document.",
      });
    }
  }
};

//funcion para mostrar las img subidas en key: fichero

const displayImg = async (req, res) => {
  //fichero representa el nombre de la img que quiero buscar: article6575757.jpg
  let fichero = req.params.fichero;
  //** con esta url puedo ver ficheros img en postman y local url:
  //http://localhost:3900/api/image/article1721999697079erizo.jpg  //path a images/article para acceder
  let img_route = "./images/articles/" + fichero;
  //accedo con fs metodo stat a la imagen en mi ruta
  //recordar pasar ruta, error, exists como params
  fs.stat(img_route, (error, exists) => {
    if (exists) {
      //libreria para acceder al path de img y mostrar en postman img
      return res.sendFile(path.resolve(img_route));
    } else {
      //sino encuentra el fichero/img dara error
      return res.status(404).json({
        status: "error",
        message: "img not found.",
      });
    }
  });
};

//buscador de archivos/articulos
const search = async (req, res) => {
  try {
    //que necesito buscar? obtener string de busqueda desde params
    let searching = req.params.my_search;
    console.log(searching);

     
    //find OR, buscar si el key tiene por ej una letra
    //es como una consulta a bbdd
    //guardo busqueda en foundItems:

    let foundItems = await Article.find({
      $or: [
        { title: { $regex: searching, $options: "i" } },
        { content: { $regex: searching, $options: "i" } },
      ],
    })
    //ordeno por fecha mas actual de items
      .sort({ date: -1 })
      //ejecuto consulta
      .exec();
//devolviendo el resultado
    if (foundItems.length > 0) {
      return res.status(200).json({
        status: "success",
        foundItems,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: " Sorry, no items found!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: " Something went wrong!",
    });
  }


};

const emptySearch = (req, res) => {

    return res.status(400).json({
      status: "error",
      message: "Search parameter is required and cannot be empty",
    });
  }


module.exports = {
  testingRoute,
  courses,
  create,
  getArticles,
  getByParamsOpcional,
  getById,
  deleteArticle,
  updateArticle,
  uploadImg,
  displayImg,
  search,
  emptySearch
};
