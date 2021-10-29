const express = require('express');
const db= require('../db/factory.js')
const router = express.Router();

const calendar = [
    "2022" , "2023"
]

//Endpoint to debug factory.js (remove)
router.get('/test', async(req,res,next) =>{
    try {
        course = await db.getCalendar()
        console.log("express: ",course)
        if (course !== undefined) {res.sendStatus(200)}
        else {res.sendStatus(404)}
    } catch(err) {
        next(err)
    }
})


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




module.exports = router;
