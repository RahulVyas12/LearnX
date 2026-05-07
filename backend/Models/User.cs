using System.ComponentModel.DataAnnotations;

namespace myapp_backend.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "student";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(100)]
        public string? Department { get; set; }

        [MaxLength(500)]
        public string? AvatarUrl { get; set; }

        // Navigation Properties
        public virtual ICollection<UserEnrollment> Enrollments { get; set; } = new List<UserEnrollment>();
        public virtual ICollection<UserLevelProgress> LevelProgresses { get; set; } = new List<UserLevelProgress>();
        public virtual ICollection<UserModuleProgress> ModuleProgresses { get; set; } = new List<UserModuleProgress>();
        public virtual ICollection<TestAttempt> TestAttempts { get; set; } = new List<TestAttempt>();
        public virtual ICollection<PracticeSession> PracticeSessions { get; set; } = new List<PracticeSession>();
        public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
        public virtual ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
    }
}
