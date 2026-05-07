using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CertificatesController : ControllerBase
    {
        private readonly ICertificateService _certificateService;

        public CertificatesController(ICertificateService certificateService)
        {
            _certificateService = certificateService;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyCertificates()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var dtos = await _certificateService.GetByUserAsync(userId.Value);
            return Ok(dtos);
        }

        [HttpGet("all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllCertificates()
        {
            var dtos = await _certificateService.GetAllCertificatesAsync();
            return Ok(dtos);
        }

        [HttpPost("claim/{skillPathId}")]
        public async Task<IActionResult> ClaimCertificate(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _certificateService.ClaimCertificateAsync(userId.Value, skillPathId);
            if (result == null) return NotFound(new { message = "Skill Path not found." });

            return Ok(result);
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
