const express = require('express');
const router = express.Router();
const connection = require('../db/conexion')

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

const jsonPruebas = {
    "Septiembre": {
        "semana": [
        {
            "n_semana": "1",
            "inicio": "13/9/2021",
            "fin": "19/9/21",
            "Lunes" : {
                "fecha_especial": "0",
                "tipo_dia" : "A",     
            },
            "Martes" : {
                "fecha_especial": "0",
                "tipo_dia" : "A",     
            },
            "Miercoles" : {
                "fecha_especial": "0",
                "tipo_dia" : "A",     
            },
            "Jueves" : {
                "fecha_especial": "0",
                "tipo_dia" : "A",     
            },
            "Viernes" : {
                "fecha_especial": "0",
                "tipo_dia" : "A",     
            }
        
        },
        {
            "n_semana": "2",
            "inicio": "20/9/2021",
            "fin": "26/9/21",
            "Lunes" : {
                "fecha_especial": "0",
                "tipo_dia" : "B",     
            },
            "Martes" : {
                "fecha_especial": "0",
                "tipo_dia" : "A",     
            },
            "Miercoles" : {
                "fecha_especial": "0",
                "tipo_dia" : "A",     
            },
            "Jueves" : {
                "fecha_especial": "0",
                "tipo_dia" : "A",     
            },
            "Viernes" : {
                "fecha_especial": "0",
                "tipo_dia" : "A",     
            }
        }

        ]
    }
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function montar_fechas (date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

router.post('/testing',(req, res) =>{
    for(var attributename in jsonPruebas){
        //console.log(attributename.hasOwnProperty("semana"))
        //console.log(attributename+": "+jsonPruebas[attributename]);
        //console.log(jsonPruebas[attributename].semana)
        var comodin = jsonPruebas[attributename].semana
        for (let index = 0; index < comodin.length; index++) {
            console.log("La semana del " + comodin[index].n_semana + " tiene: \n");
            var fecha_troceada = comodin[index].inicio.split('/')
            date = new Date(fecha_troceada[2],fecha_troceada[1] - 1, fecha_troceada[0])
            console.log("El lunes " + montar_fechas(date) + "de tipo: " + comodin[index].Lunes.tipo_dia +  "\n")
            date = date.addDays(1)
            console.log("El martes " + montar_fechas(date) + "de tipo: " + comodin[index].Martes.tipo_dia +  "\n")
        }
        
    }
    res.send(jsonPruebas)
})

/**
 * Interfaz para hacer el update del calendario.
 * Posible JSON recibido:
 * {
 *  "Septiembre (mes)" : {
 *      "semana": [
 *          "n_semana" : 1,
 *          "inicio" : 13/9/21,
 *          "fin": 19/9/21,
 *          "Lunes" : {
 *              "fecha_especial" : 1 o 0
 *              "tipo_dia" : A , B, C, D, F
 *              //Solo si fecha especial = 1
 *              "Dia_Correspondiente" : "LUNES,MARTES,MIERCOLES,JUEVES,VIERNES"
 *              "Festividad" : "Día de la Constitución Española"
 *          },
 *          "Martes" : {
 *              "fecha_especial" : 1 o 0
 *              "tipo_dia" : A , B, C, D, F
 *              //Solo si fecha especial = 1
 *              "Dia_Correspondiente" : "LUNES,MARTES,MIERCOLES,JUEVES,VIERNES"
 *              "Festividad" : "Día de la Constitución Española"
 *          },
 *              
 *      ],
 *      [
 *          "n_semana" : 2,
 *          "inicio" : 13/9/21,
 *          "fin": 19/9/21,
 *          "Lunes" : {
 *           ...
 *          }         
 *      ] 
 *  }
 * }
 * 
 * 
 */


/**
 * 
 * @param {Receive a date type in any format} date 
 * @returns the date parsed on format DD-MM-YYYY.
 */
 function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
}

router.post('/calendar/updateCalendar',(req, res) =>{
    
    console.log(req.body)
    let date = new Date()
    const lUpdate = date.getDay() + "-" + (date.getMonth() + 1) + "-" +date.getFullYear()
    
    const data = {
        date_start1: formatDate(req.body.fecha_inicio_1),
        date_start2: formatDate(req.body.fecha_inicio_2),
        date_startSeptember: formatDate(req.body.convSeptiembre),
        //fecha_fin_1 : req.body.fecha_fin_1,
        //fecha_fin_2 : req.body.fecha_fin_2,
       // fecha_inicio_ev1 : req.body.fecha_inicio_ev_1,
        //fecha_inicio_ev2 : req.body.fecha_inicio_ev_2,
        //fecha_fin_ev_1 : req.body.fecha_fin_ev_1,
        //fecha_fin_ev_2 : req.body.fecha_fin_ev_2,
        course : req.body.course,
        lastUpdate: lUpdate,
        grade: "Grado",

    }
    console.log(data)
    const sql_query = "SELECT * FROM calendario WHERE curso = $1"
    connection.query(sql_query,[data.course],(err, result) => {
        if(err){
            res.status(500).send("Server error finding course")
        }else{
            if(result.rowCount === 0){              
                const insertQuery = "INSERT into calendario (tipo,curso,fechainicio1,fechainicio2,fechainiciosept,fechaultmodificacion) VALUES ($1,$2,$3,$4,$5,$6)"
                connection.query(insertQuery,[data.grade,data.course,data.date_start1,data.date_start2,data.date_startSeptember,data.lastUpdate], err =>{
                    if(err){
                        console.log(err.message)
                        res.status(500).send("Server Error on insert")
                    }else{
                        res.status(200).send("Creado nuevo curso")

                    }
                })
            }else{
                const updateQuery = "UPDATE calendario SET fechainicio1=$1, fechainicio2=$2,fechainiciosept=$3, fechaultmodificacion=$4 WHERE curso = $5"
                connection.query(updateQuery,[data.date_start1,data.date_start2,data.date_startSeptember,data.lastUpdate,data.course], err =>{
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

router.get('/calendar/getCalendar',(req, res) =>{
    
    const sql_query = "SELECT * FROM calendario WHERE curso = $1"
    connection.query(sql_query,[req.query.course],(err,response) =>{
        if(err){
            console.log(err.message)
            res.status(500).send("Server Error")
        }else{
            if(response.rowCount === 0){
                res.status(225).send("No course found")
            }else{
                res.status(200).send(response.rows)
            }
        }
    })
})




module.exports = router;
