using System.ComponentModel.DataAnnotations;

namespace myapp_backend.Models
{
    public class SkillPath
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Domain { get; set; }

        public bool IsPublished { get; set; } = false;

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<Level> Levels { get; set; } = new List<Level>();
        public virtual ICollection<UserEnrollment> Enrollments { get; set; } = new List<UserEnrollment>();
        public virtual ICollection<PracticeSession> PracticeSessions { get; set; } = new List<PracticeSession>();
        public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
    }
}
