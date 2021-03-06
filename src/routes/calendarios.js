const express = require('express');
const router = express.Router();
const Parser = require('../utils/parser');
const {connection, pgPromiseDB, pgp} = require('../db/conexion')

const calendar = [
    "2022" , "2023"
]

//Estilo no Rest
router.get('/dateCalendar',(req,res) =>{
    
    const elemento = calendar.find(fecha => fecha == req.query.course)
    if (elemento == undefined) {
        res.status(404);
    }else{
        res.json({ 
            status : "200",
            message : "Año encontrado"
        })
    }
})

//Estilo Rest
router.get('/calendar/grades/:course', (req, res) =>{

    const elemento = calendar.find(fecha => fecha == req.params.course)
    if (elemento == undefined) {
        res.status(404);
    }else{
        res.json({ 
            status : "200",
            message : "Año encontrado"
        })
    }

})


 router.delete('/calendar/deleteCalendar/:curso', async (req, res) => {

    const curso = req.params.curso
    const userId = await connection.query(`DELETE FROM calendario WHERE curso = $1`,[curso])
    res.json({
        status : "200",
        rowCount : userId.rowCount.toString()
    })
    
});

router.post('/calendar/updateCalendar',(req, res) =>{
    
    const lUpdate = Parser.formatDate(new Date()) 
    const data = {
        date_start1: Parser.formatDate(req.body.fecha_inicio_1),
        date_start2: Parser.formatDate(req.body.fecha_inicio_2),
        date_startSeptember: Parser.formatDate(req.body.convSeptiembre),
        date_endSeptember : Parser.formatDate(req.body.finconvSeptiembre),
        course : req.body.course,
        lastUpdate: lUpdate,
        grade: "Grado",

    }
    console.log(data.lastUpdate)
    const sql_query = "SELECT * FROM calendario WHERE curso = $1"
    connection.query(sql_query,[data.course],(err, result) => {
        if(err){
            res.status(500).send("Server error finding course")
        }else{
            if(result.rowCount === 0){              
                const insertQuery = "INSERT into calendario (tipo,curso,fechainicio1,fechainicio2,fechainiciosept,fechafinsept,fechaultmodificacion) VALUES ($1,$2,$3,$4,$5,$6,$7)"
                connection.query(insertQuery,[data.grade,data.course,data.date_start1,data.date_start2,data.date_startSeptember,data.date_endSeptember,data.lastUpdate], err =>{
                    if(err){
                        console.log(err.message)
                        res.status(500).send("Server Error on insert")
                    }else{
                        res.status(201).send("Creado nuevo curso")

                    }
                })
            }else{
                const updateQuery = "UPDATE calendario SET fechainicio1=$1, fechainicio2=$2,fechainiciosept=$3,fechafinsept=$4,fechaultmodificacion=$5 WHERE curso = $6"
                connection.query(updateQuery,[data.date_start1,data.date_start2,data.date_startSeptember,data.date_endSeptember,data.lastUpdate,data.course], err =>{
                    if(err){
                        console.log(err.message)
                        res.status(500).send("Server Error on update")
                    }else{
                        res.status(200).send("Actualizado curso")

                    }
                })
            }
            

        }
    })
  


})
/**
 * Documentación del ENDPOINT
 * Request:
 * Recibe un JSON tal que así:
 *  {
 *      course: curso actual Ej: ("2021-2022")
 *      semesterName: (semestre1 | semestre2 | recuperacion) uno de estos posibles valores
 *      //Este 2º campo recibe un array con todos los dias de ese periodo (semesterName)
 *      semester: [
 *          {
 *             date: fecha del día concreto del calendario formato DD-MM-YYYY
 *             type: lectivo | convocatoria | festivo
 *             horariocambiado: null | ( L,M,X,J,V) segun el día cambiado, null -> indica que no es un día cambiado
 *             semanaAB: a | b | c, donde: a -> Semana A, b -> Semana B, c-> día sin prácticas
 *          }
 *      ]
 * 
 *  }
 * 
 */
router.put('/calendar/updateSemester',(req, res) =>{
  
    /**INSERT into semanas (semesterName,cursoCalendario,tipo,diaFecha,docencia,semanaAB,horarioCambiado) VALUES() */
    
    const diasSemestre = req.body.semester
    const semesterName = req.body.semesterName
    const curso = req.body.course
    const InsertQuery = 'INSERT into semanas(semestername,cursocalendario,tipo,diafecha,docencia,semana_a_b,horariocambiado,festividad) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (cursocalendario,diafecha) ' +
    'DO UPDATE SET docencia=$5,semana_a_b=$6,horariocambiado=$7,festividad=$8'
    const queriesToBeSent = []
        
    var promise = new Promise(function(resolve, reject) {
        diasSemestre.forEach( (fecha) =>{
            try{
                //Devuelve el String de JSONs como un objeto de jsones
                jsonedDate = JSON.parse(fecha)
                const queryObject = {query: InsertQuery, values: [semesterName,curso,"Grado",
                jsonedDate.date,jsonedDate.type,jsonedDate.semanaAB,jsonedDate.horarioCambiado,jsonedDate.description]}
                queriesToBeSent.push(queryObject)
            } catch(sysntaxError){
                reject(sysntaxError)
            }
            
        });
        resolve()
    })
    
    promise.then( () => {
        const SQL = pgp.helpers.concat(queriesToBeSent);
        //Enviamos toda la Query de Golpe garantizando consistencia
        //Descomentar para ver las queries que se mandan
        //console.log(SQL)
        pgPromiseDB.multi(SQL).then((t) =>{
            res.sendStatus(200)
        }).catch( err => {
            console.log(err)
            res.status(500).send(err)
        })

    }).catch( err => {
        console.log(err)
        res.status(500).send("Syntax Error on Parsing")
    })        
    
   
    
})


router.get('/calendar/getCalendar',(req, res) =>{
    
    const sql_query = "SELECT * FROM calendario WHERE curso = $1"
    connection.query(sql_query,[req.query.course],(err,response) =>{
        if(err){
            console.log(err.message)
            res.status(500).send("Server Error")
        }else{
            if(response.rowCount === 0){
                res.status(204).send("No course found")
            }else{
                res.status(200).send(response.rows)
            }
        }
    })
})

router.get('/calendar/getDaysCalendar', async (req,res) =>{

    const SELECT_QUERY = "SELECT diafecha,semestername,semana_a_b,docencia,horariocambiado,festividad FROM semanas WHERE cursocalendario=$1 AND semestername=$2";
    //Curso y semestre del que queremos obtener la informacion de los dias.
    const cursoPedido = req.query.cursoCalendario
    const semestrePedido = req.query.semesterName

    const response = await connection.query(SELECT_QUERY,[cursoPedido,semestrePedido])

    res.json({
        //Array con todos los días de ese semestre
        message: response.rows,
        status: "200"
    })
})




module.exports = router;
