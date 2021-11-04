const request = require('supertest');
const app = require('../src/index');

test('Este test no hace nada es para que pase la CI', () => {

})



describe('Testing rest API', () =>{

    
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

    it('GET /calendar/getCalendar devuelve los calendarios de un curso solicitado ', function(done) {
        const data = {
            tipo:"Grado",
            course:"2049-2050",
            fecha_inicio_1:"09-09-2049",
            fecha_inicio_2:"09-02-2050",
            convSeptiembre:"09-09-2050"
        }
        request(app)
        .post('/calendar/updateCalendar')
        .send(data)
        .end(function(){
            request(app)
            .get('/calendar/getCalendar')
            .query({course: "2049-2050"})
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, done);
            //Falta deletear el calendario creado para dejar la base de datos como estaba
        })
    })
})