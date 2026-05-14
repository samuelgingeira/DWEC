const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "biblioteca.ccdmjeqif2ni.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "samuvilla07",
    database: "portfolio_app"
});

connection.connect((err) => {
    if (err) {
        console.log("Error de conexión:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

module.exports = connection;