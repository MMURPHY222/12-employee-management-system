const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const { restoreDefaultPrompts } = require('inquirer');

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
        choices: ["View All Employees", "View All Employees by Department", "View All Departments", "View All Roles", "View All Employees by Manager", 
        "Add Employee", "Add Department", "Add Role", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Quit"]
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
        choices:["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"],
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
                    showEmployees();
                    break;
                case "View All Employees by Department":
                    viewByDepartment();
                    break;
                case "View All Employees by Manager":
                    // TODO: prompt to choose manager, lists all managers
                    // TODO: chart of returned employees with chosen manager
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
                    updateEmpRole();
                    break;
                case "Update Employee Manager":
                    // TODO: something
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                default:
                    console.log("BYE BYE");
                    connection.end();
            }
        }
        
        );
};

const viewRoles = () => {
    connection.query(`SELECT * FROM role`, function (err, result) {
        if(err) throw err;
        console.table(result);
        start();
    })
};

const addRole = () => {
    connection.query(`SELECT * FROM department`, (err, result) => {

        inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the role you would like to add?",
                name: "roleName"
            },
            {
                type: "input",
                message: "What is the salary?",
                name: "newRoleSalary"
            },
            {
                type: "rawlist",
                message: "Which department would you like you role to be within?",
                name: "roleDept",
                choices() {
                    const deptArray = [];
                    result.forEach(({name}) => {
                        deptArray.push(name);
                    })
                
                    return deptArray;
                }
            }
        ])
        .then((answer) => {
            let chosenDept;
            result.forEach((item) => {
                if(item.name === answer.roleDept) {
                    chosenDept = item.id;
                }
            });

            connection.query(
                `INSERT INTO role SET ?`,
                {
                    title: answer.roleName,
                    salary: answer.newRoleSalary,
                    departmentID: chosenDept,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Role Created!');
                    // re-prompt the user 
                    start();
                }
            );
        })
    })
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department you would like to add?",
                name: "deptName"
            }
        ])
        .then((answer) => {
            connection.query(
                `INSERT INTO department SET ?`,
                {
                    name: answer.deptName,
                },
                (err)  => {
                    if (err) throw err;
                    console.log('Department Created');
                    // re-prompt the user 
                    start();
                }
            )
        })
};

const viewDepartments = () => {
    connection.query(
        `SELECT * FROM department`, function(err, result) {
            if (err) throw err;
            console.table(result);
            start();
        }
    )
};

const addEmployee = () => {
    inquirer
        .prompt(addEmployeeQs)
        .then((answer) => {
            switch (answer.employeeRole) {
                case "Sales Lead" :
                    var roleID = 1;
                    break;
                case "Salesperson":
                    var roleID = 2;
                    break;
                case "Lead Engineer":
                    var roleID = 3;
                    break;
                case "Software Engineer":
                    var roleID = 4;
                    break;
                case "Account Manager":
                    var roleID = 5;
                    break;
                case "Accountant":
                    var roleID = 6;
                    break;
                case "Legal Team Lead":
                    var roleID = 7;
                    break;
                default:
                    var roleID = 0;

            }
            connection.query(
                `INSERT INTO employee SET ?`,
                {
                    first_name: answer.employeeFirst,
                    last_name: answer.employeeLast,
                    role_id: roleID,
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

const showEmployees = () => {
    connection.query(
        `SELECT first_name, last_name, manager_id, title, salary, departmentID
         FROM employee
         INNER JOIN role
         ON employee.role_id = role.id`, function(err,result){
            if (err) throw err;
            console.table(result);
            start();
        }
    )
};

const viewByDepartment = () => {
    connection.query(`SELECT * FROM department`, (err, result) => {
        if(err) throw err;
        inquirer
            .prompt({
                
                type: "list",
                message: "Which department would you like to search by?",
                name:"searchDept",
                choices() {
                    const dept2Array = [];
                    result.forEach(({name}) => {
                        dept2Array.push(name);
                    });
                    return dept2Array;
                }
            })
            .then((answer) => {
                connection.query(
                    `SELECT first_name, last_name, title, salary, name
                     FROM employee
                     JOIN role
                     ON employee.role_id = role.id
                     JOIN department 
                     ON role.departmentID = department.id
                     WHERE department.name = "${answer.searchDept}";`, function(err, result) {
                         if (err) throw (err);
                         console.table(result);
                         start();
                     }
                
                )
            })
    })
};

const removeEmployee = () => {
    connection.query(`SELECT * FROM employee;`, (err, result) => {
        if(err) throw err;
        inquirer.prompt([
            {
                type:"rawlist",
                name:"choice",
                choices() {
                    const empArray = [];
                    result.forEach(({first_name}) => {
                        empArray.push(first_name);
                    });
                    return empArray;
                },
                message:"Which employee would you like to remove?",
            },
        ])
        .then((answer) => {
            let chosenEmp;

            result.forEach((item) => {
                if(item.first_name === answer.choice) {
                    chosenEmp = item.id;
                }
            });

            connection.query(
                `DELETE FROM employee WHERE id = ${chosenEmp};`, function(err, result) {
                 if (err) throw (err);
                 console.log("Employee has been deleted!")
                 start();
            })
        })
    })
};

const updateEmpRole = () => {
    connection.query(`SELECT * FROM employee;`, (err, result) => {
        connection.query('SELECT * FROM role', (err2, result2) => { 
        if(err) throw err;
        if(err2) throw err2;
        inquirer.prompt([
            {
                type:"rawlist",
                name:"choice",
                choices() {
                    const empArray = [];
                    result.forEach(({first_name}) => {
                        empArray.push(first_name);
                    });
                    return empArray;
                },
                message:"Which employee would you like to update?",
            },
            {
                type: "list",
                name:"roleChoice",
                choices() {
                    const roleArray = [];
                    result2.forEach(({title}) => {
                        roleArray.push(title);
                    })
                    return roleArray;
                },
                message: "What role would you like to update them to?"
            }
        ])
        .then((answer) => {
            let chosenEmp;

            result2.forEach((item) => {
                if(item.title === answer.roleChoice) {
                    chosenEmp = item.id;
                }
            });
            
            connection.query(
                `UPDATE employee SET role_id = "${chosenEmp}" WHERE first_name = "${answer.choice}";`, function(err, result) {
                 if (err) throw (err);
                 console.log("Employee has been updated!")
                 start();
            })
        })
    })
    })
}

connection.connect((err) => {
    if (err) throw err;

    // run the start function after the connection is made to prompt the user
    start();
  });
  