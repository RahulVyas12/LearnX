using AutoMapper;
using Microsoft.EntityFrameworkCore;
using myapp_backend.Data;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class ProgressService : IProgressService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProgressService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync(Guid userId)
        {
            var modulesCompleted = await _context.UserModuleProgresses
                .CountAsync(p => p.UserId == userId && p.IsRead);

            var activePaths = await _context.UserEnrollments
                .CountAsync(e => e.UserId == userId && e.Status == "active");

            var testsPassed = await _context.TestAttempts
                .CountAsync(a => a.UserId == userId && a.Passed);

            var certificatesEarned = await _context.Certificates
                .CountAsync(c => c.UserId == userId);

            return new DashboardStatsDto
            {
                ModulesCompleted = modulesCompleted,
                ActivePaths = activePaths,
                TestsPassed = testsPassed,
                CertificatesEarned = certificatesEarned
            };
        }

        public async Task<IEnumerable<EnrolledPathDto>> GetEnrolledPathsAsync(Guid userId)
        {
            var enrollments = await _context.UserEnrollments
                .Where(e => e.UserId == userId)
                .Include(e => e.SkillPath)
                .ToListAsync();

            var result = new List<EnrolledPathDto>();

            foreach (var enrollment in enrollments)
            {
                var levels = await _context.Levels
                    .Where(l => l.SkillPathId == enrollment.SkillPathId)
                    .ToListAsync();

                int totalLevels = levels.Count;
                int completedLevels = 0;

                if (totalLevels > 0)
                {
                    var levelIds = levels.Select(l => l.Id).ToList();
                    completedLevels = await _context.UserLevelProgresses
                        .CountAsync(p => p.UserId == userId && levelIds.Contains(p.LevelId) && p.Status == "completed");
                }

                result.Add(new EnrolledPathDto
                {
                    SkillPathId = enrollment.SkillPathId,
                    Title = enrollment.SkillPath?.Title ?? "Unknown Path",
                    Domain = enrollment.SkillPath?.Domain ?? "General",
                    TotalLevels = totalLevels,
                    CompletedLevels = completedLevels,
                    ProgressPercentage = totalLevels > 0 ? (float)completedLevels / totalLevels * 100 : 0,
                    Status = enrollment.Status
                });
            }

            return result;
        }

        public async Task<PathProgressDto?> GetPathProgressAsync(Guid userId, Guid skillPathId)
        {
            var path = await _context.SkillPaths
                .FirstOrDefaultAsync(p => p.Id == skillPathId);
            
            if (path == null) return null;

            var levels = await _context.Levels
                .Where(l => l.SkillPathId == skillPathId)
                .OrderBy(l => l.OrderIndex)
                .ToListAsync();

            var levelProgressList = new List<LevelProgressDto>();

            foreach (var level in levels)
            {
                var totalModules = await _context.Modules
                    .CountAsync(m => m.LevelId == level.Id);

                var completedModules = 0;
                if (totalModules > 0)
                {
                    var moduleIds = await _context.Modules
                        .Where(m => m.LevelId == level.Id)
                        .Select(m => m.Id)
                        .ToListAsync();

                    completedModules = await _context.UserModuleProgresses
                        .CountAsync(p => p.UserId == userId && moduleIds.Contains(p.ModuleId) && p.IsRead);
                }

                var progress = await _context.UserLevelProgresses
                    .FirstOrDefaultAsync(p => p.UserId == userId && p.LevelId == level.Id);

                levelProgressList.Add(new LevelProgressDto
                {
                    LevelId = level.Id,
                    Title = level.Title,
                    Tier = level.Tier,
                    TotalModules = totalModules,
                    CompletedModules = completedModules,
                    CompletionPercentage = totalModules > 0 ? (float)completedModules / totalModules * 100 : 0,
                    Status = progress?.Status ?? "locked",
                    IsUnlocked = progress?.IsUnlocked ?? false
                });
            }

            return new PathProgressDto
            {
                SkillPathId = skillPathId,
                SkillPathTitle = path.Title,
                Levels = levelProgressList
            };
        }

        public async Task<bool> MarkModuleReadAsync(Guid userId, Guid moduleId)
        {
            var module = await _context.Modules.FindAsync(moduleId);
            if (module == null) return false;

            var existing = await _context.UserModuleProgresses
                .FirstOrDefaultAsync(p => p.UserId == userId && p.ModuleId == moduleId);

            if (existing != null)
            {
                if (existing.IsRead) return true;
                existing.IsRead = true;
                existing.ReadAt = DateTime.UtcNow;
                _context.UserModuleProgresses.Update(existing);
            }
            else
            {
                await _context.UserModuleProgresses.AddAsync(new UserModuleProgress
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ModuleId = moduleId,
                    IsRead = true,
                    ReadAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TestResultDto?> SubmitTestAsync(Guid userId, TestSubmitDto dto)
        {
            var level = await _context.Levels.FindAsync(dto.LevelId);
            if (level == null) return null;

            int correctCount = 0;
            int totalQuestions = dto.Answers.Count;
            var attemptAnswers = new List<TestAttemptAnswer>();

            foreach (var answer in dto.Answers)
            {
                var question = await _context.Questions.FindAsync(answer.QuestionId);
                if (question == null) continue;

                bool isCorrect = string.Equals(
                    answer.UserAnswer?.Trim(),
                    question.CorrectAnswer.Trim(),
                    StringComparison.OrdinalIgnoreCase);

                if (isCorrect) correctCount++;

                attemptAnswers.Add(new TestAttemptAnswer
                {
                    Id = Guid.NewGuid(),
                    QuestionId = answer.QuestionId,
                    UserAnswer = answer.UserAnswer,
                    IsCorrect = isCorrect
                });
            }

            float score = totalQuestions > 0 ? (float)correctCount / totalQuestions : 0;
            bool passed = score >= level.MasteryThreshold;

            var attempt = new TestAttempt
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                LevelId = dto.LevelId,
                AttemptType = dto.AttemptType,
                Score = score,
                Passed = passed,
                TotalQuestions = totalQuestions,
                CorrectCount = correctCount,
                AttemptedAt = DateTime.UtcNow
            };
            await _context.TestAttempts.AddAsync(attempt);

            foreach (var ans in attemptAnswers)
            {
                ans.AttemptId = attempt.Id;
                await _context.TestAttemptAnswers.AddAsync(ans);
            }

            bool levelUnlocked = false;
            if (passed && dto.AttemptType == "mastery_test")
            {
                var currentProgress = await _context.UserLevelProgresses
                    .FirstOrDefaultAsync(p => p.UserId == userId && p.LevelId == dto.LevelId);
                
                if (currentProgress != null)
                {
                    currentProgress.Status = "completed";
                    currentProgress.MasteryScore = score;
                    currentProgress.CompletedAt = DateTime.UtcNow;
                    _context.UserLevelProgresses.Update(currentProgress);
                }

                var nextLevel = await _context.Levels
                    .Where(l => l.SkillPathId == level.SkillPathId && l.OrderIndex > level.OrderIndex)
                    .OrderBy(l => l.OrderIndex)
                    .FirstOrDefaultAsync();

                if (nextLevel != null)
                {
                    var nextProgress = await _context.UserLevelProgresses
                        .FirstOrDefaultAsync(p => p.UserId == userId && p.LevelId == nextLevel.Id);

                    if (nextProgress == null)
                    {
                        await _context.UserLevelProgresses.AddAsync(new UserLevelProgress
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            LevelId = nextLevel.Id,
                            Status = "in_progress",
                            IsUnlocked = true,
                            UnlockedAt = DateTime.UtcNow
                        });
                        levelUnlocked = true;
                    }
                    else if (!nextProgress.IsUnlocked)
                    {
                        nextProgress.IsUnlocked = true;
                        nextProgress.Status = "in_progress";
                        nextProgress.UnlockedAt = DateTime.UtcNow;
                        _context.UserLevelProgresses.Update(nextProgress);
                        levelUnlocked = true;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return new TestResultDto
            {
                AttemptId = attempt.Id,
                Score = score,
                Passed = passed,
                TotalQuestions = totalQuestions,
                CorrectCount = correctCount,
                LevelUnlocked = levelUnlocked
            };
        }

        public async Task<bool> EnrollAsync(Guid userId, Guid skillPathId)
        {
            var exists = await _context.UserEnrollments
                .AnyAsync(e => e.UserId == userId && e.SkillPathId == skillPathId);
            
            if (exists) return false;

            var enrollment = new UserEnrollment
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                SkillPathId = skillPathId,
                EnrolledAt = DateTime.UtcNow,
                Status = "active"
            };

            await _context.UserEnrollments.AddAsync(enrollment);

            var firstLevel = await _context.Levels
                .Where(l => l.SkillPathId == skillPathId)
                .OrderBy(l => l.OrderIndex)
                .FirstOrDefaultAsync();

            if (firstLevel != null)
            {
                await _context.UserLevelProgresses.AddAsync(new UserLevelProgress
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    LevelId = firstLevel.Id,
                    Status = "in_progress",
                    IsUnlocked = true,
                    UnlockedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnenrollAsync(Guid userId, Guid skillPathId)
        {
            var enrollment = await _context.UserEnrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.SkillPathId == skillPathId);

            if (enrollment == null) return false;

            _context.UserEnrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<LevelUnlockStatusDto>> GetLevelUnlockStatusAsync(Guid userId, Guid skillPathId)
        {
            var levels = await _context.Levels
                .Where(l => l.SkillPathId == skillPathId)
                .OrderBy(l => l.OrderIndex)
                .ToListAsync();

            var result = new List<LevelUnlockStatusDto>();

            foreach (var level in levels)
            {
                var progress = await _context.UserLevelProgresses
                    .FirstOrDefaultAsync(p => p.UserId == userId && p.LevelId == level.Id);

                bool isUnlocked = level.OrderIndex == 0 || (progress?.IsUnlocked ?? false);

                result.Add(new LevelUnlockStatusDto
                {
                    LevelId = level.Id,
                    Title = level.Title,
                    Tier = level.Tier,
                    OrderIndex = level.OrderIndex,
                    IsUnlocked = isUnlocked,
                    MasteryScore = progress?.MasteryScore ?? 0,
                    Status = level.OrderIndex == 0 && progress == null ? "in_progress" : (progress?.Status ?? "locked")
                });
            }

            return result;
        }

        public async Task<AdminDashboardStatsDto> GetAdminStatsAsync()
        {
            return new AdminDashboardStatsDto
            {
                TotalUsers = await _context.Users.CountAsync(),
                TotalSkillPaths = await _context.SkillPaths.CountAsync(),
                TotalCertificates = await _context.Certificates.CountAsync(),
                TotalAnnouncements = await _context.Announcements.CountAsync(),
                TotalTestAttempts = await _context.TestAttempts.CountAsync()
            };
        }
    }
}
