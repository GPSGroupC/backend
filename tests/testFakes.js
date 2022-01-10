module.exports = class Dia {
    constructor(date, type, horarioCambiado, semanaAB, description) {
        this.date = date;
        this.type = type;
        this.horarioCambiado = horarioCambiado;
        this.semanaAB = semanaAB;
        this.description = description;
    }

    createFakeDayInfo (day) {
        var listDays = []
        var dayFormatted = new Object()
            dayFormatted.date =  this.date 
            dayFormatted.type = this.type !== null ? this.type : "lectivo"
            dayFormatted.horarioCambiado = this.horarioCambiado !== null ? this.horarioCambiado : null
            dayFormatted.semanaAB = this.semanaAB !== null ? this.semanaAB : "c"
            dayFormatted.description = this.description !== null ? this.description : ""
        listDays.push(JSON.stringify(dayFormatted))
        return listDays
    }
}
