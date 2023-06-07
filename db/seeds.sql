INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 120000, 4),
        ("Salesperson", 100000, 4),
        ("Lead Engineer", 80000, 1),
        ("Software Engineer", 85000, 1),
        ("Account Manager", 70000, 5),
        ("Accountant", 95000, 2),
        ("Legal Team Lead", 82000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe",  1, NULL),
        ("Mike", "Chan",  2, 1),
        ("Ashley", "Rodriguez",  4, NULL), 
        ("Kevin", "Tupik",  5, 3),
        ("Kunal", "Singh",  6, NULL), 
        ("Malia", "Brown",  3, 1), 
        ("Sarah", "Lourd",  4, NULL), 
        ("Clorx", "TheDestroyer",  6, NULL),
        ("Tom", "Allen",  5, 8); 
       