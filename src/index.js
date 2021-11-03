//Esto es una prubea para CI
const express = require('express');
const cors = require('cors')
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

//Routes
app.use(require('./routes/controller'));

module.exports = app;