const app = require('./index.js')
const express = require('express');



// Settings
app.set('port', process.env.PORT || 8000);


app.listen(app.get('port'), () => {
    console.log(`Server listening on port `,app.get('port'));
})