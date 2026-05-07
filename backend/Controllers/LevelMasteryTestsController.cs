using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LevelMasteryTestsController : ControllerBase
    {
        private readonly ILevelMasteryTestService _masteryTestService;
        private readonly ILevelService _levelService;

        public LevelMasteryTestsController(
            ILevelMasteryTestService masteryTestService,
            ILevelService levelService)
        {
            _masteryTestService = masteryTestService;
            _levelService = levelService;
        }

        /// <summary>
        /// GET /api/levelmasterytests/{levelId} - Get mastery test for a level
        /// </summary>
        [HttpGet("{levelId}")]
        [Authorize]
        public async Task<IActionResult> GetByLevel(Guid levelId)
        {
            // Verify level exists
            var level = await _levelService.GetByIdAsync(levelId);
            if (level == null)
                return NotFound(new { message = "Level not found." });

            var masteryTest = await _masteryTestService.GetByLevelIdAsync(levelId);
            if (masteryTest == null)
                return Ok(new { message = "No mastery test found for this level." });

            var dto = new LevelMasteryTestDto
            {
                Id = masteryTest.Id,
                LevelId = masteryTest.LevelId,
                Title = masteryTest.Title,
                TimeLimitMinutes = masteryTest.TimeLimitMinutes,
                CreatedAt = masteryTest.CreatedAt,
                UpdatedAt = masteryTest.UpdatedAt,
                QuestionCount = masteryTest.Questions?.Count ?? 0,
                MasteryThreshold = 0.90f // Always 90%
            };

            return Ok(dto);
        }

        /// <summary>
        /// POST /api/levelmasterytests - Create a new mastery test (admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] CreateLevelMasteryTestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Verify level exists
            var level = await _levelService.GetByIdAsync(dto.LevelId);
            if (level == null)
                return NotFound(new { message = "Level not found." });

            // Check if mastery test already exists for this level
            var existingTest = await _masteryTestService.GetByLevelIdAsync(dto.LevelId);
            if (existingTest != null)
                return BadRequest(new { message = "A mastery test already exists for this level." });

            var masteryTest = new LevelMasteryTest
            {
                Id = Guid.NewGuid(),
                LevelId = dto.LevelId,
                Title = dto.Title,
                TimeLimitMinutes = dto.TimeLimitMinutes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _masteryTestService.AddAsync(masteryTest);

            var responseDto = new LevelMasteryTestDto
            {
                Id = masteryTest.Id,
                LevelId = masteryTest.LevelId,
                Title = masteryTest.Title,
                TimeLimitMinutes = masteryTest.TimeLimitMinutes,
                CreatedAt = masteryTest.CreatedAt,
                UpdatedAt = masteryTest.UpdatedAt,
                QuestionCount = 0,
                MasteryThreshold = 0.90f
            };

            return Created($"/api/levelmasterytests/{masteryTest.Id}", responseDto);
        }

        /// <summary>
        /// PUT /api/levelmasterytests/{id} - Update mastery test (admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLevelMasteryTestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var masteryTest = await _masteryTestService.GetByIdAsync(id);
            if (masteryTest == null)
                return NotFound(new { message = "Mastery test not found." });

            masteryTest.Title = dto.Title;
            masteryTest.TimeLimitMinutes = dto.TimeLimitMinutes;
            masteryTest.UpdatedAt = DateTime.UtcNow;

            await _masteryTestService.UpdateAsync(masteryTest);

            var responseDto = new LevelMasteryTestDto
            {
                Id = masteryTest.Id,
                LevelId = masteryTest.LevelId,
                Title = masteryTest.Title,
                TimeLimitMinutes = masteryTest.TimeLimitMinutes,
                CreatedAt = masteryTest.CreatedAt,
                UpdatedAt = masteryTest.UpdatedAt,
                QuestionCount = masteryTest.Questions?.Count ?? 0,
                MasteryThreshold = 0.90f
            };

            return Ok(responseDto);
        }

        /// <summary>
        /// DELETE /api/levelmasterytests/{id} - Delete mastery test (admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var masteryTest = await _masteryTestService.GetByIdAsync(id);
            if (masteryTest == null)
                return NotFound(new { message = "Mastery test not found." });

            await _masteryTestService.DeleteAsync(id);
            return NoContent();
        }
    }
}
