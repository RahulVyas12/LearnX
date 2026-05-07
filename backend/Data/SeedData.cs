using Microsoft.EntityFrameworkCore;
using myapp_backend.Models;

namespace myapp_backend.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var context = new AppDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>());

            // 1. Ensure Admin User exists
            if (!await context.Users.AnyAsync(u => u.Role == "admin"))
            {
                var adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Admin User",
                    Email = "admin@learnx.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "admin",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await context.Users.AddAsync(adminUser);
            }

            // 2. Ensure JavaScript Skill Path exists
            if (!await context.SkillPaths.AnyAsync(sp => sp.Title == "JavaScript Mastery"))
            {
                await SeedJavaScriptPath(context);
            }

            // 3. Ensure Python Basics exists (original seed)
            if (!await context.SkillPaths.AnyAsync(sp => sp.Title == "Python Basics"))
            {
                await SeedPythonPath(context);
            }

            await context.SaveChangesAsync();
        }

        private static async Task SeedJavaScriptPath(AppDbContext context)
        {
            var jsPath = new SkillPath
            {
                Id = Guid.NewGuid(),
                Title = "JavaScript Mastery",
                Description = "Master the language of the web, from syntax basics to advanced asynchronous patterns and OOP.",
                Domain = "Programming",
                IsPublished = true,
                CreatedAt = DateTime.UtcNow
            };
            await context.SkillPaths.AddAsync(jsPath);

            // --- Beginner Level ---
            var beginner = new Level { Id = Guid.NewGuid(), SkillPathId = jsPath.Id, Title = "JS Fundamentals", Tier = "beginner", OrderIndex = 1, MasteryThreshold = 0.85f };
            await context.Levels.AddAsync(beginner);

            var b_m1 = new Module { Id = Guid.NewGuid(), LevelId = beginner.Id, Title = "Variables & Data Types", ContentMarkdown = "# Variables in JS\nLearn about `let`, `const`, and primitive types.", OrderIndex = 1 };
            var b_m2 = new Module { Id = Guid.NewGuid(), LevelId = beginner.Id, Title = "Control Flow", ContentMarkdown = "# If, Else & Switch\nConditional logic in JavaScript.", OrderIndex = 2 };
            await context.Modules.AddRangeAsync(b_m1, b_m2);

            await context.Questions.AddRangeAsync(
                new Question { Id = Guid.NewGuid(), ModuleId = b_m1.Id, Scope = "module", Type = "mcq", QuestionText = "Which keyword is used for constants?", Options = "[\"var\", \"let\", \"const\"]", CorrectAnswer = "const" },
                new Question { Id = Guid.NewGuid(), LevelId = beginner.Id, Scope = "mastery", Type = "mcq", QuestionText = "What is the result of typeof null?", Options = "[\"null\", \"undefined\", \"object\"]", CorrectAnswer = "object" }
            );

            // --- Intermediate Level ---
            var intermediate = new Level { Id = Guid.NewGuid(), SkillPathId = jsPath.Id, Title = "ES6+ & Async", Tier = "intermediate", OrderIndex = 2, MasteryThreshold = 0.80f };
            await context.Levels.AddAsync(intermediate);

            var i_m1 = new Module { Id = Guid.NewGuid(), LevelId = intermediate.Id, Title = "Arrow Functions & ES6", ContentMarkdown = "# ES6 Syntax\nModern JavaScript features.", OrderIndex = 1 };
            var i_m2 = new Module { Id = Guid.NewGuid(), LevelId = intermediate.Id, Title = "Promises & Async/Await", ContentMarkdown = "# Asynchronous JS\nHandling non-blocking code.", OrderIndex = 2 };
            await context.Modules.AddRangeAsync(i_m1, i_m2);

            await context.Questions.AddRangeAsync(
                new Question { Id = Guid.NewGuid(), ModuleId = i_m2.Id, Scope = "module", Type = "mcq", QuestionText = "Which state is NOT a Promise state?", Options = "[\"pending\", \"resolved\", \"waiting\"]", CorrectAnswer = "waiting" }
            );

            // --- Advanced Level ---
            var advanced = new Level { Id = Guid.NewGuid(), SkillPathId = jsPath.Id, Title = "Advanced Patterns", Tier = "advanced", OrderIndex = 3, MasteryThreshold = 0.75f };
            await context.Levels.AddAsync(advanced);

            var a_m1 = new Module { Id = Guid.NewGuid(), LevelId = advanced.Id, Title = "Closures & Scopes", ContentMarkdown = "# Deep Dive into Scope\nUnderstanding lexical environment.", OrderIndex = 1 };
            await context.Modules.AddAsync(a_m1);
        }

        private static async Task SeedPythonPath(AppDbContext context)
        {
            var path1 = new SkillPath
            {
                Id = Guid.NewGuid(),
                Title = "Python Basics",
                Description = "Learn the fundamentals of Python programming.",
                Domain = "Programming",
                IsPublished = true,
                CreatedAt = DateTime.UtcNow
            };
            await context.SkillPaths.AddAsync(path1);

            var beginner = new Level { Id = Guid.NewGuid(), SkillPathId = path1.Id, Title = "Python Beginner", Tier = "beginner", OrderIndex = 1 };
            await context.Levels.AddAsync(beginner);

            var m1 = new Module { Id = Guid.NewGuid(), LevelId = beginner.Id, Title = "Intro to Python", ContentMarkdown = "# Hello Python", OrderIndex = 1 };
            await context.Modules.AddAsync(m1);

            await context.Questions.AddAsync(
                new Question { Id = Guid.NewGuid(), ModuleId = m1.Id, Scope = "module", Type = "mcq", QuestionText = "Is Python dynamic?", Options = "[\"Yes\", \"No\"]", CorrectAnswer = "Yes" }
            );
        }
    }
}
