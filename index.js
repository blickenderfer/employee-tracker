const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
require("dotenv").config()

async function connectDb(selection) {
    try {
        const db = await mysql.createConnection({ //connecting to the database using the data from the .env file
            host: 'localhost',
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PW
        });

        let rows = [] //declaring variables as empty arrays 
        let inqOutput = []
        if (selection === "Quit") { //conditionally getting requested data from the database
            process.exit()
        } else if (selection === "View all Departments") {
            rows = await db.query("SELECT * FROM department;");
            console.table(rows[0])
        } else if (selection === "View all Roles") {
            rows = await db.query("SELECT role.id, title, salary, department.name AS department FROM role JOIN department ON role.department_id = department.id;");
            console.table(rows[0])
        } else if (selection === "View all Employees") {
            rows = await db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager_table.first_name, ' ', manager_table.last_name)ELSE NULL END AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id JOIN employee manager_table ON employee.manager_id = manager_table.id;") //Joining the employee table to the role table and the department table to gather all necessary employee data. In the case the employee manager id is not null, we gather the data from the manager table. If the manager table is null, we return accordingly. The final JOIN compares the employee table with itself aliased at the manager table. 
            console.table(rows[0])
        } else if (selection === "Add Department") {
            inqOutput = await inquirer.prompt([
                {
                    name: "department",
                    message: "What is the name of the new department?",
                }
            ])
            await db.query(`INSERT INTO department (name) VALUES ('${inqOutput.department}');`)

        } else if (selection === "Add Role") {
            inqOutput = await inquirer.prompt([
                {
                    name: "roleName",
                    message: "What is the name of the new role?"
                },
                {
                    name: "roleSalary",
                    message: "What is the salary of the new role?"
                },
                {
                    name: "roleDepartment",
                    message: "What department does the new role belong to?"
                }
            ])
            const deptId = await db.query(`SELECT IFNULL ((SELECT id FROM department WHERE name = "${inqOutput.roleDepartment}"), "That department does not exist");`) //ensuring the department the user enters for role department actually exists, and returning an error if it doesn't
            rows = deptId[0]
            const dId = Object.values(rows[0])[0]
            if (dId == "That department does not exist") {
                console.log("No such department.")
                return
            } else (
                await db.query(`INSERT INTO role (title, salary, department_id) VALUES('${inqOutput.roleName}', '${inqOutput.roleSalary}', '${dId}');`)
            )

        } else if (selection === "Add Employee") {
            inqOutput = await inquirer.prompt([
                {
                    name: "firstName",
                    message: "What is the employee's first name?"
                },
                {
                    name: "lastName",
                    message: "What is the employee's last name?"
                },
                {
                    name: "role",
                    message: "What is the employee's role?"
                },
                {
                    name: "manager",
                    message: "What is the manager's name?"
                }
            ])
            const everyRole = await db.query(`SELECT * FROM role;`)
            const everyMgr = await db.query(`SELECT * FROM employee WHERE manager_id IS NULL;`)
            const roleData = everyRole[0].filter(role => role.title == inqOutput.role) //filters the array of roles to return an array with only the selected role
            const mgrData = everyMgr[0].filter(manager => `${manager.first_name} ${manager.last_name}` == inqOutput.manager) //filters the array of managers to return only the selected manager
            await db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${inqOutput.firstName}', '${inqOutput.lastName}', ${roleData[0].id}, ${mgrData[0].id})`); //getting the data that has been input by the user and inserting it into the employee table

        } else if (selection === "Update Employee Role") {
            const allEmployees = await db.query(`SELECT id, first_name, last_name FROM employee;`)
            const allRoles = await db.query(`SELECT id, title FROM role;`)
            const empList = allEmployees[0].map(emp => {
                return {
                    name: `${emp["first_name"]} ${emp["last_name"]}`,
                    value: emp.id
                }
            })
            const roleList = allRoles[0].map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
            inqOutput = await inquirer.prompt([
                {
                    type: "list",
                    name: "empID",
                    message: "Which employee do you want to update?",
                    choices: empList
                },
                {
                    type: "list",
                    name: "updatedRole",
                    message: "What is the employees new role?",
                    choices: roleList
                }
            ])
            await db.query(`UPDATE employee SET role_id = ${inqOutput.updatedRole} WHERE employee.id = ${inqOutput.empID}`)
        }
    } catch (err) { console.log(err) }
}

function menu() {
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "Please select from the following options.",
            choices: ["View all Departments", "View all Roles", "View all Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Quit"]
        }
    ]).then(async (answers) => {
        await connectDb(answers.option)
        menu()
    })
}

menu()
