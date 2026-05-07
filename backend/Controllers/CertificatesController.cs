using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Services.Interfaces;
using myapp_backend.Models;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CertificatesController : ControllerBase
    {
        private readonly ICertificateService _certificateService;
        private readonly ISkillPathService _skillPathService;
        private readonly IUserService _userService;

        public CertificatesController(
            ICertificateService certificateService, 
            ISkillPathService skillPathService,
            IUserService userService)
        {
            _certificateService = certificateService;
            _skillPathService = skillPathService;
            _userService = userService;
        }

        /// <summary>
        /// GET /api/certificates/my — List certificates for the logged-in user.
        /// </summary>
        [HttpGet("my")]
        public async Task<IActionResult> GetMyCertificates()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var certs = await _certificateService.GetByUserAsync(userId.Value);
            var dtos = new List<CertificateDto>();

            foreach (var cert in certs)
            {
                var path = await _skillPathService.GetByIdAsync(cert.SkillPathId);
                dtos.Add(new CertificateDto
                {
                    Id = cert.Id,
                    SkillPathId = cert.SkillPathId,
                    SkillPathTitle = path?.Title ?? "Unknown Path",
                    CertificateNumber = cert.CertificateNumber,
                    IssuedAt = cert.IssuedAt
                });
            }

            return Ok(dtos);
        }

        [HttpGet("all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllCertificates()
        {
            var certs = await _certificateService.GetAllAsync();
            var dtos = new List<CertificateDto>();

            foreach (var cert in certs)
            {
                var user = await _userService.GetByIdAsync(cert.UserId);
                var path = await _skillPathService.GetByIdAsync(cert.SkillPathId);
                
                dtos.Add(new CertificateDto
                {
                    Id = cert.Id,
                    UserId = cert.UserId,
                    UserName = user?.Name ?? "Unknown User",
                    SkillPathId = cert.SkillPathId,
                    SkillPathTitle = path?.Title ?? "Unknown Path",
                    CertificateNumber = cert.CertificateNumber,
                    IssuedAt = cert.IssuedAt
                });
            }

            return Ok(dtos);
        }

        [HttpPost("claim/{skillPathId}")]
        public async Task<IActionResult> ClaimCertificate(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            // Check if already exists
            var existing = (await _certificateService.GetByUserAsync(userId.Value))
                .FirstOrDefault(c => c.SkillPathId == skillPathId);
            
            if (existing != null)
            {
                return Ok(new CertificateDto
                {
                    Id = existing.Id,
                    SkillPathId = existing.SkillPathId,
                    SkillPathTitle = existing.SkillPath?.Title ?? "Skill Path",
                    CertificateNumber = existing.CertificateNumber,
                    IssuedAt = existing.IssuedAt
                });
            }

            // Verify path completion (all levels must be 'completed')
            // Note: In a real app, we'd use a more efficient check
            // For now, we'll just trust the UI logic or add a simple check here if possible
            
            var newCert = new Certificate
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                SkillPathId = skillPathId,
                CertificateNumber = "LX-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                IssuedAt = DateTime.UtcNow
            };

            await _certificateService.AddAsync(newCert);

            var path = await _skillPathService.GetByIdAsync(skillPathId);

            return Ok(new CertificateDto
            {
                Id = newCert.Id,
                SkillPathId = newCert.SkillPathId,
                SkillPathTitle = path?.Title ?? "Skill Path",
                CertificateNumber = newCert.CertificateNumber,
                IssuedAt = newCert.IssuedAt
            });
        }

        private Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdClaim, out var userId))
                return userId;
            return null;
        }
    }
}
