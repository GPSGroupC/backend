
exports.up = function(knex) {
    let createQuery =
        `CREATE TABLE Calendar(
        type TEXT PRIMARY KEY NOT NULL
        )`
    return knex.raw(createQuery)
}

exports.down = function(knex) {
    let dropQuery = `DROP TABLE Calendar`
    return knex.raw(dropQuery)
}
