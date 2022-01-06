var corsOptions = {
  origin: '*', //Se pueden configurar aquellos dominios a rechazar
  methods: "GET,HEAD,PUT,POST,DELETE", //Metodos admitidos
  preflightContinue: false,
  optionsSuccessStatus: 204 // algunos browsers legados como IE11 o algunas SmartTVs no funcionan  con 204, si os pasa poner 200
}

module.exports = {corsOptions: corsOptions}