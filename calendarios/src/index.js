//Esto es una prubea para CI
const express = require('express');
const app = express();

//var calendarRoute = require('./routes/controller.js');

//Routes
app.use(require('./routes/controller'));


module.exports = app;