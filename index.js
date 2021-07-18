const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.port || 3306,
    user: 'root',
    password: 'mysql',
    // insert database name
    database: '',
  });

bigList = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'bigListChoice',
        choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", 
        "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Quit"]
    }
]

connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  