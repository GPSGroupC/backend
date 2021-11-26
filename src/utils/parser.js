
/**
 * Clase que contiene algunas funciones para el tratamiento de fechas 
 * 
 */
module.exports = class Parser{

    /**
     * 
     * @param {Receive a date type in any format} date 
     * @returns the date parsed on format DD-MM-YYYY.
     */
    static formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [day, month, year].join('-');
    }
}

