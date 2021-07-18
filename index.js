const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.port || 3306,
    user: 'root',
    password: 'mysql',
    // insert database name
    database: 'employeeTracker_DB',
  });

bigList = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'bigListChoice',
        choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", 
        "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Quit"]
    }
];

const start = () => {
    inquirer
        .prompt(bigList)
        .then((answer) => {
            if(answer === "View All Employees"){
                // TODO: show all employees
            } else if(answer === "View All Employees by Department") {
                // TODO: prompt for which department - Engineering, Finance, Legal, Sales
                // TODO: show chart for selected department
            } else if(answer === "View All Employees by Manager") {
                // TODO: prompt to choose manager, lists all managers
                // TODO: chart of returned employees with chosen manager
            } else if(answer === "Add Employee") {
                // TODO: prompt employee questions
            } else if (answer === "Remove Employee") {
                // TODO: prompt list of all employees, chosen one gets removed
                // console log (EMployee removed)
            } else if (answer === "Update Employee Role") {
                // TODO: something
            } else if (answer === "Update Employee Manager") {
                // TODO: something
            } else {
                connection.end();
            }
        
        });
};



connection.connect((err) => {
    if (err) throw err;

    // run the start function after the connection is made to prompt the user
    start();
  });
  