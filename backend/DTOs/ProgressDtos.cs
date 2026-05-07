using System.ComponentModel.DataAnnotations;

namespace myapp_backend.DTOs
{
    // ── Question DTO (strips CorrectAnswer for client safety) ──

    public class QuestionDto
    {
        public Guid Id { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Scope { get; set; } = string.Empty;
        public string? Options { get; set; }
        public int Points { get; set; }
    }

    // ── Dashboard ──

    public class DashboardStatsDto
    {
        public int ModulesCompleted { get; set; }
        public int ActivePaths { get; set; }
        public int TestsPassed { get; set; }
        public int CertificatesEarned { get; set; }
    }

    // ── Path Progress ──

    public class PathProgressDto
    {
        public Guid SkillPathId { get; set; }
        public string SkillPathTitle { get; set; } = string.Empty;
        public List<LevelProgressDto> Levels { get; set; } = new();
    }

    public class LevelProgressDto
    {
        public Guid LevelId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Tier { get; set; } = string.Empty;
        public int TotalModules { get; set; }
        public int CompletedModules { get; set; }
        public float CompletionPercentage { get; set; }
        public string Status { get; set; } = "locked";
        public bool IsUnlocked { get; set; }
    }

    // ── Level Unlock Status ──

    public class LevelUnlockStatusDto
    {
        public Guid LevelId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Tier { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public bool IsUnlocked { get; set; }
        public float MasteryScore { get; set; }
        public string Status { get; set; } = "locked";
    }

    // ── Test Submission ──

    public class TestSubmitDto
    {
        [Required]
        public Guid LevelId { get; set; }

        [Required]
        public string AttemptType { get; set; } = "mastery_test";

        [Required]
        public List<AnswerDto> Answers { get; set; } = new();
    }

    public class AnswerDto
    {
        [Required]
        public Guid QuestionId { get; set; }

        public string? UserAnswer { get; set; }
    }

    public class TestResultDto
    {
        public Guid AttemptId { get; set; }
        public float Score { get; set; }
        public bool Passed { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectCount { get; set; }
        public bool LevelUnlocked { get; set; }
    }

    // ── Certificates ──

    public class CertificateDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public Guid SkillPathId { get; set; }
        public string SkillPathTitle { get; set; } = string.Empty;
        public string CertificateNumber { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; }
    }

    // ── Enrolled Paths ──

    public class EnrolledPathDto
    {
        public Guid SkillPathId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public int TotalLevels { get; set; }
        public int CompletedLevels { get; set; }
        public float ProgressPercentage { get; set; }
        public string Status { get; set; } = "active";
    }
}
