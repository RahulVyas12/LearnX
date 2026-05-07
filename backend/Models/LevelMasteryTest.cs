using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class LevelMasteryTest
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid LevelId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = "Mastery Test";

        [Range(1, 180)]
        public int? TimeLimitMinutes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("LevelId")]
        public virtual Level? Level { get; set; }

        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}
