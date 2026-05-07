using Microsoft.EntityFrameworkCore;

using myapp_backend.Models;

namespace myapp_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<SkillPath> SkillPaths { get; set; } = null!;
        public DbSet<Level> Levels { get; set; } = null!;
        public DbSet<Module> Modules { get; set; } = null!;
        public DbSet<Question> Questions { get; set; } = null!;
        public DbSet<UserEnrollment> UserEnrollments { get; set; } = null!;
        public DbSet<UserLevelProgress> UserLevelProgresses { get; set; } = null!;
        public DbSet<UserModuleProgress> UserModuleProgresses { get; set; } = null!;
        public DbSet<TestAttempt> TestAttempts { get; set; } = null!;
        public DbSet<TestAttemptAnswer> TestAttemptAnswers { get; set; } = null!;
        public DbSet<PracticeSession> PracticeSessions { get; set; } = null!;
        public DbSet<Certificate> Certificates { get; set; } = null!;
        public DbSet<Announcement> Announcements { get; set; } = null!;
        public DbSet<LevelMasteryTest> LevelMasteryTests { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique Indices
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Certificate>()
                .HasIndex(c => c.CertificateNumber)
                .IsUnique();

            // Composite Unique Indices
            modelBuilder.Entity<UserEnrollment>()
                .HasIndex(ue => new { ue.UserId, ue.SkillPathId })
                .IsUnique();

            modelBuilder.Entity<UserLevelProgress>()
                .HasIndex(ulp => new { ulp.UserId, ulp.LevelId })
                .IsUnique();

            modelBuilder.Entity<UserModuleProgress>()
                .HasIndex(ump => new { ump.UserId, ump.ModuleId })
                .IsUnique();

            // Cascade deletes
            modelBuilder.Entity<SkillPath>()
                .HasMany(sp => sp.Levels)
                .WithOne(l => l.SkillPath)
                .HasForeignKey(l => l.SkillPathId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Level>()
                .HasMany(l => l.Modules)
                .WithOne(m => m.Level)
                .HasForeignKey(m => m.LevelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Module>()
                .HasMany(m => m.Questions)
                .WithOne(q => q.Module)
                .HasForeignKey(q => q.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Restrict Delete
            modelBuilder.Entity<User>()
                .HasMany(u => u.Certificates)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // JSONB configuration for Question Options is handled via [Column(TypeName = "jsonb")] attribute in the model

            // Configure Announcements association
            modelBuilder.Entity<User>()
                .HasMany(u => u.Announcements)
                .WithOne(a => a.Creator)
                .HasForeignKey(a => a.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure LevelMasteryTest - one per level maximum
            modelBuilder.Entity<LevelMasteryTest>()
                .HasIndex(lmt => lmt.LevelId)
                .IsUnique();

            // Configure LevelMasteryTest relationship with Questions
            // Note: Questions already have a relationship with Level, so we don't need to duplicate it
            // The LevelMasteryTest will use the existing Questions relationship through LevelId
        }
    }
}
