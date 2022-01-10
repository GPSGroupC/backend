const request = require('supertest');
const app = require('../src/index');
const path = require('path');
const Dia = require('./testFakes');
const { Console } = require('console');
const res = require('express/lib/response');
const { Http2ServerResponse } = require('http2');

describe('Testing Calendar API', () =>{
   
    const fakeDay = new Dia("12/09/2050","festivo",null,"A",null)
    var fulfilledPromise

    const data = {
        tipo:"Grado",
        course:"1949-1950",
        fecha_inicio_1:"09-09-2049",
        fecha_inicio_2:"09-02-2050",
        convSeptiembre:"09-09-2050",
        finconvSeptiembre:"19-09-2050",
    }

    const fakeCalendarsDayData = {
        course: data.course,
        semesterName: "semestre1",
        semester: fakeDay.createFakeDayInfo()

    }
       
    it('GET /calendar/id RESTFUL ', (done) => {
        request(app)
        .get('/calendar/grades/2022')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.body).toEqual({
                status: "200",
                message: "Año encontrado"
            })
            done()
        })
        
    })

    it('GET /calendar/id axios style ', (done) => {
        request(app)
        .get('/dateCalendar')
        .query({course: "2022"})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_ ,response) => {
            expect(response.body).toEqual({
                status: "200",
                message: "Año encontrado"
            })
            done();
        })
        
    })

    it('GET /calendar/getCalendar Crea un calendario y posteriormente comprueba que ese calendario ha sido correctamente creado ', function(done) {
      
        request(app)
        .post('/calendar/updateCalendar')
        .send(data)
        .end(function(){
            request(app)
            .get('/calendar/getCalendar')
            .query({course: data.course})
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, ( _ , res) =>{
                const expectedCourse = res.body[0].curso
                const actualCourse = data.course               
                expect(expectedCourse).toEqual(actualCourse) 
                done();       
            })
        
        })
       
        
    })

    it('PUT /calendar/updateSemester Test para comprobar el endpoint updateSemester cuando se actualizan los dias de un semestre', ()=>{
        
        request(app)
        .post('/calendar/updateCalendar')
        .send(data)
        .then( () => {
             request(app)
            .put('/calendar/updateSemester')
            .send(fakeCalendarsDayData)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, (_, response)=>{
                expect(response.status).toEqual(200)
                expect(response.text).toEqual("OK")
                request(app)
                    .delete('/calendar/deleteCalendar/' + data.course)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200, (_ ,response) =>{
                        expect(response.body.rowCount).toEqual("1")
                    })
            })
                
        })
            
       

    })


    it('GET /calendar/getCalendar Test para comprobar el endpoint getCalendar cuando se pide un calendario no existente', () =>{
        request(app)
        .get('/calendar/getCalendar')
        .query({course: "1930-1931"})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_ ,response) =>{
            //Esperamos que el tipo de respuesta sea del tipo 204 , calendar not found
            expect(response.status).toEqual(204)
        })
        
    })

    it('DELETE /calendar/deleteCalendar/:curso Intenta eliminar un curso que no existe de la tabla calendarios ', function(done) {
        
        request(app)
            .delete('/calendar/deleteCalendar/' + "1500-1501")
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, (_ ,response) =>{
                //El número de filas borradas en la tabla calendarias debería ser 0
                expect(response.body.rowCount).toEqual("0")
                done();
       })
        
        
    })

})

describe('Testing Asignaturas y Aulas API', () =>{
    var idasig = ""
    var idaula = ""

    it('POST /anyadirAsignatura Añadir una nueva asignatura manualmente', (done) => {
        // Añadir asignatura con éxito
        request(app)
        .post('/anyadirAsignatura')
        .send({codasig:"500",
                nombre:"hola",
                area:"adios",
                codplan:"512",
                plan:"grado",
                curso:"1",
                periodo:"S1",
                destvinculo:"0",
                horasestteoria:"30",
                horasestproblemas:"30",
                horasestpracticas:"30"})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toBeDefined()
            expect(response.status).toEqual(200)
            idasig = response.text  // Guardamos el id para poder editarla y eliminarla en los siguientes tests
        })
        // Añadir asignatura con error
        request(app)
        .post('/anyadirAsignatura')
        .send({codasig:"50",
                nombre:"hola",
                area:null,
                codplan:"512",
                plan:"grado",
                curso:"1",
                periodo:"S1",
                destvinculo:"0",
                horasestteoria:"30",
                horasestproblemas:"30",
                horasestpracticas:"30"})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Error al añadir asignatura")
            expect(response.status).toEqual(500)
            done()
        })
    })

    it('GET /obtenerAsignaturas Obtener todo el listado de asignaturas', (done) => {
        request(app)
        .get('/obtenerAsignaturas')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.body.message).toEqual(undefined) // Si no recibe mensaje quiere decir que ha encontrado al menos una asignatura
            done()
        })
    })

    it('GET /obtenerAsignaturasHorario Obtener las asignaturas de un horario en concreto', (done) => {
        request(app)
        .get('/obtenerAsignaturasHorario')
        .query({codplan:"512",
                curso:"1",
                periodo:"S1"})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.body.message).toEqual(undefined) // Si no recibe mensaje quiere decir que ha encontrado al menos una asignatura
            done()
        })
    })

    it('PUT /editarAsignatura/:id Editar una asignatura', (done) => {
        request(app)
        .put('/editarAsignatura/' + idasig)
        .send({codasig:"500",
                nombre:"hola",
                area:"adios",
                codplan:"514",
                plan:"master",
                curso:"2",
                periodo:"S2",
                destvinculo:"0",
                horasestteoria:"50",
                horasestproblemas:"50",
                horasestpracticas:"50"})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Asignatura actualizada")
            expect(response.status).toEqual(200)
            done()
        })
    })

    it('DELETE /eliminarAsignatura Eliminar una asignatura', (done) => {
        request(app)
        .delete('/eliminarAsignatura')
        .send({id:idasig})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Asignatura eliminada")
            expect(response.status).toEqual(200)
            done()
        })
    })

    it('POST /anyadirAula Añadir un aula manualmente', (done) => {
        // Añadir aula con éxito
        request(app)
        .post('/anyadirAula')
        .send({acronimo:"b53",
                nombre:"Aula prueba",
                capacidad:"57",
                edificio:"1"})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toBeDefined()
            expect(response.status).toEqual(200)
            idaula = response.text  // Guardamos el id para poder editarla y eliminarla en los siguientes tests
        })
        // Añadir aula con error
        request(app)
        .post('/anyadirAula')
        .send({acronimo:"b53",
                nombre:null,
                capacidad:"57",
                edificio:"1"})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Error al añadir aula")
            expect(response.status).toEqual(500)
            done()
        })
    })

    it('GET /obtenerAulas Obtener todo el listado de aulas', (done) => {
        request(app)
        .get('/obtenerAulas')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.body.message).toEqual(undefined) // Si no recibe mensaje quiere decir que ha encontrado al menos una asignatura
            done()
        })
    })

    it('PUT /editarAula/:id Editar un aula', (done) => {
        request(app)
        .put('/editarAula/' + idaula)
        .send({acronimo:"b55",
                nombre:"Aula editada",
                capacidad:"100",
                edificio:"2"})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Aula actualizada")
            expect(response.status).toEqual(200)
            done()
        })
    })

    it('DELETE /eliminarAula Eliminar un aula', (done) => {
        request(app)
        .delete('/eliminarAula')
        .send({id:idaula})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Aula eliminada")
            expect(response.status).toEqual(200)
            done()
        })
    })
})

describe('Testing Importar Asignaturas y Aulas desde excel API', () =>{
    it('POST /importarAsignaturas Importar asignaturas desde un excel', (done) => {
        request(app)
        .post('/importarAsignaturas')
        .field("Content-Type", "multipart/form-data")
        .field("conservarNoImportadas", false)
        .attach("file", path.join(__dirname, 'Listado207test.xlsx'))
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Asignaturas importadas")
            expect(response.status).toEqual(200)
            done()
        })
    })

    it('POST /anyadirAsignaturas Añadir asignaturas desde un excel', (done) => {
        request(app)
        .post('/anyadirAsignaturas')
        .field("Content-Type", "multipart/form-data")
        .attach("file", path.join(__dirname, 'Listado207test.xlsx'))
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Asignaturas añadidas")
            expect(response.status).toEqual(200)
            done()
        })
    })

    /*it('GET /obtenerPlanes Obtener todo el listado de planes', (done) => {
        request(app)
        .get('/obtenerPlanes')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.body.message).toEqual(undefined) // Si no recibe mensaje quiere decir que ha encontrado al menos un plan
            done()
        })
    })*/

    it('POST /importarAulas Importar aulas desde un excel', (done) => {
        request(app)
        .post('/importarAulas')
        .field("Content-Type", "multipart/form-data")
        .field("conservarNoImportadas", false)
        .attach("file", path.join(__dirname, 'aulastest.xlsx'))
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Aulas importadas")
            expect(response.status).toEqual(200)
            done()
        })
    })

    it('POST /anyadirAulas Añadir aulas desde un excel', (done) => {
        request(app)
        .post('/anyadirAulas')
        .field("Content-Type", "multipart/form-data")
        .attach("file", path.join(__dirname, 'aulastest.xlsx'))
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Aulas añadidas")
            expect(response.status).toEqual(200)
            done()
        })
    })

    it('DELETE /vaciarAsignaturas Vaciar tabla asignaturas', (done) => {
        request(app)
        .delete('/vaciarAsignaturas')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Tabla asignaturas truncada")
            expect(response.status).toEqual(200)
            done()
        })
    })

    it('DELETE /vaciarAulas Vaciar tabla aulas', (done) => {
        request(app)
        .delete('/vaciarAulas')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_, response) => {
            expect(response.text).toEqual("Tabla aulas truncada")
            expect(response.status).toEqual(200)
            done()
        })
    })
})