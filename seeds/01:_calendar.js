
exports.seed = function(knex) {
  // Deletes ALL existing entries
    let createQuery =
        `INSERT INTO Calendar (type) VALUES ('grados')`
    return knex.raw(createQuery)
};
