const express = require('express');
const router = express.Router();
const { connection, pgPromiseDB, pgp } = require('../db/conexion')

// Crear un horario
router.post('/anyadirHorario', (req, res) => {
    const horarioObj = {
        codplan: req.body.codplan,
        curso: req.body.curso,
        periodo: req.body.periodo,
        grupo: req.body.grupo
    }
    const insertQueryHorario = "INSERT into horario (codplan,curso,periodo,grupo) VALUES ($1,$2,$3,$4) RETURNING id"
    connection.query(insertQueryHorario, [horarioObj.codplan, horarioObj.curso, horarioObj.periodo, horarioObj.grupo], (err, result) => {
        if (err) {
            console.log(err.message)
            console.log("Error al añadir horario: " + horarioObj.codplan + ',' + horarioObj.curso + ',' + horarioObj.periodo + ',' + horarioObj.grupo)
            res.status(500).send("Error al añadir horario")
        } else {
            res.status(200).send("" + result.rows[0].id + "")
        }
    });
});

// Eliminar un horario
router.delete('/eliminarHorario', (req, res) => {
    const horarioObj = {
        id: req.body.id
    }
    const sql = `DELETE FROM horario WHERE id=${horarioObj.id}`;

    connection.query(sql, error => {
        if (error) {
            res.status(500).send("Error al eliminar horario")
        } else {
            res.status(200).send('Horario eliminado');
        }
    });
});

// Guardar/editar las clases del tablero de un horario
router.post('/listadoClases/:idhorario', (req, res) => {
    const { idhorario } = req.params;
    console.log(req.body)
    const insertQueryClase = "INSERT into clases (idhorario,codasig,nomasig,dia,hora,duracion,tipo) VALUES ($1,$2,$3,$4,$5,$6,$7)"
    var falloEncontrado = false

    // Primero se elimina completamente el estado actual del tablero
    const sql = `DELETE FROM clases WHERE idhorario=${idhorario}`;
    connection.query(sql, error => {
        if (error) {
            console.log(error.message)
            res.status(500).send("Ha ocurrido un error al eliminar el estado anterior del horario")
        } else {
            console.log("Estado anterior del tablero eliminado")
            // Ahora se inserta el nuevo estado del tablero
            req.body.listadoClases.map(function (clase) {
                connection.query(insertQueryClase, [idhorario, clase.codasig, clase.nomasig, clase.dia, clase.hora, clase.duracion, clase.tipo], err => {
                    if (err) {
                        console.log(err.message)
                        falloEncontrado = true
                    } else {
                        console.log("Clase añadida")
                    }
                });
            });
        }
    });

    if (falloEncontrado === 'true') {
        res.status(500).send("Ha ocurrido un error al guardar alguna clase")
    } else {
        res.status(200).send('Listado de clases añadido correctamente');
    }
});

// Guardar/editar las clases del tablero de un horario (IMPORTANTE: solo usar en caso de que se envie tablero completo incluyendo las horas que están vacías)
router.put('/listadoClases/:idhorario', (req, res) => {
    const { idhorario } = req.params;
    console.log(req.body)
    const selectQueryClase = "SELECT * from clases WHERE idhorario = $1 AND dia = $2 AND hora = $3"
    const updateQueryClase = "UPDATE clases SET codasig=$1, nomasig=$2, dia=$3, hora=$4, duracion=$5, tipo=$6 WHERE id = $7"
    const insertQueryClase = "INSERT into clases (idhorario,codasig,nomasig,dia,hora,duracion,tipo) VALUES ($1,$2,$3,$4,$5,$6,$7)"
    var falloEncontrado = false

    req.body.listadoClases.map(function (clase) {
        connection.query(selectQueryClase, [idhorario, clase.dia, clase.hora], (err, resultSelect) => {
            if (err) throw err;
            if (resultSelect.rowCount > 0) {
                connection.query(updateQueryClase, [clase.codasig, clase.nomasig, clase.dia, clase.hora, clase.duracion, clase.tipo, resultSelect.rows[0].id], err => {
                    if (err) {
                        console.log(err.message)
                        falloEncontrado = true
                    } else {
                        console.log("Clase actualizada")
                    }
                });
            } else {
                connection.query(insertQueryClase, [idhorario, clase.codasig, clase.nomasig, clase.dia, clase.hora, clase.duracion, clase.tipo], err => {
                    if (err) {
                        console.log(err.message)
                        falloEncontrado = true
                    } else {
                        console.log("Clase añadida")
                    }
                });
            }
        });
    });

    if (falloEncontrado === 'true') {
        res.status(500).send("Ha ocurrido un error al guardar alguna clase")
    } else {
        res.status(200).send('Listado de clases añadido correctamente');
    }
});

// Obtener todas las clases del tablero de un horario concreto
router.get('/listadoClases', (req, res) => {
    const selectQueryClases = "SELECT * FROM clases WHERE idhorario = $1 ORDER BY dia,hora"
    connection.query(selectQueryClases, [req.body.idhorario], (err, result) => {
        if (err) throw err;
        if (result.rowCount > 0) {
            console.log("Obtenidas " + result.rowCount + " clases");
            res.json(result.rows);
        } else {
            res.json({
                message: 'No hay clases almacenadas para ese horario'
            })
        }
    });
});

module.exports = router;