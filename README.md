# Repositorio backend 
Repositorio donde va a residir el código de backend de la asigntura de gestión del  proyecto software.
## Instalar dependencias
Para instalar dependencias de módulos que otros compañeros hayan usado, utilizar npm y la orden `npm install`, esto automáticamente instala todos aquellos módulos externos que se estén usando en el proyecto.
## Gestión de postgres
Se utiliza Sequelize como ORM para gestionar una base de datos postgres.  
Ventajas:
* Como Sequelize se encarga de la creación de las tablas SQL, no es necesario
migrarlas desde un entorno de desarrollo en local hacia un entorno de producción en heroku
* Node se conecta automáticamente a un postgres local o a otro de producción gracias a la
variable de entorno DATABASE_URL
### En local
1. Levantar un contenedor postgres:
```bash
npm run startdb
```
2. Eliminar el contenedor de postgres:
```bash
npm run killdb
```
Antes de ejecutar `npm start` tenemos que asegurarnos de haber levantado  
postgres con el paso 1.
### En entorno de producción
No es necesario hacer ningún paso para actualizar la base de datos en producción. 
Cuando se despliegue node en heroku, automáticamente se conectará y la actualizará.




