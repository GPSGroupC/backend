# Repositorio backend 
Repositorio donde va a residir el código de backend de la asigntura de gestión del  proyecto software.
## Instalar dependencias
Para instalar dependencias de módulos que otros compañeros hayan usado, utilizar npm y la orden `npm install`, esto automáticamente instala todos aquellos módulos externos que se estén usando en el proyecto.
## Gestión de postgres
Para evitar manipular la bd de producción de heroku directamente, se ha configurado 
una bd postgres para ejecutarse localmente.
Para mover las tablas a postgres desde el directorio migrations/ , se utiliza el comando Knex.

### ¿Cómo trabajar en local?
1. Levanto un contenedor postgres:
```bash
npm run startdb
```
2. Desarrollo código y ejecuto `npm start` cuando quiera.  
* Si quiero crear una tabla, ejecuto `knex migrate:make <nombreTabla>`  
  A continuación me desplazo al directorio migrate/ y añado el código sql al fichero 'nombreTabla.js'
* Si quiero aplicar los cambiols a mi postgres local, ejecuto knex migrate:latest
3. Eliminar el contenedor de postgres:
```bash
npm run killdb
```

### En entorno de producción
No es necesario hacer ningún paso para actualizar la base de datos en producción. 
Cuando se despliegue node en heroku, automáticamente se ejecutará el script "heroku-postbuild"
que utilizará Knex para aplicar las migraciones necesarias.  

Por ejemplo: Si ya se había creado una tabla en un anterior despliegue, en el despliegue
actual solo se añadirán los cambios(migraciones) nuevas.




