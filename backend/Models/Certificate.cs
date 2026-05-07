using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp_backend.Models
{
    public class Certificate
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid SkillPathId { get; set; }

        [Required]
        public string CertificateNumber { get; set; } = string.Empty;

        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("SkillPathId")]
        public virtual SkillPath? SkillPath { get; set; }
    }
}
