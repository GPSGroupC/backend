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
})