const express = require('express');
const router = express.Router();

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

function montar_fechas (Date) {
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
router.post('/updateCalendar',(req, res) =>{
    
    console.log("Recibido del front" + req.body)
    const data = {
        date_start1: req.body.fecha_inicio_1,
        date_start2: req.body.fecha_inicio_2,
        date_startSeptember: req.body.convSeptiembre,
        //fecha_fin_1 : req.body.fecha_fin_1,
        //fecha_fin_2 : req.body.fecha_fin_2,
       // fecha_inicio_ev1 : req.body.fecha_inicio_ev_1,
        //fecha_inicio_ev2 : req.body.fecha_inicio_ev_2,
        //fecha_fin_ev_1 : req.body.fecha_fin_ev_1,
        //fecha_fin_ev_2 : req.body.fecha_fin_ev_2,
        course : req.body.curso,
        grade: "Grado",
        lastUpdate: req.body.lastUpdate

    }

    


})




module.exports = router;
