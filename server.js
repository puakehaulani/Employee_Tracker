var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeesDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View all roles",
                "View all departments",
                // "View all employees by manager", B
                "Add employee",
                // "Remove employee", B
                "Update employee role",
                // "Update employee manager", B
                // "Add department",
                // "Remove department", B
                // "Add role",
                // "Remove role", B
                // "View total utilized budget of department",B
                "Quit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    var query = "SELECT * FROM employee";
                    connection.query(query, function (err, res) {
                        console.table(res);
                        runSearch();
                    });

                    break;

                case "View all roles":
                    employeeByRole();
                    break;

                case "View all departments":
                    var query = "SELECT * FROM department";
                    connection.query(query, function (err, res) {
                        console.table(res);
                        runSearch();
                    });

                    break;

                // case "View all employees by manager":
                //     viewByManager();
                //     runSearch();
                //     break;

                case "Add employee":
                    addEmployee();
                    break;

                //     case "Remove employee":
                //     removeEmployee();
                //     break;

                case "Update employee role":
                    updateEmployee();
                    break;

                //     case "Update employee manager":
                // 
                //     break;

                //     case "Add department":
                //
                //     break;

                //     case "Remove department":
                //     
                //     break;

                //     case "Add role":
                //   
                //     break;

                //     case "Remove role":
                //   
                //     break;

                //     case "View total utilized budget of department":
                //
                //     break;

                case "Quit":
                    console.log("Bye");
                    connection.end();
                    break;
            }
        });
}

function employeeByRole() {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        console.table(res);
        runSearch();
    });

}


// function viewByManger() {
//     inquirer
//         .prompt({
//             name: "viewManagers",
//             type: "list",
//             message: "Select a manager:"
//             choices:[]
//         })
//         .then(function (answer) {
//             var query = "SELECT * FROM department";
//             connection.query(query, function (err, res) {
//                 console.table(res);
//                 //   for (var i = 0; i < res.length; i++) {
//                 //     console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//                 //   }
//             });
//         });
// }

function addEmployee() {
    inquirer
        .prompt([{
            name: "first_name",
            type: "input",
            message: "Enter first name"
        }, {
            name: "last_name",
            type: "input",
            message: "Enter last name"
        }, {
            name: "role_id",
            type: "number",
            message: "Enter role id number"
        }, {
            name: "manager_id",
            type: "input",
            message: "Enter manager id number, if applicable. If no manager id required, enter null"
        }])
        .then(function (answer) {
            var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
            var values = [answer.first_name, answer.last_name, answer.role_id, answer.manager_id];
            connection.query(query, values, function (err, res) {

                var check = "SELECT * FROM employee";
                connection.query(check, function (err, res) {
                    console.table(res);
                    runSearch();
                });

            });


        })

};

function removeEmployee() {

    runSearch();
};

function updateEmployee() {
    connection.query("SELECT id, first_name, last_name FROM employee;", function (err, res) {
        if (err) throw err;
        console.log(res);
        const map1 = res.map(array => {
            var object = {
                name: `${array.first_name} ${array.last_name}`,
                value: array.id
            }
            return object
        });

        inquirer
            .prompt({
                name: "update",
                type: "list",
                message: "Choose an employee to update",
                choices: map1
            })
            .then(function (response) {

                connection.query("SELECT id, title FROM role;", function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    const map2 = res.map(array => {
                        var object = {
                            name: array.title,
                            value: array.id
                        }
                        return object
                    });
                    inquirer.prompt({
                        name: "roleUpdate",
                        type: "list",
                        message: "What is the employee's new role?",
                        choices: map2
                    }).then(function (answer) {
                        let values = [answer.roleUpdate, response.update];
                        connection.query("UPDATE employee SET role_id = ? WHERE id=?", values, function (err, res) {
                            if (err) throw err;

                            connection.query("SELECT * FROM employee WHERE id=?", response.update, function (err, res) {
                                if (err) throw err;
                                console.table(res);
                                runSearch();
                            }
                            );
                        })
                    })
                })

            })
    });
}