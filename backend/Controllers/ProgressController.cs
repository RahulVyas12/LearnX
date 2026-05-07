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
    public class ProgressController : ControllerBase
    {
        private readonly IProgressService _progressService;

        public ProgressController(IProgressService progressService)
        {
            _progressService = progressService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var stats = await _progressService.GetDashboardStatsAsync(userId.Value);
            return Ok(stats);
        }

        [HttpGet("enrolled")]
        public async Task<IActionResult> GetEnrolledPaths()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _progressService.GetEnrolledPathsAsync(userId.Value);
            return Ok(result);
        }

        [HttpGet("path/{skillPathId}")]
        public async Task<IActionResult> GetPathProgress(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _progressService.GetPathProgressAsync(userId.Value, skillPathId);
            if (result == null) return NotFound(new { message = "Skill path not found." });

            return Ok(result);
        }

        [HttpPost("module/{moduleId}/read")]
        public async Task<IActionResult> MarkModuleRead(Guid moduleId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var success = await _progressService.MarkModuleReadAsync(userId.Value, moduleId);
            if (!success) return NotFound(new { message = "Module not found." });

            return Ok(new { message = "Module marked as read." });
        }
        
        [HttpPost("enroll/{skillPathId}")]
        public async Task<IActionResult> Enroll(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var success = await _progressService.EnrollAsync(userId.Value, skillPathId);
            if (!success) return BadRequest(new { message = "User is already enrolled or path not found." });

            return Ok(new { message = "Successfully enrolled." });
        }

        [HttpDelete("unenroll/{skillPathId}")]
        public async Task<IActionResult> Unenroll(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var success = await _progressService.UnenrollAsync(userId.Value, skillPathId);
            if (!success) return NotFound(new { message = "Enrollment not found." });

            return Ok(new { message = "Successfully unenrolled." });
        }

        [HttpPost("test/submit")]
        public async Task<IActionResult> SubmitTest([FromBody] TestSubmitDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _progressService.SubmitTestAsync(userId.Value, dto);
            if (result == null) return NotFound(new { message = "Level not found." });

            return Ok(result);
        }

        [HttpGet("levels/{skillPathId}")]
        public async Task<IActionResult> GetLevelUnlockStatus(Guid skillPathId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _progressService.GetLevelUnlockStatusAsync(userId.Value, skillPathId);
            return Ok(result);
        }

        [HttpGet("admin/stats")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAdminStats()
        {
            var stats = await _progressService.GetAdminStatsAsync();
            return Ok(stats);
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
