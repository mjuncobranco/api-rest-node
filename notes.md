1-crear repo
2-npm init
3-npm install express --save
4-npm install mongoose --save
5-npm install multer --save
6-npm install cors --save
7-npm install nodemon --save-dev
8-npm install validator --save
9-configuro scripts: start: "nodemon index.js" para visualizar en vivo cambios en archivos
10-Brew services list- muestra conexion a mongodb started
11-Creo conexion a db mongo con mongoose
con funcion async y try catch para error
12-Inicializo en index.js la app conectada a la db, visualizo con npm start
13-Creo servidor node express, pruebo puerto y conexion a bd con peticion http
14-creo carpeta model. El archivo modelo siempre singular y Mayuscula(como clase). **Recordar cuando exporto modelo, dar 3 params. ver ejemplo
15-creo carpeta controller. Archivo minuscula y singular.Aqui van metodos http, debo exportar c/u
16-Creo carpeta routes:  Recordar que todos metodos salen de router que se importa de express.
17- Debo importar routes y usar rutas en app.
Recordar: "/api" siempre uso barra : / delante, pero no detras de path para evitar conflicto
18-creacion de metodos http conectados a las rutas. Crear funcion de validacion(helpers) de datos con validator.js
19-Manejar subidas de img con multer.js
20-importar fs, path para manejar subida de img
21-Crear buscador /search 
