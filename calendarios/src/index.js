//Esto es una prubea para CI
const express = require('express');
const app = express();

// Settings
app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), () => {
    console.log(`Server listening on port `,app.get('port'));
})
