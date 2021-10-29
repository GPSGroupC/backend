# Repositorio backend 
Repositorio donde va a residir el código de backend de la asigntura de gestión del  proyecto software.
## Instalar dependencias
Para instalar dependencias de módulos que otros compañeros hayan usado, utilizar npm y la orden `npm install`, esto automáticamente instala todos aquellos módulos externos que se estén usando en el proyecto.
## Gestión de postgres
Para evitar manipular la bd de producción de heroku directamente, se ha configurado 
una bd postgres para ejecutarse localmente.
Para mover las tablas a postgres desde el directorio migrations/ , se utiliza el comando Knex.

### ¿Cómo trabajar en local?
* Ejecutar un contenedor postgres:
```bash
npm run startdb
```
* Crear una nueva tabla para la base de datos
```bash
knex migrate:make <nombreTabla>
cd migrations
#Editar fichero 'migrations/nombreTabla.js' con un contenido como este:
#   exports.up = function(knex) {
#     let createQuery =
#         `CREATE TABLE Calendar(
#         type TEXT PRIMARY KEY NOT NULL
#         )`
#     return knex.raw(createQuery)
#   }
#   exports.down = function(knex) {
#       let dropQuery = `DROP TABLE Calendar`
#     return knex.raw(dropQuery)
#   }
```
* Mover las tablas creadas a posgres
```bash
knex migrate:up
```
* Eliminar las tablas de posgres
```bash
knex migrate:down
```
* Poblar con datos iniciales
```bash
# Creo un fichero que contendrá los inserts para la tabla calendar
# Le añado 01 delante para que knex pueda poblar en orden
knex seed:make 01_calendar
# Edito el fichero seed/01_calendar.js con un contenido como este:
#   exports.seed = function(knex) {
#     let createQuery =
#        `INSERT INTO Calendar (type) VALUES ('grados')`
#    return knex.raw(createQuery)
#   };
# Finalmente poblo la base de datos
knex seed:run
```
* Eliminar el contenedor de postgres:
```bash
npm run killdb
```

### Entorno de producción
No es necesario hacer ningún paso para actualizar la base de datos en producción. 
Cuando se despliegue node en heroku, automáticamente se ejecutará el script "heroku-postbuild"
que utilizará Knex para aplicar las migraciones necesarias.  





