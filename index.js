const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config()

// create the connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PW
});

db.connect((err) => {
    if(err)throw err;
    menu(); 
});  

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
            //execute view department function
        } else if(answers.option === "View all Roles"){
            //execute view role function
        }
    }) 
}
//grabbing from database
function viewDepartments(){
    db.query("SELECT * FROM departments", (err, results) => {
        if(err)throw err
        console.table(results)
        menu()
    })
}
