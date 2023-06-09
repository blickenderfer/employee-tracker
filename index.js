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
    rows = await db.query("SELECT * FROM department");
    console.table(rows[0])
} else if (selection === "View All Roles") {
    rows = await db.query("SELECT role.id, title, salary, department.name AS department FROM role JOIN department ON role.department_id = department.id");
    console.table(rows[0])
} else if (selection === "View All Employees") {
    rows = await db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager_table.first_name, ' ', manager_table.last_name)ELSE NULL END AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id JOIN employee manager_table ON employee.manager_id = manager_table.id")
    console.table(rows[0])
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
