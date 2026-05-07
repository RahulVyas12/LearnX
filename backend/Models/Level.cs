using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class Level
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid SkillPathId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Tier { get; set; } = string.Empty; // "beginner" | "intermediate" | "advanced"

        public int OrderIndex { get; set; }

        public float MasteryThreshold { get; set; } = 0.90f;

        // Navigation Properties
        [ForeignKey("SkillPathId")]
        public virtual SkillPath? SkillPath { get; set; }

        public virtual ICollection<Module> Modules { get; set; } = new List<Module>();
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
        public virtual ICollection<UserLevelProgress> UserLevelProgresses { get; set; } = new List<UserLevelProgress>();
        public virtual ICollection<TestAttempt> TestAttempts { get; set; } = new List<TestAttempt>();
    }
}
