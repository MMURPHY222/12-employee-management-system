# 12-employee-management-system

## User Story

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

## Functionality

```
This app allows users to manage their employee database through the terminal. They are able to add employee's, roles, and departments. While also viewing all employees, roles, and departments. There is also functionality to update employee roles, and delete employees. 
```

## Link to video

https://drive.google.com/file/d/11sJPkO-KQbAg57X74AUkBYp6EplWSlMv/view

## Usage

```
This app uses node, inquirer, and mysql. Inquirer is used to gather user input through the terminal and mysql is the database that holds and returns all user input. The main code runs off of the same start function. 
```
```javascript
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
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
                    updateEmpRole();
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
```

```
The big list of questions contains the list of choices for what the user's options are at each main junction. Upon a choice, those other functions are run which may contain more prompts, or may only show results from the database. 
```

```
Each of the View All prompts have similar functions within them. They all involve a SELECT * and print results. View All employees looks like this. 
```

```javascript
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
```

```
The inner join is there to allow for additional role data to be displayed for each employee. Because first_name and last_name are the only things displayed in the employee table, while title, salary, and department are displayed in the role that coincides with the foreign key. 
```

```
The delete employee function looks like this 
```

```javascript
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
```

```
Initially it prompts user's with a dynamic list of all the employee names, and then upon selection it accesses that user's id and uses that to reference which user to remove from the database. 
```