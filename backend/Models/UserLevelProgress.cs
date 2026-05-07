using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class UserLevelProgress
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid LevelId { get; set; }

        public string Status { get; set; } = "locked"; // "locked" | "in_progress" | "completed"

        public float MasteryScore { get; set; } = 0.0f;

        public bool IsUnlocked { get; set; } = false;

        public DateTime? UnlockedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("LevelId")]
        public virtual Level? Level { get; set; }
    }
}
