using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Services.Interfaces;
using System.Security.Claims;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;

        public AnnouncementsController(IAnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var announcements = await _announcementService.GetAllAsync();
            return Ok(announcements.OrderByDescending(a => a.CreatedAt));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] AnnouncementCreateDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var announcement = new Announcement
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Content = dto.Content,
                Category = dto.Category,
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow
            };

            await _announcementService.AddAsync(announcement);
            return Ok(announcement);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _announcementService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _announcementService.DeleteAsync(id);
            return Ok(new { message = "Announcement deleted." });
        }
    }
}
