using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class TestAttempt
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid LevelId { get; set; }

        [Required]
        public string AttemptType { get; set; } = string.Empty; // "module_test" | "mastery_test"

        public float Score { get; set; }

        public bool Passed { get; set; }

        public int TotalQuestions { get; set; }

        public int CorrectCount { get; set; }

        public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("LevelId")]
        public virtual Level? Level { get; set; }

        public virtual ICollection<TestAttemptAnswer> Answers { get; set; } = new List<TestAttemptAnswer>();
    }
}
