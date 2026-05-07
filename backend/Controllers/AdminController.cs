using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IProgressService _progressService;
        private readonly IAnnouncementService _announcementService;

        public AdminController(
            IUserService userService,
            IProgressService progressService,
            IAnnouncementService announcementService)
        {
            _userService = userService;
            _progressService = progressService;
            _announcementService = announcementService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetAdminStats()
        {
            var stats = await _progressService.GetAdminStatsAsync();
            var announcements = await _announcementService.GetAllAsync();
            
            return Ok(new {
                totalUsers = stats.TotalUsers,
                totalSkillPaths = stats.TotalSkillPaths,
                totalCertificates = stats.TotalCertificates,
                totalAnnouncements = stats.TotalAnnouncements,
                totalTestAttempts = stats.TotalTestAttempts,
                recentAnnouncements = announcements.Take(5).Select(a => new {
                    id = a.Id,
                    title = a.Title,
                    body = a.Content,
                    dot_color = "#10b981",
                    created_at = a.CreatedAt
                })
            });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersWithStatsAsync();
            return Ok(users);
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] AdminUserUpdateDto dto)
        {
            var success = await _userService.UpdateUserAsync(id, dto);
            if (!success) return NotFound();

            return Ok(new { message = "User updated successfully." });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var success = await _userService.DeleteUserAsync(id);
            if (!success) return NotFound();

            return Ok(new { message = "User deleted successfully." });
        }

        [HttpPost("invite")]
        public async Task<IActionResult> InviteUser([FromBody] InviteUserDto dto)
        {
            var existingUser = await _userService.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { error = "User with this email already exists" });

            var user = await _userService.InviteUserAsync(dto);

            return Ok(new { 
                message = "User invited successfully", 
                user
            });
        }
    }
}
