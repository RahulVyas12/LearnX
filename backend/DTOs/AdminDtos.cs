using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace myapp_backend.DTOs
{
    public class AdminDashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalSkillPaths { get; set; }
        public int TotalCertificates { get; set; }
        public int TotalAnnouncements { get; set; }
        public int TotalTestAttempts { get; set; }
    }

    public class AdminUserDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime JoinedDate { get; set; }
        public int EnrollmentCount { get; set; }
        public int CompletedModules { get; set; }
    }

    public class UserRoleUpdateDto
    {
        public string Role { get; set; } = string.Empty;
    }

    public class AnnouncementCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = "General"; // General, Platform Update, etc.
    }

    public class AnnouncementDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }
    }

    public class AdminUserUpdateDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public string? Department { get; set; }
        public string? AvatarUrl { get; set; }
    }

    public class InviteUserDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public string? Role { get; set; } = "student";
        public string? Department { get; set; }
    }
}
