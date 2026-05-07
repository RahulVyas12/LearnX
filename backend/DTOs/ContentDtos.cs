using System.ComponentModel.DataAnnotations;

namespace myapp_backend.DTOs
{
    public class SkillPathDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public int TotalLevels { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class LevelDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Tier { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public int TotalModules { get; set; }
    }

    public class LevelDetailDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Tier { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public float MasteryThreshold { get; set; }
        public List<ModuleDto> Modules { get; set; } = new();
    }

    public class ModuleDto
    {
        public Guid Id { get; set; }
        public Guid LevelId { get; set; }
        public string LevelTitle { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string ContentMarkdown { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
    }

    public class ModuleDetailDto : ModuleDto
    {
        // For future expansion, right now same as ModuleDto but used for detail view
    }

    // ── Admin Create/Update DTOs ──

    public class CreateLevelDto
    {
        [Required]
        public Guid SkillPathId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Tier { get; set; } = "beginner";

        public int OrderIndex { get; set; }
        public float MasteryThreshold { get; set; } = 0.90f;
    }

    public class UpdateLevelDto
    {
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Tier { get; set; } = string.Empty;

        public int OrderIndex { get; set; }
        public float MasteryThreshold { get; set; } = 0.90f;
    }

    public class CreateModuleDto
    {
        [Required]
        public Guid LevelId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string ContentMarkdown { get; set; } = string.Empty;

        public int OrderIndex { get; set; }
    }

    public class UpdateModuleDto
    {
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string ContentMarkdown { get; set; } = string.Empty;

        public int OrderIndex { get; set; }
    }

    public class CreateQuestionDto
    {
        public Guid? ModuleId { get; set; }
        public Guid? LevelId { get; set; }

        [Required]
        public string Scope { get; set; } = "module";

        [Required]
        public string Type { get; set; } = "mcq";

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        public string? Options { get; set; }

        [Required]
        public string CorrectAnswer { get; set; } = string.Empty;

        public int Points { get; set; } = 1;
    }

    public class UpdateQuestionDto
    {
        public Guid? ModuleId { get; set; }
        public Guid? LevelId { get; set; }

        [Required]
        public string Scope { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        public string? Options { get; set; }

        [Required]
        public string CorrectAnswer { get; set; } = string.Empty;

        public int Points { get; set; } = 1;
    }

    // ── Level Mastery Test DTOs ──

    public class LevelMasteryTestDto
    {
        public Guid Id { get; set; }
        public Guid LevelId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int? TimeLimitMinutes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int QuestionCount { get; set; }
        public float MasteryThreshold { get; set; } = 0.90f; // Always 90%
    }

    public class CreateLevelMasteryTestDto
    {
        [Required]
        public Guid LevelId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = "Mastery Test";

        [Range(1, 180)]
        public int? TimeLimitMinutes { get; set; }
    }

    public class UpdateLevelMasteryTestDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Range(1, 180)]
        public int? TimeLimitMinutes { get; set; }
    }
}
