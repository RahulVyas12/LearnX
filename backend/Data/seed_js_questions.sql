-- JS Mastery Questions Seed Script
-- Run this against your PostgreSQL database to add 20 questions per JS level

DO $$
DECLARE
    beg_id UUID;
    int_id UUID;
    adv_id UUID;
BEGIN
    SELECT "Id" INTO beg_id FROM "Levels" WHERE "Title" = 'JS Fundamentals' LIMIT 1;
    SELECT "Id" INTO int_id FROM "Levels" WHERE "Title" = 'ES6+ & Async' LIMIT 1;
    SELECT "Id" INTO adv_id FROM "Levels" WHERE "Title" = 'Advanced Patterns' LIMIT 1;

    IF beg_id IS NULL OR int_id IS NULL OR adv_id IS NULL THEN
        RAISE NOTICE 'JS levels not found. Run the app first to seed base data.';
        RETURN;
    END IF;

    -- Remove old mastery questions for these levels
    DELETE FROM "Questions" WHERE "LevelId" IN (beg_id, int_id, adv_id) AND "Scope" = 'mastery';

    -- ============================================================
    -- BEGINNER: JS Fundamentals (20 questions)
    -- ============================================================
    INSERT INTO "Questions"("Id","LevelId","Scope","Type","QuestionText","Options","CorrectAnswer","Points") VALUES
    (gen_random_uuid(),beg_id,'mastery','mcq','What does typeof null return in JavaScript?','["null","undefined","object","NaN"]','object',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','Which keyword declares a block-scoped variable?','["var","let","function","hoisted"]','let',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','What is the output of: console.log(0.1 + 0.2 === 0.3)?','["true","false","NaN","undefined"]','false',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','Which of these is NOT a primitive type?','["string","number","object","boolean"]','object',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','What does === check?','["Value only","Type only","Value and type","Reference"]','Value and type',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','How do you declare a constant in JS?','["let x=1","var x=1","const x=1","fixed x=1"]','const x=1',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','What is NaN?','["Not a Number","Null and None","Negative Number","None"]','Not a Number',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','Which method converts string to integer?','["parseInt()","toInt()","intParse()","Number.int()"]','parseInt()',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','What does undefined mean?','["Variable exists but has no value","Variable does not exist","Variable is null","Variable is 0"]','Variable exists but has no value',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','What is the result of typeof undefined?','["null","object","undefined","string"]','undefined',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','Which loop executes at least once?','["for","while","do...while","for...in"]','do...while',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','How do you write a single-line comment?','["<!-- -->","/* */","//","**"]','//',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','Which operator checks value only (not type)?','["===","!==","==","!=="]','==',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','What does console.log() do?','["Creates a log file","Prints to browser console","Opens console window","Saves output"]','Prints to browser console',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','What is hoisting?','["Moving declarations to top of scope","Moving code to bottom","Removing variables","None"]','Moving declarations to top of scope',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','Which is falsy in JS?','["1","\"hello\"","[]","0"]','0',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','How do you define a function?','["func myFn(){}","function myFn(){}","def myFn():","myFn => {}"]','function myFn(){}',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','What is the scope of var?','["Block","Function","Module","Global only"]','Function',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','Which symbol is used for template literals?','["Single quote","Double quote","Backtick","Hash"]','Backtick',1),
    (gen_random_uuid(),beg_id,'mastery','mcq','What does Array.length return?','["Last index","Number of elements","Highest value","Undefined"]','Number of elements',1);

    -- ============================================================
    -- INTERMEDIATE: ES6+ & Async (20 questions)
    -- ============================================================
    INSERT INTO "Questions"("Id","LevelId","Scope","Type","QuestionText","Options","CorrectAnswer","Points") VALUES
    (gen_random_uuid(),int_id,'mastery','mcq','What does the spread operator (...) do?','["Spreads array into elements","Joins arrays","Creates new array","Filters array"]','Spreads array into elements',1),
    (gen_random_uuid(),int_id,'mastery','mcq','Which Promise state means operation succeeded?','["pending","fulfilled","rejected","resolved"]','fulfilled',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What does async/await do?','["Runs code in parallel","Makes async code look synchronous","Speeds up code","Creates worker threads"]','Makes async code look synchronous',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What is destructuring?','["Deleting objects","Extracting values from arrays/objects","Copying arrays","Breaking code"]','Extracting values from arrays/objects',1),
    (gen_random_uuid(),int_id,'mastery','mcq','Arrow functions differ from regular functions in that they...','["Run faster","Do not bind their own this","Cannot have parameters","Use function keyword"]','Do not bind their own this',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What does Promise.all() do?','["Runs promises sequentially","Waits for all promises to resolve","Returns first resolved","Ignores rejections"]','Waits for all promises to resolve',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What is a default parameter?','["Parameter with fallback value","Required parameter","Read-only parameter","Static parameter"]','Parameter with fallback value',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What does the rest parameter (...args) collect?','["First argument","Remaining arguments","Object properties","Array elements"]','Remaining arguments',1),
    (gen_random_uuid(),int_id,'mastery','mcq','Which method chains a callback after a Promise resolves?','[".then()",".catch()",".finally()",".resolve()"]','.then()',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What does try/catch do in async code?','["Stops execution","Handles errors in await calls","Speeds up promises","Prevents async"]','Handles errors in await calls',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What is a module in ES6?','["A function","A reusable file with imports/exports","A class","An object"]','A reusable file with imports/exports',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What does export default do?','["Exports multiple items","Exports one main item","Imports a module","Creates global variable"]','Exports one main item',1),
    (gen_random_uuid(),int_id,'mastery','mcq','How do you import a named export?','["import X from","import {X} from","import * from","require(X)"]','import {X} from',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What is the optional chaining operator?','["&&","||","?.","??"]','?.',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What does the nullish coalescing operator ?? do?','["Returns left if truthy","Returns right if left is null/undefined","Checks equality","Merges objects"]','Returns right if left is null/undefined',1),
    (gen_random_uuid(),int_id,'mastery','mcq','Which ES6 feature helps avoid callback hell?','["var","Promises","eval","with"]','Promises',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What does map() return?','["Original array modified","New array","Nothing","Boolean"]','New array',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What does filter() return?','["Modified original","New array with matching elements","Count","Boolean"]','New array with matching elements',1),
    (gen_random_uuid(),int_id,'mastery','mcq','What is a generator function?','["Fast function","Function that can pause/resume","Async function","Class method"]','Function that can pause/resume',1),
    (gen_random_uuid(),int_id,'mastery','mcq','Which class keyword defines a parent class method override?','["override","super","extend","parent"]','super',1);

    -- ============================================================
    -- ADVANCED: Advanced Patterns (20 questions)
    -- ============================================================
    INSERT INTO "Questions"("Id","LevelId","Scope","Type","QuestionText","Options","CorrectAnswer","Points") VALUES
    (gen_random_uuid(),adv_id,'mastery','mcq','What is a closure?','["A function with no return","Function that retains access to outer scope","A sealed object","An IIFE"]','Function that retains access to outer scope',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is the event loop?','["DOM listener","JS concurrency model handling call stack and callback queue","Timer","Browser API"]','JS concurrency model handling call stack and callback queue',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is a WeakMap?','["Lightweight Map","Map with weak references to keys","Map with fewer methods","Frozen Map"]','Map with weak references to keys',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What does Object.freeze() do?','["Deletes object","Prevents modifications to object","Makes copy","Converts to array"]','Prevents modifications to object',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is memoization?','["Storing function return values to avoid recomputation","Memory allocation","Recursion technique","Caching DOM"]','Storing function return values to avoid recomputation',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is prototype in JavaScript?','["Parent class","Object from which other objects inherit","Module","Static property"]','Object from which other objects inherit',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What does call() do?','["Calls function with custom this","Creates promise","Clones function","Binds permanently"]','Calls function with custom this',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is a Proxy object?','["Object that hides data","Object that intercepts operations on another object","Fake object","Clone"]','Object that intercepts operations on another object',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is currying?','["Transforming function to take one argument at a time","Merging functions","Recursion","Memoization"]','Transforming function to take one argument at a time',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What does bind() return?','["Result of function","New function with bound this","Promise","undefined"]','New function with bound this',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is the module pattern used for?','["Speeding up code","Encapsulating private state","Creating classes","DOM manipulation"]','Encapsulating private state',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is an IIFE?','["Immediately Invoked Function Expression","Internal Interface Function","Import/Export syntax","Inherited Function"]','Immediately Invoked Function Expression',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What does Symbol() create?','["String key","Unique primitive value","Number","Object"]','Unique primitive value',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is tail call optimization?','["Merging loops","Reusing stack frame for recursive tail calls","Caching","Pruning"]','Reusing stack frame for recursive tail calls',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What does Reflect API provide?','["Reflection of DOM","Methods for interceptable JS operations","CSS reflection","Mirror objects"]','Methods for interceptable JS operations',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is debouncing?','["Delaying function until after events stop firing","Caching","Throttling","Queuing"]','Delaying function until after events stop firing',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is throttling?','["Limiting how often function runs","Debouncing","Caching","Lazy loading"]','Limiting how often function runs',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is the observer pattern?','["Pattern where objects subscribe to events","Singleton pattern","Factory pattern","Decorator"]','Pattern where objects subscribe to events',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What does Object.create(proto) do?','["Copies object","Creates object with given prototype","Clones class","Creates array"]','Creates object with given prototype',1),
    (gen_random_uuid(),adv_id,'mastery','mcq','What is function composition?','["Combining multiple functions where output of one is input of next","Nesting loops","Currying","IIFE"]','Combining multiple functions where output of one is input of next',1);

    RAISE NOTICE 'Successfully inserted 60 mastery questions for JS levels.';
END $$;
