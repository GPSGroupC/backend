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


// Importar un CSV con asignaturas (se importarán automáticamente todos los planes relativos a dichas a asignaturas)
router.post('/importarAsignaturas', fileUpload, (req,res) => {

    const insertQueryAsignaturas = "INSERT into asignaturas (codasig,nombre,area,codplan,plan,curso,periodo,vinculo,destvinculo,numgrupos,alumprev,horasestteoria,horasprofteoria," +
    "horasestproblemas,horasprofproblemas,horasestpracticas,horasprofpracticas,esimportada) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)"
    const insertQueryPlanes = "INSERT into planes (codplan,nombre,numcursos,numperiodos,numgrupos) VALUES ($1,$2,$3,$4,$5)"
    const selectQueryPlanes = "SELECT * from planes WHERE codplan = $1"

    const {
        body: { conservarNoImportadas }
    } = req;

    // Vacíamos las tablas teniendo en cuenta si el usuario quiere conservar las asignaturas no importadas o no
    console.log(conservarNoImportadas)
    if (conservarNoImportadas === 'true') {
        console.log("Conservamos las asignaturas no importadas")
        connection.query("DELETE from asignaturas WHERE esimportada = true",(err) => {
            if(err) {
                console.log(err.message)
            }
        });
    } else {
        connection.query("TRUNCATE TABLE asignaturas RESTART IDENTITY");
        connection.query("TRUNCATE TABLE planes")
    }

    // Transformamos el fichero .xlsx en .csv
    const excel = XLSX.readFile(path.join(__dirname, '../files/' + req.file.filename));
    XLSX.writeFile(excel, path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), { bookType: "csv", FS: ';'});

    // Leemos el fichero línea por línea
    var i = 0
    lineReader.eachLine(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), function(line) {
        if(i > 2) {
            var fieldsArray = line.split(';')
            //console.log(fieldsArray[3] + ',' + fieldsArray[4] + ',' + fieldsArray[7] + ',' + fieldsArray[11] + ',' + fieldsArray[12] + ',' + fieldsArray[17] + ',' + fieldsArray[18] + ',' + fieldsArray[21] + ',' + fieldsArray[22]
            //+ ',' + fieldsArray[23] + ',' + fieldsArray[24] + ',' + fieldsArray[30] + ',' + fieldsArray[31] + ',' + fieldsArray[32] + ',' + fieldsArray[33] + ',' + fieldsArray[34] + ',' + fieldsArray[35])
            connection.query(insertQueryAsignaturas,[fieldsArray[3],fieldsArray[4],fieldsArray[7],fieldsArray[11],fieldsArray[12],fieldsArray[17],fieldsArray[18],fieldsArray[21],fieldsArray[22],fieldsArray[23],
                fieldsArray[24],fieldsArray[30],fieldsArray[31],fieldsArray[32],fieldsArray[33],fieldsArray[34],fieldsArray[35],true], err =>{
                if(err){
                    console.log(err.message)
                    console.log("Error al insertar asignatura: " + fieldsArray[3] + ',' + fieldsArray[4] + ',' + fieldsArray[7] + ',' + fieldsArray[11] + ',' + fieldsArray[12] + ',' + fieldsArray[17] + ',' + fieldsArray[18] + ',' + fieldsArray[21] + ',' + fieldsArray[22]
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
    //eliminarFichero(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'));
    //eliminarFichero(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.xlsx'));

    res.status(200).send("Asignaturas importadas")
})


// Añadir un CSV con asignaturas (en este caso, no se eliminan las asignaturas que se habían importado/añadido anteriormente)
router.post('/anyadirAsignaturas', fileUpload, (req,res) => {

    const insertQueryAsignaturas = "INSERT into asignaturas (codasig,nombre,area,codplan,plan,curso,periodo,vinculo,destvinculo,numgrupos,alumprev,horasestteoria,horasprofteoria," +
    "horasestproblemas,horasprofproblemas,horasestpracticas,horasprofpracticas,esimportada) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)"
    const insertQueryPlanes = "INSERT into planes (codplan,nombre,numcursos,numperiodos,numgrupos) VALUES ($1,$2,$3,$4,$5)"
    const selectQueryPlanes = "SELECT * from planes WHERE codplan = $1"

    // Transformamos el fichero .xlsx en .csv
    const excel = XLSX.readFile(path.join(__dirname, '../files/' + req.file.filename));
    XLSX.writeFile(excel, path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), { bookType: "csv", FS: ';'});

    // Leemos el fichero línea por línea
    var i = 0
    lineReader.eachLine(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'), function(line) {
        if(i > 2) {
            var fieldsArray = line.split(';')
            //console.log(fieldsArray[3] + ',' + fieldsArray[4] + ',' + fieldsArray[7] + ',' + fieldsArray[11] + ',' + fieldsArray[12] + ',' + fieldsArray[17] + ',' + fieldsArray[18] + ',' + fieldsArray[21] + ',' + fieldsArray[22]
            //+ ',' + fieldsArray[23] + ',' + fieldsArray[24] + ',' + fieldsArray[30] + ',' + fieldsArray[31] + ',' + fieldsArray[32] + ',' + fieldsArray[33] + ',' + fieldsArray[34] + ',' + fieldsArray[35])
            connection.query(insertQueryAsignaturas,[fieldsArray[3],fieldsArray[4],fieldsArray[7],fieldsArray[11],fieldsArray[12],fieldsArray[17],fieldsArray[18],fieldsArray[21],fieldsArray[22],fieldsArray[23],
                fieldsArray[24],fieldsArray[30],fieldsArray[31],fieldsArray[32],fieldsArray[33],fieldsArray[34],fieldsArray[35],false], err =>{
                if(err){
                    console.log(err.message)
                    console.log("Error al insertar asignatura: " + fieldsArray[3] + ',' + fieldsArray[4] + ',' + fieldsArray[7] + ',' + fieldsArray[11] + ',' + fieldsArray[12] + ',' + fieldsArray[17] + ',' + fieldsArray[18] + ',' + fieldsArray[21] + ',' + fieldsArray[22]
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
    //eliminarFichero(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.csv'));
    //eliminarFichero(path.join(__dirname, '../files/' + path.parse(req.file.filename).name + '.xlsx'));

    res.status(200).send("Asignaturas añadidas")
})

// Añadir una asignatura
router.post('/anyadirAsignatura', (req, res) => {
    const asignaturaObj = {
        codasig: req.body.codasig,
        nombre: req.body.nombre,
        area: req.body.area,
        codplan: req.body.codplan,
        plan: req.body.plan,
        curso: req.body.curso,
        periodo: req.body.periodo,
        destvinculo: req.body.destvinculo,
        horasestteoria: req.body.horasestteoria,
        horasestproblemas: req.body.horasestproblemas,
        horasestpracticas: req.body.horasestpracticas
    }
    const insertQueryAsignatura = "INSERT into asignaturas (codasig,nombre,area,codplan,plan,curso,periodo,destvinculo,horasestteoria,horasestproblemas,horasestpracticas,esimportada) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id"
    connection.query(insertQueryAsignatura,[asignaturaObj.codasig,asignaturaObj.nombre,asignaturaObj.area,asignaturaObj.codplan,asignaturaObj.plan,asignaturaObj.curso,asignaturaObj.periodo,asignaturaObj.destvinculo,asignaturaObj.horasestteoria,asignaturaObj.horasestproblemas,asignaturaObj.horasestpracticas,false], (err, result) => {
        if(err) {
            console.log(err.message)
            console.log("Error al añadir asignatura: " + asignaturaObj.codasig + ',' + asignaturaObj.nombre + ',' + asignaturaObj.area + ',' + asignaturaObj.codplan + ',' + asignaturaObj.plan + ',' + asignaturaObj.curso + ',' + asignaturaObj.periodo + ',' + asignaturaObj.destvinculo + ',' + asignaturaObj.horasestteoria + ',' + asignaturaObj.horasestproblemas + ',' + asignaturaObj.horasestpracticas)
            res.status(500).send("Error al añadir asignatura")
        } else {
            res.status(200).send("" + result.rows[0].id + "")
        }
    });
})

// Eliminar una asignatura
router.delete('/eliminarAsignatura', (req, res) => {
    const asignaturaObj = {
        id: req.body.id
    }
    const sql = `DELETE FROM asignaturas WHERE id=${asignaturaObj.id}`;

    connection.query(sql, error => {
        if (error) {
            console.log(error.message)
            res.status(500).send("Error al eliminar asignatura")
        } else {
            res.status(200).send('Asignatura eliminada');
        }
    });
});

// Editar una asignatura
router.put('/editarAsignatura/:id', (req, res) => {
    const {id} = req.params;
    const asignaturaObj = {
        codasig: req.body.codasig,
        nombre: req.body.nombre,
        area: req.body.area,
        codplan: req.body.codplan,
        plan: req.body.plan,
        curso: req.body.curso,
        periodo: req.body.periodo,
        destvinculo: req.body.destvinculo,
        horasestteoria: req.body.horasestteoria,
        horasestproblemas: req.body.horasestproblemas,
        horasestpracticas: req.body.horasestpracticas
    }
    const updateQueryAsignatura =`UPDATE asignaturas SET codasig='${asignaturaObj.codasig}', nombre='${asignaturaObj.nombre}', area='${asignaturaObj.area}', codplan='${asignaturaObj.codplan}', plan='${asignaturaObj.plan}', curso='${asignaturaObj.curso}',
    periodo='${asignaturaObj.periodo}', destvinculo='${asignaturaObj.destvinculo}', horasestteoria='${asignaturaObj.horasestteoria}', horasestproblemas='${asignaturaObj.horasestproblemas}', horasestpracticas='${asignaturaObj.horasestpracticas}' WHERE id=${id}`;
    connection.query(updateQueryAsignatura, error => {
        if (error) {
            console.log(error.message)
            res.status(500).send("Error al editar asignatura")
        } else {
            res.status(200).send('Asignatura actualizada');
        }
    });
});

// Obtener todas las asignaturas almacenadas en la base de datos
router.get('/obtenerAsignaturas', (req, res) => {
    connection.query("SELECT * FROM asignaturas ORDER BY id",(err, result) => {
        if (err) throw err;
        if (result.rowCount > 0) {
            console.log("Obtenidas " + result.rowCount + " asignaturas");
            res.json(result.rows);
        }else {
            res.json({
                message: 'No hay asignaturas almacenadas'
            })
        }
    });
});

// Obtener todas las asignaturas de un plan, curso y periodo concretos (se usaría para obtener las asignaturas que se pueden agregar al crear un horario específico)
router.get('/obtenerAsignaturasHorario', (req, res) => {
    const selectQueryAsignaturas = "SELECT * FROM asignaturas WHERE codplan = $1 AND curso = $2 AND periodo = $3 ORDER BY id"

    const asignaturaObj = {
        codplan: req.query.codplan,
        curso: req.query.curso,
        periodo: req.query.periodo
    };

    connection.query(selectQueryAsignaturas, [asignaturaObj.codplan,asignaturaObj.curso,asignaturaObj.periodo], (err, result) => {
        if (err) throw err;
        if (result.rowCount > 0) {
            console.log("Obtenidas " + result.rowCount + " asignaturas");
            res.json(result.rows);
        }else {
            res.json({
                message: 'No hay asignaturas almacenadas para ese plan, curso y periodo'
            })
        }
    });
});

// Vaciar tablas de asignaturas y planes
router.delete('/vaciarAsignaturas', (req, res) => {
    connection.query("TRUNCATE TABLE asignaturas RESTART IDENTITY");
    connection.query("TRUNCATE TABLE planes")
    res.status(200).send("Tabla asignaturas truncada")
});

module.exports = router;