const pool = require("pg").Pool;
const Pool = new pool({
    user: "postgres",
    host: 'localhost',
    database: 'cabinet',
    password: '',
    port: 5432
});


module.exports = Pool;
