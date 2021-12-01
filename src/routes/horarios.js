const express = require('express');
const router = express.Router();
const connection = require('../db/conexion')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
XLSX = require('xlsx');
const lineReader = require('line-reader');

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../files'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('file')

router.post('/importarAsignaturas', fileUpload, (req,res) => {

    const insertQueryAsignaturas = "INSERT into asignaturas (codasig,nombre,codplan,curso,periodo,vinculo,destvinculo,numgrupos,alumprev,horasestteoria,horasprofteoria," +
    "horasestproblemas,horasprofproblemas,horasestpracticas,horasprofpracticas) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)"
    const insertQueryPlanes = "INSERT into planes (codplan,nombre,numcursos,numperiodos,numgrupos) VALUES ($1,$2,$3,$4,$5)"
    const selectQueryPlanes = "SELECT * from planes WHERE codplan = $1"

    // Vacíamos las tablas
    connection.query("TRUNCATE TABLE asignaturas RESTART IDENTITY");
    connection.query("TRUNCATE TABLE planes")

    // Transformamos el fichero .xlsx en .csv
    const excel = XLSX.readFile(path.join(__dirname, '../files/' + req.file.filename));
    XLSX.writeFile(excel, path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), { bookType: "csv", FS: ';'});

    // Leemos el fichero línea por línea
    var i = 0
    lineReader.eachLine(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), function(line) {
        if(i > 2) {
            var fieldsArray = line.split(';')
            //console.log(fieldsArray[3] + ',' + fieldsArray[4] + ',' + fieldsArray[11] + ',' + fieldsArray[12] + ',' + fieldsArray[17] + ',' + fieldsArray[18] + ',' + fieldsArray[21] + ',' + fieldsArray[22]
            //+ ',' + fieldsArray[23] + ',' + fieldsArray[24] + ',' + fieldsArray[30] + ',' + fieldsArray[31] + ',' + fieldsArray[32] + ',' + fieldsArray[33] + ',' + fieldsArray[34] + ',' + fieldsArray[35])
            connection.query(insertQueryAsignaturas,[fieldsArray[3],fieldsArray[4],fieldsArray[11],fieldsArray[17],fieldsArray[18],fieldsArray[21],fieldsArray[22],fieldsArray[23],
                fieldsArray[24],fieldsArray[30],fieldsArray[31],fieldsArray[32],fieldsArray[33],fieldsArray[34],fieldsArray[35]], err =>{
                if(err){
                    console.log(err.message)
                    console.log("Error al insertar asignatura: " + fieldsArray[3] + ',' + fieldsArray[4] + ',' + fieldsArray[11] + ',' + fieldsArray[17] + ',' + fieldsArray[18] + ',' + fieldsArray[21] + ',' + fieldsArray[22]
                    + ',' + fieldsArray[23] + ',' + fieldsArray[24] + ',' + fieldsArray[30] + ',' + fieldsArray[31] + ',' + fieldsArray[32] + ',' + fieldsArray[33] + ',' + fieldsArray[34] + ',' + fieldsArray[35])
                }
            });

            connection.query(selectQueryPlanes,[fieldsArray[11]],(err, result) => {
                if(err){
                    //console.log("Server error finding course")
                }else{
                    if(result.rowCount === 0){              
                        connection.query(insertQueryPlanes,[fieldsArray[11],fieldsArray[12],'4','2',fieldsArray[23]], err => {
                            if(err){
                                //console.log(err.message)
                                //console.log("Error al insertar plan")
                            }
                        })
                    }
                }
            });
        }
        i++
    });

    // Eliminamos los ficheros para que no ocupen espacio en el server
    fs.unlink(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("File removed:", path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'));
        }
    });
    fs.unlink(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.xlsx'), function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("File removed:", path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.xlsx'));
        }
    });

    res.status(200).send("Asignaturas importadas")
})

router.post('/importarAulas', fileUpload, (req,res) => {
    const insertQueryAulas = "INSERT into aulas (id,acronimo,nombre,capacidad,edificio) VALUES ($1,$2,$3,$4,$5)"

    // Vacíamos la tabla
    connection.query("TRUNCATE TABLE aulas");

    // Transformamos el fichero .xlsx en .csv
    const excel = XLSX.readFile(path.join(__dirname, '../files/' + req.file.filename));
    XLSX.writeFile(excel, path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), { bookType: "csv", FS: ';'});

    // Leemos el fichero línea por línea
    var i = 0
    lineReader.eachLine(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), function(line) {
        if(i > 0) {
            line = line.replace(/\"/g,"")
            var fieldsArray = line.split(';')
            connection.query(insertQueryAulas,[fieldsArray[0],fieldsArray[1],fieldsArray[2],fieldsArray[3],fieldsArray[4]], err =>{
                if(err){
                    console.log(err.message)
                    console.log("Error al insertar aula: " + fieldsArray[0] + ',' + fieldsArray[1] + ',' + fieldsArray[2] + ',' + fieldsArray[3] + ',' + fieldsArray[4])
                }
            });
        }
        i++
    });

    // Eliminamos los ficheros para que no ocupen espacio en el server
    fs.unlink(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("File removed:", path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'));
        }
    });
    fs.unlink(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.xlsx'), function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("File removed:", path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.xlsx'));
        }
    });

    res.status(200).send("Aulas importadas")
})

module.exports = router;