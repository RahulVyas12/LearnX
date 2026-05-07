using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class TestAttemptAnswer
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid AttemptId { get; set; }

        [Required]
        public Guid QuestionId { get; set; }

        public string? UserAnswer { get; set; }

        public bool IsCorrect { get; set; }

        // Navigation Properties
        [ForeignKey("AttemptId")]
        public virtual TestAttempt? Attempt { get; set; }

        [ForeignKey("QuestionId")]
        public virtual Question? Question { get; set; }
    }
}
