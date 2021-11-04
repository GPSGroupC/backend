const request = require('supertest');
const app = require('../src/index');

describe('Testing Calendar rest API', () =>{


    const data = {
        tipo:"Grado",
        course:"2049-2050",
        fecha_inicio_1:"09-09-2049",
        fecha_inicio_2:"09-02-2050",
        convSeptiembre:"09-09-2050"
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
        
            //Falta deletear el calendario creado para dejar la base de datos como estaba
        })
        
    })

    it('DELETE /calendar/deleteCalendar/:curso Elimina un calendario del curso que se le indique ', function(done) {
      
        request(app)
        .delete('/calendar/deleteCalendar/' + data.course)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (_ ,response) =>{
            expect(response.body.rowCount).toEqual("1")
            done();
        })
       
        
    })

})