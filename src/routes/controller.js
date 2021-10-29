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




module.exports = router;
