using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.Services.Interfaces;
using myapp_backend.DTOs;
using System.Security.Claims;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UploadsController : ControllerBase
    {
        private readonly IUploadService _uploadService;
        private readonly ISkillPathService _skillPathService;
        private readonly IUserService _userService;

        public UploadsController(IUploadService uploadService, ISkillPathService skillPathService, IUserService userService)
        {
            _uploadService = uploadService;
            _skillPathService = skillPathService;
            _userService = userService;
        }

        [HttpPost("skillpath/{id}")]
        [Authorize(Roles = "admin")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadSkillPathImage(Guid id, [FromForm] IFormFile file)
        {
            var path = await _skillPathService.GetByIdAsync(id);
            if (path == null) return NotFound("Skill path not found.");

            var imageUrl = await _uploadService.UploadFileAsync(file, "skillpaths", $"skillpath_{id}");
            if (imageUrl == null) return BadRequest("No file uploaded.");

            path.ImageUrl = imageUrl;
            await _skillPathService.UpdateAsync(id, path);

            return Ok(new { imageUrl });
        }

        [HttpPost("avatar")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            var avatarUrl = await _uploadService.UploadFileAsync(file, "avatars", $"avatar_{userId}");
            if (avatarUrl == null) return BadRequest("No file uploaded.");

            await _userService.UpdateUserAsync(userId, new AdminUserUpdateDto { AvatarUrl = avatarUrl });
            
            return Ok(new { avatarUrl });
        }
    }
}
