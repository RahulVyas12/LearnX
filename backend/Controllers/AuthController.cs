using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using myapp_backend.DTOs;
using myapp_backend.Services.Interfaces;
using System.Security.Claims;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var response = await _authService.RegisterAsync(dto);
            if (response == null)
                return BadRequest(new { message = "User with this email already exists." });

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var response = await _authService.LoginAsync(dto);
            if (response == null)
                return Unauthorized(new { message = "Invalid email or password." });

            return Ok(response);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var profile = await _authService.GetProfileAsync(userId.Value);
            if (profile == null) return NotFound();

            return Ok(profile);
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var success = await _authService.UpdateProfileAsync(userId.Value, dto);
            if (!success) return NotFound();

            return Ok(new { message = "Profile updated successfully" });
        }

        [HttpPost("avatar")]
        [Authorize]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var avatarUrl = await _authService.UploadAvatarAsync(userId.Value, file);
            if (avatarUrl == null) return BadRequest("No file uploaded or user not found.");

            return Ok(new { avatarUrl });
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
