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

            if (await context.Users.AnyAsync())
            {
                return;   // DB has been seeded
            }

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

            var path1 = new SkillPath
            {
                Id = Guid.NewGuid(),
                Title = "Python Basics",
                Description = "Learn the fundamentals of Python programming.",
                Domain = "Programming",
                IsPublished = true,
                CreatedAt = DateTime.UtcNow
            };

            var path2 = new SkillPath
            {
                Id = Guid.NewGuid(),
                Title = "Aptitude Mastery",
                Description = "Master quantitative and verbal aptitude.",
                Domain = "Aptitude",
                IsPublished = true,
                CreatedAt = DateTime.UtcNow
            };

            await context.SkillPaths.AddRangeAsync(path1, path2);

            var levels = new List<Level>
            {
                new Level { Id = Guid.NewGuid(), SkillPathId = path1.Id, Title = "Python Beginner", Tier = "beginner", OrderIndex = 1 },
                new Level { Id = Guid.NewGuid(), SkillPathId = path1.Id, Title = "Python Intermediate", Tier = "intermediate", OrderIndex = 2 },
                new Level { Id = Guid.NewGuid(), SkillPathId = path1.Id, Title = "Python Advanced", Tier = "advanced", OrderIndex = 3 },
                new Level { Id = Guid.NewGuid(), SkillPathId = path2.Id, Title = "Aptitude Beginner", Tier = "beginner", OrderIndex = 1 },
                new Level { Id = Guid.NewGuid(), SkillPathId = path2.Id, Title = "Aptitude Intermediate", Tier = "intermediate", OrderIndex = 2 },
                new Level { Id = Guid.NewGuid(), SkillPathId = path2.Id, Title = "Aptitude Advanced", Tier = "advanced", OrderIndex = 3 }
            };

            await context.Levels.AddRangeAsync(levels);

            var modules = new List<Module>
            {
                new Module { Id = Guid.NewGuid(), LevelId = levels[0].Id, Title = "Intro to Python", ContentMarkdown = "# Hello Python", OrderIndex = 1, CreatedAt = DateTime.UtcNow },
                new Module { Id = Guid.NewGuid(), LevelId = levels[0].Id, Title = "Basic Types", ContentMarkdown = "# Strings and Numbers", OrderIndex = 2, CreatedAt = DateTime.UtcNow }
            };

            await context.Modules.AddRangeAsync(modules);

            var questions = new List<Question>
            {
                new Question { Id = Guid.NewGuid(), ModuleId = modules[0].Id, Scope = "module", Type = "mcq", QuestionText = "What is Python?", Options = "[\"Snake\", \"Language\", \"Both\"]", CorrectAnswer = "Both" },
                new Question { Id = Guid.NewGuid(), LevelId = levels[0].Id, Scope = "mastery", Type = "mcq", QuestionText = "How do you print in Python?", Options = "[\"echo\", \"print\", \"console.log\"]", CorrectAnswer = "print" }
            };

            await context.Questions.AddRangeAsync(questions);

            await context.SaveChangesAsync();
        }
    }
}
