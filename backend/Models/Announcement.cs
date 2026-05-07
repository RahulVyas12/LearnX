using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class Announcement
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid CreatedBy { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = "General";

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("CreatedBy")]
        public virtual User? Creator { get; set; }
    }
}
