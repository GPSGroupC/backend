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

    createFakeDayAsObject(semestre){
        var dayAsObject = new Object()
        dayAsObject.diafecha = this.date
        dayAsObject.semestername = semestre
        dayAsObject.semana_a_b = this.semanaAB !== null ? this.semanaAB : "c"
        dayAsObject.docencia = this.type !== null ? this.type : "lectivo"
        dayAsObject.horariocambiado = this.horarioCambiado !== null ? this.horarioCambiado : null
        dayAsObject.festividad = this.description !== null ? this.description : ""
        return dayAsObject
    }
}
