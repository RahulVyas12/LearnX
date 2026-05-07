// Images
import pythonImg from '../assets/pythondev.png';
import sqlImg from '../assets/sql.png';

export const skillPathsData = {
    'python-developer': {
        title: 'Python Developer',
        image: pythonImg,
        tags: ['Python', 'OOP', 'Backend', 'Scripting'],
        description: 'Master Python from fundamentals to advanced concepts including OOP, data structures, file handling, and real-world project development.',
        modulesCount: 12, levelsCount: 3, progress: 83, completed: 5,
        levels: [
            {
                id: 1, title: 'Beginner Level', badge: 'Beginner',
                description: 'Learn Python fundamentals: syntax, variables, control flow, and functions.',
                status: 'current',
                modules: [
                    { title: 'Python Basics & Setup', status: 'Completed', duration: '45 min', desc: 'Install Python, understand the interpreter, write your first program.', topics: ['Installation', 'Hello World', 'Variables', 'Data Types'], type: 'module', color: 'green' },
                    { title: 'Python Basics & Setup — Module Test', status: 'Passed', duration: '20 min', desc: 'MCQ • Programming', type: 'test', color: 'green' },
                    { title: 'Control Flow', status: 'Completed', duration: '60 min', desc: 'Master if/else statements, loops, and conditional logic.', topics: ['if/else', 'for loops', 'while loops', 'break/continue'], type: 'module', color: 'green' },
                    { title: 'Control Flow — Module Test', status: 'Passed', duration: '20 min', desc: 'MCQ • Programming', type: 'test', color: 'green' },
                    { title: 'Functions & Scope', status: 'In Progress', duration: '55 min', desc: 'Define and call functions, understand scope and return values.', topics: ['def', 'parameters', 'return', 'scope', 'lambda'], type: 'module', color: 'blue' },
                    { title: 'Lists, Tuples & Dictionaries', status: 'Available', duration: '70 min', desc: "Work with Python's core data structures.", topics: ['Lists', 'Tuples', 'Dicts', 'Sets', 'Comprehensions'], type: 'module', color: 'indigo' }
                ],
                masteryTest: {
                    title: 'Beginner Level — Mastery Test',
                    score: '90%',
                    questions: [
                        {
                            id: 1,
                            question: 'Which of the following is the correct way to define a function in Python?',
                            code: '# Option A: function my_func():\n# Option B: def my_func():\n# Option C: create my_func():\n# Option D: method my_func():',
                            options: ['function my_func():', 'def my_func():', 'create my_func():', 'method my_func():'],
                            correct: 1
                        },
                        {
                            id: 2,
                            question: 'What is the output of: print(type([]))?',
                            options: ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"],
                            correct: 1
                        },
                        {
                            id: 3,
                            question: 'How do you start a "for" loop in Python?',
                            options: ['for x in y:', 'for (x=0; x<y; x++)', 'for each x in y', 'foreach x in y:'],
                            correct: 0
                        },
                        {
                            id: 4,
                            question: 'Which keyword is used to handle exceptions in Python?',
                            options: ['catch', 'except', 'error', 'handle'],
                            correct: 1
                        },
                        {
                            id: 5,
                            question: 'What is a PEP 8?',
                            options: ['A Python compiler', 'A style guide for Python code', 'A type of Python variable', 'A Python library'],
                            correct: 1
                        }
                    ]
                }
            },
            {
                id: 2, title: 'Intermediate Level', badge: 'Intermediate',
                description: 'Dive into OOP, file handling, error handling, and modules.',
                status: 'locked',
                modules: [
                    { title: 'Object-Oriented Programming', duration: '90 min', desc: 'Classes, objects, inheritance, and polymorphism.', topics: ['Classes', 'Inheritance', 'Polymorphism', 'Encapsulation'] },
                    { title: 'File Handling & I/O', duration: '60 min', desc: 'Read, write, and manipulate files in Python.', topics: ['open()', 'read/write', 'CSV', 'JSON'] }
                ]
            },
            {
                id: 3, title: 'Advanced Level', badge: 'Advanced',
                description: 'Advanced Python: decorators, generators, async programming, and project work.',
                status: 'locked',
                modules: [
                    { title: 'Async Programming', duration: '90 min', desc: 'Asynchronous Python with asyncio, await, and concurrent tasks.' },
                    { title: 'Capstone Project', duration: '120 min', desc: 'Build a complete Python application applying all learned concepts.' }
                ]
            }
        ]
    },
    'sql-developer': {
        title: 'SQL Developer',
        image: sqlImg,
        tags: ['SQL', 'PostgreSQL', 'Database'],
        description: 'Master SQL from basic queries to advanced database design and optimization.',
        modulesCount: 10, levelsCount: 3, progress: 0, completed: 0,
        levels: [
            {
                id: 1, title: 'SQL Fundamentals', badge: 'Beginner',
                description: 'Foundational SQL syntax and data retrieval.',
                status: 'current',
                modules: [
                    { title: 'Introduction to Databases', status: 'Available', duration: '40 min', desc: 'Understanding RDBMS and SQL basics.', topics: ['Database', 'Tables', 'SQL'], type: 'module', color: 'indigo' },
                    { title: 'Basic Select Queries', status: 'Available', duration: '50 min', desc: 'Selecting core data from tables.', topics: ['SELECT', 'FROM', 'WHERE'], type: 'module', color: 'indigo' }
                ]
            }
        ]
    }
};

export const getPathData = (id) => {
    return skillPathsData[id] || skillPathsData['python-developer'];
};
