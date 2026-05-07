using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class UserEnrollment
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid SkillPathId { get; set; }

        public string Status { get; set; } = "active"; // "active" | "completed" | "paused"

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("SkillPathId")]
        public virtual SkillPath? SkillPath { get; set; }
    }
}
