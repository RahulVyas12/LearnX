using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.Services.Interfaces;
using myapp_backend.Models;
using System.Security.Claims;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UploadsController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ISkillPathService _skillPathService;
        private readonly IUserService _userService;

        public UploadsController(IWebHostEnvironment environment, ISkillPathService skillPathService, IUserService userService)
        {
            _environment = environment;
            _skillPathService = skillPathService;
            _userService = userService;
        }

        [HttpPost("skillpath/{id}")]
        [Authorize(Roles = "admin")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadSkillPathImage(Guid id, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("No file uploaded.");

            var path = await _skillPathService.GetByIdAsync(id);
            if (path == null) return NotFound("Skill path not found.");

            var webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsDir = Path.Combine(webRootPath, "uploads");
            var skillPathsDir = Path.Combine(uploadsDir, "skillpaths");
            
            if (!Directory.Exists(skillPathsDir))
            {
                Directory.CreateDirectory(skillPathsDir);
            }

            var fileName = $"skillpath_{id}_{DateTime.Now:yyyyMMddHHmmss}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(skillPathsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            path.ImageUrl = $"/uploads/skillpaths/{fileName}";
            await _skillPathService.UpdateAsync(path);

            return Ok(new { imageUrl = path.ImageUrl });
        }

        [HttpPost("avatar")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("No file uploaded.");

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            var webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsDir = Path.Combine(webRootPath, "uploads");

            if (!Directory.Exists(uploadsDir))
            {
                Directory.CreateDirectory(uploadsDir);
            }

            var fileName = $"avatar_{userId}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.AvatarUrl = $"/uploads/{fileName}";
            await _userService.UpdateAsync(user);

            return Ok(new { avatarUrl = user.AvatarUrl });
        }
    }
}
