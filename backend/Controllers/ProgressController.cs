using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProgressController : ControllerBase
    {
        private readonly IUserModuleProgressService _moduleProgressService;
        private readonly IUserLevelProgressService _levelProgressService;
        private readonly IUserEnrollmentService _enrollmentService;
        private readonly ITestAttemptService _testAttemptService;
        private readonly ITestAttemptAnswerService _answerService;
        private readonly IQuestionService _questionService;
        private readonly ILevelService _levelService;
        private readonly IModuleService _moduleService;
        private readonly ICertificateService _certificateService;
        private readonly ISkillPathService _skillPathService;
        private readonly IUserService _userService;
        private readonly IAnnouncementService _announcementService;

        public ProgressController(
            IUserModuleProgressService moduleProgressService,
            IUserLevelProgressService levelProgressService,
            IUserEnrollmentService enrollmentService,
            ITestAttemptService testAttemptService,
            ITestAttemptAnswerService answerService,
            IQuestionService questionService,
            ILevelService levelService,
            IModuleService moduleService,
            ICertificateService certificateService,
            ISkillPathService skillPathService,
            IUserService userService,
            IAnnouncementService announcementService)
        {
            _moduleProgressService = moduleProgressService;
            _levelProgressService = levelProgressService;
            _enrollmentService = enrollmentService;
            _testAttemptService = testAttemptService;
            _answerService = answerService;
            _questionService = questionService;
            _levelService = levelService;
            _moduleService = moduleService;
            _certificateService = certificateService;
            _skillPathService = skillPathService;
            _userService = userService;
            _announcementService = announcementService;
        }

        /// <summary>
        /// GET /api/progress/dashboard — Dashboard stats for the logged-in user.
        /// </summary>
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var allModuleProgress = await _moduleProgressService.GetAllAsync();
            var userModuleProgress = allModuleProgress.Where(p => p.UserId == userId.Value).ToList();

            var allEnrollments = await _enrollmentService.GetAllAsync();
            var userEnrollments = allEnrollments.Where(e => e.UserId == userId.Value).ToList();

            var allAttempts = await _testAttemptService.GetAllAsync();
            var userAttempts = allAttempts.Where(a => a.UserId == userId.Value).ToList();

            var allCerts = await _certificateService.GetAllAsync();
            var userCerts = allCerts.Where(c => c.UserId == userId.Value).ToList();

            var stats = new DashboardStatsDto
            {
                ModulesCompleted = userModuleProgress.Count(p => p.IsRead),
                ActivePaths = userEnrollments.Count(e => e.Status == "active"),
                TestsPassed = userAttempts.Count(a => a.Passed),
                CertificatesEarned = userCerts.Count
            };

            return Ok(stats);
        }

        /// <summary>
        /// GET /api/progress/enrolled — List enrolled skill paths with progress.
        /// </summary>
        [HttpGet("enrolled")]
        public async Task<IActionResult> GetEnrolledPaths()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var enrollments = await _enrollmentService.GetByUserAsync(userId.Value);
            var result = new List<EnrolledPathDto>();

            foreach (var enrollment in enrollments)
            {
                var path = await _skillPathService.GetByIdAsync(enrollment.SkillPathId);
                if (path == null) continue;

                var levels = await _levelService.GetBySkillPathIdAsync(path.Id);
                int totalLevels = levels.Count();
                int completedLevels = 0;

                foreach (var level in levels)
                {
                    var progress = await _levelProgressService.GetByUserAndLevelAsync(userId.Value, level.Id);
                    if (progress?.Status == "completed") completedLevels++;
                }

                result.Add(new EnrolledPathDto
                {
                    SkillPathId = path.Id,
                    Title = path.Title,
                    Domain = path.Domain ?? "General",
                    TotalLevels = totalLevels,
                    CompletedLevels = completedLevels,
                    ProgressPercentage = totalLevels > 0 ? (float)completedLevels / totalLevels * 100 : 0,
                    Status = enrollment.Status
                });
            }

            return Ok(result);
        }

        /// <summary>
        /// GET /api/progress/path/{skillPathId} — Detailed progress for a skill path.
        /// </summary>
        [HttpGet("path/{skillPathId}")]
        public async Task<IActionResult> GetPathProgress(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var levels = await _levelService.GetBySkillPathIdAsync(skillPathId);
            var levelProgressList = new List<LevelProgressDto>();

            foreach (var level in levels)
            {
                var modules = await _moduleService.GetByLevelIdAsync(level.Id);
                var totalModules = modules.Count();

                var moduleProgress = await _moduleProgressService.GetByUserAndLevelAsync(userId.Value, level.Id);
                var completedModules = moduleProgress.Count(p => p.IsRead);

                var levelProgress = await _levelProgressService.GetByUserAndLevelAsync(userId.Value, level.Id);

                levelProgressList.Add(new LevelProgressDto
                {
                    LevelId = level.Id,
                    Title = level.Title,
                    Tier = level.Tier,
                    TotalModules = totalModules,
                    CompletedModules = completedModules,
                    CompletionPercentage = totalModules > 0 ? (float)completedModules / totalModules * 100 : 0,
                    Status = levelProgress?.Status ?? "locked",
                    IsUnlocked = levelProgress?.IsUnlocked ?? false
                });
            }

            // Get the skill path title from the first level's nav property, or default
            var pathTitle = levels.FirstOrDefault()?.SkillPath?.Title ?? "";

            return Ok(new PathProgressDto
            {
                SkillPathId = skillPathId,
                SkillPathTitle = pathTitle,
                Levels = levelProgressList
            });
        }

        /// <summary>
        /// POST /api/progress/module/{moduleId}/read — Mark a module as read.
        /// </summary>
        [HttpPost("module/{moduleId}/read")]
        public async Task<IActionResult> MarkModuleRead(Guid moduleId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            // Verify module exists
            var module = await _moduleService.GetByIdAsync(moduleId);
            if (module == null) return NotFound(new { message = "Module not found." });

            // Check if progress already exists
            var existing = await _moduleProgressService.GetByUserAndModuleAsync(userId.Value, moduleId);
            if (existing != null)
            {
                if (existing.IsRead)
                    return Ok(new { message = "Module already marked as read." });

                existing.IsRead = true;
                existing.ReadAt = DateTime.UtcNow;
                await _moduleProgressService.UpdateAsync(existing);
            }
            else
            {
                var progress = new UserModuleProgress
                {
                    Id = Guid.NewGuid(),
                    UserId = userId.Value,
                    ModuleId = moduleId,
                    IsRead = true,
                    ReadAt = DateTime.UtcNow
                };
                await _moduleProgressService.AddAsync(progress);
            }

            return Ok(new { message = "Module marked as read." });
        }
        
        /// <summary>
        /// POST /api/progress/enroll/{skillPathId} — Enroll in a skill path.
        /// </summary>
        [HttpPost("enroll/{skillPathId}")]
        public async Task<IActionResult> Enroll(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var isEnrolled = await _enrollmentService.IsEnrolledAsync(userId.Value, skillPathId);
            if (isEnrolled) return BadRequest(new { message = "User is already enrolled in this path." });

            var enrollment = new UserEnrollment
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                SkillPathId = skillPathId,
                EnrolledAt = DateTime.UtcNow,
                Status = "active"
            };

            await _enrollmentService.AddAsync(enrollment);

            // Unlock the first level
            var allLevels = await _levelService.GetBySkillPathIdAsync(skillPathId);
            var firstLevel = allLevels.OrderBy(l => l.OrderIndex).FirstOrDefault();
            if (firstLevel != null)
            {
                await _levelProgressService.AddAsync(new UserLevelProgress
                {
                    Id = Guid.NewGuid(),
                    UserId = userId.Value,
                    LevelId = firstLevel.Id,
                    Status = "in_progress",
                    IsUnlocked = true,
                    UnlockedAt = DateTime.UtcNow
                });
            }

            return Ok(new { message = "Successfully enrolled." });
        }

        /// <summary>
        /// DELETE /api/progress/unenroll/{skillPathId} — Unenroll from a skill path.
        /// </summary>
        [HttpDelete("unenroll/{skillPathId}")]
        public async Task<IActionResult> Unenroll(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var enrollments = await _enrollmentService.GetByUserAsync(userId.Value);
            var enrollment = enrollments.FirstOrDefault(e => e.SkillPathId == skillPathId);
            
            if (enrollment == null) return NotFound(new { message = "Enrollment not found." });

            await _enrollmentService.DeleteAsync(enrollment.Id);
            return Ok(new { message = "Successfully unenrolled." });
        }

        /// <summary>
        /// POST /api/progress/test/submit — Submit test answers, auto-grade, trigger unlock.
        /// </summary>
        [HttpPost("test/submit")]
        public async Task<IActionResult> SubmitTest([FromBody] TestSubmitDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            // Verify level exists
            var level = await _levelService.GetByIdAsync(dto.LevelId);
            if (level == null) return NotFound(new { message = "Level not found." });

            // Grade each answer
            int correctCount = 0;
            int totalQuestions = dto.Answers.Count;
            var attemptAnswers = new List<TestAttemptAnswer>();

            foreach (var answer in dto.Answers)
            {
                var question = await _questionService.GetByIdAsync(answer.QuestionId);
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

            // Save TestAttempt
            var attempt = new TestAttempt
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                LevelId = dto.LevelId,
                AttemptType = dto.AttemptType,
                Score = score,
                Passed = passed,
                TotalQuestions = totalQuestions,
                CorrectCount = correctCount,
                AttemptedAt = DateTime.UtcNow
            };
            await _testAttemptService.AddAsync(attempt);

            // Save individual answers
            foreach (var ans in attemptAnswers)
            {
                ans.AttemptId = attempt.Id;
                await _answerService.AddAsync(ans);
            }

            // If mastery test passed, unlock the next level
            bool levelUnlocked = false;
            if (passed && dto.AttemptType == "mastery_test")
            {
                // Update current level progress
                var currentProgress = await _levelProgressService.GetByUserAndLevelAsync(userId.Value, dto.LevelId);
                if (currentProgress != null)
                {
                    currentProgress.Status = "completed";
                    currentProgress.MasteryScore = score;
                    currentProgress.CompletedAt = DateTime.UtcNow;
                    await _levelProgressService.UpdateAsync(currentProgress);
                }

                // Find and unlock the next level
                var allLevels = await _levelService.GetBySkillPathIdAsync(level.SkillPathId);
                var nextLevel = allLevels
                    .Where(l => l.OrderIndex > level.OrderIndex)
                    .OrderBy(l => l.OrderIndex)
                    .FirstOrDefault();

                if (nextLevel != null)
                {
                    var nextProgress = await _levelProgressService.GetByUserAndLevelAsync(userId.Value, nextLevel.Id);
                    if (nextProgress == null)
                    {
                        await _levelProgressService.AddAsync(new UserLevelProgress
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId.Value,
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
                        await _levelProgressService.UpdateAsync(nextProgress);
                        levelUnlocked = true;
                    }
                }
            }

            return Ok(new TestResultDto
            {
                AttemptId = attempt.Id,
                Score = score,
                Passed = passed,
                TotalQuestions = totalQuestions,
                CorrectCount = correctCount,
                LevelUnlocked = levelUnlocked
            });
        }

        /// <summary>
        /// GET /api/progress/levels/{skillPathId} — Unlock status of all levels in a path.
        /// </summary>
        [HttpGet("levels/{skillPathId}")]
        public async Task<IActionResult> GetLevelUnlockStatus(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var levels = await _levelService.GetBySkillPathIdAsync(skillPathId);
            var result = new List<LevelUnlockStatusDto>();

            foreach (var level in levels)
            {
                var progress = await _levelProgressService.GetByUserAndLevelAsync(userId.Value, level.Id);

                // First level (OrderIndex 0) is always unlocked
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

            return Ok(result);
        }

        /// <summary>
        /// GET /api/progress/admin/stats — System-wide stats for Admin Dashboard.
        /// </summary>
        [HttpGet("admin/stats")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAdminStats()
        {
            var allUsers = await _userService.GetAllAsync();
            var allPaths = await _skillPathService.GetAllAsync();
            var allCerts = await _certificateService.GetAllAsync();
            var allAnnouncements = await _announcementService.GetAllAsync();
            var allAttempts = await _testAttemptService.GetAllAsync();
            
            return Ok(new AdminDashboardStatsDto
            {
                TotalUsers = allUsers.Count(),
                TotalSkillPaths = allPaths.Count(),
                TotalCertificates = allCerts.Count(),
                TotalAnnouncements = allAnnouncements.Count(),
                TotalTestAttempts = allAttempts.Count()
            });
        }

        // ── Private helper: extract user ID from JWT claims ──
        private Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdClaim, out var userId))
                return userId;
            return null;
        }
    }
}
