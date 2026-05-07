using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class Question
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? ModuleId { get; set; }
        
        public Guid? LevelId { get; set; }

        [Required]
        public string Scope { get; set; } = string.Empty; // "module" | "mastery" | "practice"

        [Required]
        public string Type { get; set; } = string.Empty; // "mcq" | "code"

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        [Column(TypeName = "jsonb")]
        public string? Options { get; set; }

        [Required]
        public string CorrectAnswer { get; set; } = string.Empty;

        public int Points { get; set; } = 1;

        // Navigation Properties
        [ForeignKey("ModuleId")]
        public virtual Module? Module { get; set; }

        [ForeignKey("LevelId")]
        public virtual Level? Level { get; set; }

        public virtual ICollection<TestAttemptAnswer> TestAttemptAnswers { get; set; } = new List<TestAttemptAnswer>();
    }
}
