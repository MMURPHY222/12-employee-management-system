const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT || 3306,
    user: 'root',
    password: 'mysql',
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

addEmployeeQs = [
    {
        type: "input",
        message: "What is the employee's first name?",
        name:"employeeFirst"
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name:"employeeLast"
    },
    {
        type: "list",
        message: "What is the employee's role?",
        name:"employeeRole",
        choices:["Sales lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"],
    },
    // {
    //     type: "list",
    //     message: "Who is the employee's manager?",
    //     name:"employeeManager",
    //     choices:["lists all managers"],
    // },
];

const start = () => {
    inquirer
        .prompt(bigList)
        .then((answer) => {
            switch (answer.bigListChoice) {
                case "View All Employees":
                    // TODO: show all employees
                    break;
                case "View All Employees by Department":
                    // TODO: prompt for which department - Engineering, Finance, Legal, Sales
                    // TODO: show chart for selected department
                    break;
                case "View All Employees by Manager":
                    // TODO: prompt to choose manager, lists all managers
                    // TODO: chart of returned employees with chosen manager
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    // TODO: prompt list of all employees, chosen one gets removed
                    // console log (EMployee removed)
                    break;
                case "Update Employee Role":
                    // TODO: something
                    break;
                case "Update Employee Manager":
                    // TODO: something
                    break;
                default:
                    connection.end();
            }
        }
        
        );
};

const addEmployee = () => {
    inquirer
        .prompt(addEmployeeQs)
        .then((answer) => {
            connection.query(
                `INSERT INTO employee SET ?`,
                {
                    first_name: answer.employeeFirst,
                    last_name: answer.employeeLast,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Employee Created!');
                    // re-prompt the user 
                    start();
                }
            );
        })
};



connection.connect((err) => {
    if (err) throw err;

    // run the start function after the connection is made to prompt the user
    start();
  });
  