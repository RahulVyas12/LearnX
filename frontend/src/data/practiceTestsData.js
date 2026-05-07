export const PRACTICE_TESTS_CATEGORIES = [
  'All', 'Python', 'SQL', 'DSA', 'Aptitude'
];

export const PRACTICE_TESTS_LEVELS = [
  'All', 'Beginner', 'Intermediate', 'Advanced'
];

export const PRACTICE_TESTS = [
  {
    id: 1,
    title: 'Python Basics Practice',
    category: 'Python',
    level: 'Beginner',
    description: 'Test your knowledge of Python syntax, variables, and basic operations.',
    duration: '20 min',
    isPractice: true,
    courseSlug: 'python-developer',
    questions: [
      {
        id: 1,
        question: 'Which of the following is the correct way to define a function in Python?',
        code: 'def my_func():',
        options: ['function my_func():', 'def my_func():', 'create my_func():', 'method my_func():'],
        correct: 1
      },
      {
        id: 2,
        question: 'What is the correct file extension for Python files?',
        options: ['.pt', '.py', '.pyt', '.pw'],
        correct: 1
      },
      {
        id: 3,
        question: 'Which statement is used to stop a loop?',
        options: ['stop', 'exit', 'break', 'return'],
        correct: 2
      },
      {
        id: 4,
        question: 'How do you create a variable with the numeric value 5?',
        options: ['x = 5', 'x = num(5)', 'x = int(5)', 'Both A and C are correct'],
        correct: 3
      },
      {
        id: 5,
        question: 'What is the output of print(2 ** 3)?',
        options: ['5', '6', '8', '9'],
        correct: 2
      },
      {
        id: 6,
        question: 'What is a correct syntax to output "Hello World" in Python?',
        options: ['echo("Hello World");', 'print("Hello World")', 'p("Hello World")', 'console.log("Hello World");'],
        correct: 1
      },
      {
        id: 7,
        question: 'How do you insert COMMENTS in Python code?',
        options: ['//This is a comment', '#This is a comment', '/*This is a comment*/', '<!--This is a comment-->'],
        correct: 1
      },
      {
        id: 8,
        question: 'Which one is NOT a legal variable name?',
        options: ['my_var = 20', '_myvar = 20', 'my-var = 20', 'myVar = 20'],
        correct: 2
      },
      {
        id: 9,
        question: 'How do you create a variable with the floating number 2.8?',
        options: ['x = 2.8', 'x = float(2.8)', 'Both A and B are correct', 'x = float: 2.8'],
        correct: 2
      },
      {
        id: 10,
        question: 'What is the correct syntax to output the type of a variable or object in Python?',
        options: ['print(type(x))', 'print(typeof(x))', 'print(typeof x)', 'print(typeOf(x))'],
        correct: 0
      }
    ]
  },
  {
    id: 2,
    title: 'SQL Query Practice',
    category: 'SQL',
    level: 'Beginner',
    description: 'Practice writing SELECT, WHERE, and ORDER BY queries.',
    duration: '18 min',
    isPractice: true,
    courseSlug: 'sql-developer',
    questions: [
      {
        id: 1,
        question: 'Which SQL statement is used to extract data from a database?',
        options: ['SELECT', 'GET', 'EXTRACT', 'OPEN'],
        correct: 0
      },
      {
        id: 2,
        question: 'Which SQL statement is used to update data in a database?',
        options: ['MODIFY', 'SAVE', 'UPDATE', 'CHANGE'],
        correct: 2
      },
      {
        id: 3,
        question: 'With SQL, how can you return all the records from a table named "Persons" where the "FirstName" is "Peter"?',
        options: [
          'SELECT * FROM Persons WHERE FirstName="Peter"',
          'SELECT [all] FROM Persons WHERE FirstName="Peter"',
          'SELECT * FROM Persons WHERE FirstName<>"Peter"',
          'SELECT Persons WHERE FirstName="Peter"'
        ],
        correct: 0
      },
      {
        id: 4,
        question: 'Which SQL statement is used to insert new data in a database?',
        options: ['INSERT INTO', 'ADD RECORD', 'ADD NEW', 'INSERT NEW'],
        correct: 0
      },
      {
        id: 5,
        question: 'How can you return all the records from a table named "Persons" sort the result reversed alphabetically by "FirstName"?',
        options: ['SELECT * FROM Persons ORDER BY FirstName DESC', 'SELECT * FROM Persons SORT BY FirstName DESC', 'SELECT * FROM Persons ORDER FirstName DESC', 'SELECT * FROM Persons SORT FirstName DESC'],
        correct: 0
      },
      {
        id: 6,
        question: 'What is the most common type of JOIN?',
        options: ['INNER JOIN', 'INSIDE JOIN', 'JOINED', 'JOIN TABLE'],
        correct: 0
      },
      {
        id: 7,
        question: 'Which operator is used to select values within a range?',
        options: ['BETWEEN', 'RANGE', 'WITHIN', 'IN'],
        correct: 0
      },
      {
        id: 8,
        question: 'Which constraint ensures that a column does not have null values?',
        options: ['UNIQUE', 'NOT NULL', 'PRIMARY KEY', 'CHECK'],
        correct: 1
      }
    ]
  },
  {
    id: 3,
    title: 'Arrays & Strings',
    category: 'DSA',
    level: 'Intermediate',
    description: 'Solve array manipulation and string processing problems.',
    duration: '25 min',
    isPractice: true,
    courseSlug: 'data-structures-&-algorithms',
    questions: [
      {
        id: 1,
        question: 'What is the time complexity of accessing an element in an array using an index?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correct: 0
      },
      {
        id: 2,
        question: 'Which data structure follows the LIFO (Last In First Out) principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Array'],
        correct: 1
      },
      {
        id: 3,
        question: 'What is the time complexity of finding the length of a string in Python or Java?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correct: 0
      },
      {
        id: 4,
        question: 'Which of the following sorting algorithms is generally the fastest for largely sorted arrays?',
        options: ['Merge Sort', 'Quick Sort', 'Insertion Sort', 'Selection Sort'],
        correct: 2
      },
      {
        id: 5,
        question: 'Which problem-solving pattern is best suited for finding a subarray with a given sum?',
        options: ['Two Pointers', 'Sliding Window', 'Binary Search', 'Dynamic Programming'],
        correct: 1
      },
      {
        id: 6,
        question: 'Hash tables resolve collisions using which common techniques?',
        options: ['Chaining & Linear Probing', 'Sorting & Searching', 'Pushing & Popping', 'Enqueue & Dequeue'],
        correct: 0
      },
      {
        id: 7,
        question: 'A palindrome string is one that reads the same forwards and backwards. Which pattern checks a palindrome most optimally?',
        options: ['Sliding Window', 'Two Pointers (Start and End)', 'Prefix Sum', 'Fast and Slow Pointers'],
        correct: 1
      }
    ]
  },
  {
    id: 4,
    title: 'Quantitative Aptitude',
    category: 'Aptitude',
    level: 'Beginner',
    description: 'Practice number systems, percentages, and ratio problems.',
    duration: '30 min',
    isPractice: true,
    courseSlug: 'aptitude-preparation',
    questions: [
      {
        id: 1,
        question: 'If a man buys an article for $25 and sells it for $30, what is his profit percentage?',
        options: ['10%', '20%', '25%', '15%'],
        correct: 1
      },
      {
        id: 2,
        question: 'If 20% of a number is 50, what is the number?',
        options: ['100', '200', '250', '300'],
        correct: 2
      },
      {
        id: 3,
        question: 'The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?',
        options: ['10', '15', '20', '25'],
        correct: 2
      },
      {
        id: 4,
        question: 'A train running at a speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
        options: ['120 metres', '150 metres', '180 metres', '200 metres'],
        correct: 1
      },
      {
        id: 5,
        question: 'What is the simple interest on $1000 for 2 years at 5% per annum?',
        options: ['$50', '$100', '$150', '$200'],
        correct: 1
      }
    ]
  },
  {
    id: 5,
    title: 'OOP in Python',
    category: 'Python',
    level: 'Intermediate',
    description: 'Test your understanding of classes, objects, and inheritance.',
    duration: '20 min',
    isPractice: true,
    courseSlug: 'python-developer',
    questions: [
      {
        id: 1,
        question: 'Which keyword is used to create a class in Python?',
        options: ['className', 'class', 'struct', 'object'],
        correct: 1
      },
      {
        id: 2,
        question: 'How do you instantiate an object of a class named MyClass in Python?',
        options: ['x = new MyClass()', 'x = MyClass', 'x = MyClass()', 'new x = MyClass()'],
        correct: 2
      },
      {
        id: 3,
        question: 'What does the __init__ method do in Python?',
        options: ['It initializes the python compiler', 'It acts as the constructor of a class', 'It defines the end of a class', 'It imports external libraries'],
        correct: 1
      },
      {
        id: 4,
        question: 'Which of the following represents inheritance in Python?',
        options: ['class Child(Parent):', 'class Child extends Parent:', 'class Child implements Parent:', 'Child class = Parent'],
        correct: 0
      },
      {
        id: 5,
        question: 'What does "self" refer to in a Python class method?',
        options: ['The class itself', 'The parent class', 'The instance of the class', 'A built-in global variable'],
        correct: 2
      }
    ]
  },
  {
    id: 6,
    title: 'Logical Reasoning',
    category: 'Aptitude',
    level: 'Intermediate',
    description: 'Patterns, series, and logical deduction problems.',
    duration: '20 min',
    isPractice: true,
    courseSlug: 'aptitude-preparation',
    questions: [
      {
        id: 1,
        question: 'Find the next number in the series: 2, 4, 8, 16, ?',
        options: ['24', '30', '32', '36'],
        correct: 2
      },
      {
        id: 2,
        question: 'If CAT is coded as 3120, how will DOG be coded?',
        options: ['4147', '4157', '4167', '4158'],
        correct: 1
      },
      {
        id: 3,
        question: 'Look at this series: 36, 34, 30, 28, 24, ... What number should come next?',
        options: ['20', '22', '23', '26'],
        correct: 1
      },
      {
        id: 4,
        question: 'SCD, TEF, UGH, ____, WKL',
        options: ['CMN', 'UJI', 'VIJ', 'IJT'],
        correct: 2
      },
      {
        id: 5,
        question: 'Which word does NOT belong with the others?',
        options: ['Index', 'Glossary', 'Chapter', 'Book'],
        correct: 3
      }
    ]
  }
];
