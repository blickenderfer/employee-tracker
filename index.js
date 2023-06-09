const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
require("dotenv").config()

// create the connection to database
async function connectDb(selection){
    try{
const db = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PW
});

let rows = []
let inqOutput = []
if (selection === "Quit"){
    process.exit()
} else if (selection === "View All Departments") {
    rows = await db.query("SELECT * FROM department;");
    console.table(rows[0])
} else if (selection === "View All Roles") {
    rows = await db.query("SELECT role.id, title, salary, department.name AS department FROM role JOIN department ON role.department_id = department.id;");
    console.table(rows[0])
} else if (selection === "View All Employees") {
    rows = await db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager_table.first_name, ' ', manager_table.last_name)ELSE NULL END AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id JOIN employee manager_table ON employee.manager_id = manager_table.id;")
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
    const deptId = await db.query(`SELECT IFNULL ((SELECT id FROM department WHERE name = "${roleDepartment}"), "That department does not exist");`)
    rows = deptId[0]
    const dId = Object.values(rows[0])[0]
    if (dId == "That department does not exist"){
        console.log("No such department.")
        return
    } else (
        await db.query(`INSERT INTO role (title, salary, department_id) VALUES('${roleName}', '${roleSalary}', '${dId}');`)
    )

}   else if (selection === "Add Employee") {
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
    const roleData = everyRole[0].filter(role => role.title == inqOutput.role)
    const mgrData = everMgr[0].filter(manager => `${manager.first_name} ${manager.last_name}` == inqOutput.role)
    await db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${inqOutput.firstName}', '${inqOutput.lastName}', ${roleData[0].id}, ${mgrData[0].id})`); 
 
}   else if (selection === "Update Employee Role") {
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
    
}







}catch(err){console.log(err)}
}
// db.connect((err) => {
//     if(err)throw err;
//     menu(); 
// });  
connectDb()
function menu(){
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "Please select from the following options.",
            choices: ["View all Departments", "View all Roles", "View all Employees"]
        }
    ]).then((answers)=>{
        if(answers.option === "View all Departments"){
            viewDepartments()
        } else if(answers.option === "View all Roles"){
            //execute view role function
        }
    }) 
}
//grabbing from database
async function viewDepartments(){
    const allDepartments = await db.query("SELECT * FROM departments")
        console.table(allDepartments)
        menu()
    }
menu()
