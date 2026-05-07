using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class PracticeSession
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid SkillPathId { get; set; }

        public float Score { get; set; }

        public int TotalQuestions { get; set; }

        public int CorrectCount { get; set; }

        public DateTime SessionAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("SkillPathId")]
        public virtual SkillPath? SkillPath { get; set; }
    }
}
