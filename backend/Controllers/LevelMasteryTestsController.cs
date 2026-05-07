using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LevelMasteryTestsController : ControllerBase
    {
        private readonly ILevelMasteryTestService _masteryTestService;

        public LevelMasteryTestsController(ILevelMasteryTestService masteryTestService)
        {
            _masteryTestService = masteryTestService;
        }

        [HttpGet("{levelId}")]
        [Authorize]
        public async Task<IActionResult> GetByLevel(Guid levelId)
        {
            var dto = await _masteryTestService.GetByLevelIdAsync(levelId);
            if (dto == null)
                return Ok(new { message = "No mastery test found for this level." });

            return Ok(dto);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] CreateLevelMasteryTestDto dto)
        {
            var result = await _masteryTestService.AddAsync(dto);
            return Created($"/api/levelmasterytests/{result.Id}", result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLevelMasteryTestDto dto)
        {
            var success = await _masteryTestService.UpdateAsync(id, dto);
            if (!success) return NotFound();

            return Ok(new { message = "Mastery test updated successfully." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _masteryTestService.DeleteAsync(id);
            if (!success) return NotFound();

            return Ok(new { message = "Mastery test deleted successfully." });
        }
    }
}
