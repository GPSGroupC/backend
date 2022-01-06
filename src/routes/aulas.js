const express = require('express');
const router = express.Router();
const {connection, pgPromiseDB, pgp} = require('../db/conexion')
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

function eliminarFichero (path) {
    fs.unlink(path, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("File removed:", path);
        }
    });
}

// Importar un CSV con las aulas
router.post('/importarAulas', fileUpload, (req,res) => {
    const insertQueryAulas = "INSERT into aulas (acronimo,nombre,capacidad,edificio,esimportada) VALUES ($1,$2,$3,$4,$5)"

    const {
        body: { conservarNoImportadas }
    } = req;

    // Vacíamos las tablas teniendo en cuenta si el usuario quiere conservar las aulas no importadas o no
    console.log(conservarNoImportadas)
    if (conservarNoImportadas === 'true') {
        console.log("Conservamos las aulas no importadas")
        connection.query("DELETE from aulas WHERE esimportada = true",(err) => {
            if(err) {
                console.log(err.message)
            }
        });
    } else {
        connection.query("TRUNCATE TABLE aulas RESTART IDENTITY");
    }

    // Transformamos el fichero .xlsx en .csv
    const excel = XLSX.readFile(path.join(__dirname, '../files/' + req.file.filename));
    XLSX.writeFile(excel, path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), { bookType: "csv", FS: ';'});

    // Leemos el fichero línea por línea
    var i = 0
    lineReader.eachLine(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), function(line) {
        if(i > 0) {
            line = line.replace(/\"/g,"")
            var fieldsArray = line.split(';')
            connection.query(insertQueryAulas,[fieldsArray[1],fieldsArray[2],fieldsArray[3],fieldsArray[4],true], err =>{
                if(err){
                    console.log(err.message)
                    console.log("Error al insertar aula: " + fieldsArray[0] + ',' + fieldsArray[1] + ',' + fieldsArray[2] + ',' + fieldsArray[3] + ',' + fieldsArray[4])
                }
            });
        }
        i++
    });

    // Eliminamos los ficheros para que no ocupen espacio en el server
    //eliminarFichero(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'));
    //eliminarFichero(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.xlsx'));

    res.status(200).send("Aulas importadas")
})

// Añadir un CSV con aulas (en este caso, no se eliminan las aulas que se habían importado/añadido anteriormente)
router.post('/anyadirAulas', fileUpload, (req,res) => {
    const insertQueryAulas = "INSERT into aulas (acronimo,nombre,capacidad,edificio,esimportada) VALUES ($1,$2,$3,$4,$5)"

    // Transformamos el fichero .xlsx en .csv
    const excel = XLSX.readFile(path.join(__dirname, '../files/' + req.file.filename));
    XLSX.writeFile(excel, path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), { bookType: "csv", FS: ';'});

    // Leemos el fichero línea por línea
    var i = 0
    lineReader.eachLine(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), function(line) {
        if(i > 0) {
            line = line.replace(/\"/g,"")
            var fieldsArray = line.split(';')
            connection.query(insertQueryAulas,[fieldsArray[1],fieldsArray[2],fieldsArray[3],fieldsArray[4],false], err =>{
                if(err){
                    console.log(err.message)
                    console.log("Error al insertar aula: " + fieldsArray[0] + ',' + fieldsArray[1] + ',' + fieldsArray[2] + ',' + fieldsArray[3] + ',' + fieldsArray[4])
                }
            });
        }
        i++
    });

    // Eliminamos los ficheros para que no ocupen espacio en el server
    //eliminarFichero(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'));
    //eliminarFichero(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.xlsx'));

    res.status(200).send("Aulas añadidas")
})

// Obtener todos los planes almacenados en la base de datos (se usaría para que el usuario pueda elegir para que plan quiere crear un nuevo horario)
router.get('/obtenerPlanes', (req, res) => {
    connection.query("SELECT * FROM planes",(err, result) => {
        if (err) throw err;
        if (result.rowCount > 0) {
            console.log("Obtenidos " + result.rowCount + " planes");
            res.json(result.rows);
        }else {
            res.json({
                message: 'No hay planes almacenados'
            })
        }
    });
});

// Obtener todas las aulas almacenadas en la base de datos
router.get('/obtenerAulas', (req, res) => {
    connection.query("SELECT * FROM aulas ORDER BY id",(err, result) => {
        if (err) throw err;
        if (result.rowCount > 0) {
            console.log("Obtenidas " + result.rowCount + " aulas");
            res.json(result.rows);
        }else {
            res.json({
                message: 'No hay aulas almacenadas'
            })
        }
    });
});

// Añadir un aula
router.post('/anyadirAula', (req, res) => {
    const aulaObj = {
        acronimo: req.body.acronimo,
        nombre: req.body.nombre,
        capacidad: req.body.capacidad,
        edificio: req.body.edificio
    }
    const insertQueryAula = "INSERT into aulas (acronimo,nombre,capacidad,edificio,esimportada) VALUES ($1,$2,$3,$4,$5) RETURNING id"
    connection.query(insertQueryAula,[aulaObj.acronimo,aulaObj.nombre,aulaObj.capacidad,aulaObj.edificio,false], (err, result) => {
        if(err) {
            console.log(err.message)
            console.log("Error al añadir aula: " + aulaObj.acronimo + ',' + aulaObj.nombre + ',' + aulaObj.capacidad + ',' + aulaObj.edificio)
            res.status(500).send("Error al añadir aula")
        } else {
            res.status(200).send("" + result.rows[0].id + "")
        }
    });
});

// Editar un aula
router.put('/editarAula/:id', (req, res) => {
    const {id} = req.params;
    const aulaObj = {
        acronimo: req.body.acronimo,
        nombre: req.body.nombre,
        capacidad: req.body.capacidad,
        edificio: req.body.edificio
    }
    const updateQueryAula =`UPDATE aulas SET acronimo='${aulaObj.acronimo}', nombre='${aulaObj.nombre}', capacidad='${aulaObj.capacidad}', edificio='${aulaObj.edificio}' WHERE id=${id}`;
    connection.query(updateQueryAula, error => {
        if (error) {
            res.status(500).send("Error al editar aula")
        } else {
            res.status(200).send('Aula actualizada');
        }
    });
});

// Eliminar un aula
router.delete('/eliminarAula', (req, res) => {
    const aulaObj = {
        id: req.body.id
    }
    const sql = `DELETE FROM aulas WHERE id=${aulaObj.id}`;

    connection.query(sql, error => {
        if (error) {
            res.status(500).send("Error al eliminar aula")
        } else {
            res.status(200).send('Aula eliminada');
        }
    });
});

// Vaciar tablas de asignaturas y planes
router.delete('/vaciarAulas', (req, res) => {
    connection.query("TRUNCATE TABLE aulas RESTART IDENTITY");
    res.status(200).send("Tabla aulas truncada")
});

module.exports = router;