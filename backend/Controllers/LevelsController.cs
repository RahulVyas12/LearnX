using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LevelsController : ControllerBase
    {
        private readonly ILevelService _levelService;

        public LevelsController(ILevelService levelService)
        {
            _levelService = levelService;
        }

        /// <summary>
        /// GET /api/levels/{skillPathId} — Get all levels for a skill path
        /// </summary>
        [HttpGet("{skillPathId}")]
        public async Task<IActionResult> GetBySkillPath(Guid skillPathId)
        {
            var levels = await _levelService.GetBySkillPathIdAsync(skillPathId);
            var dtos = levels.Select(l => new LevelDto
            {
                Id = l.Id,
                Title = l.Title,
                Tier = l.Tier,
                OrderIndex = l.OrderIndex,
                TotalModules = l.Modules?.Count ?? 0
            }).ToList();

            return Ok(dtos);
        }

        /// <summary>
        /// GET /api/levels/detail/{levelId} — Get a single level with its modules
        /// </summary>
        [HttpGet("detail/{levelId}")]
        public async Task<IActionResult> GetDetail(Guid levelId)
        {
            var level = await _levelService.GetByIdWithModulesAsync(levelId);
            if (level == null) return NotFound(new { message = "Level not found." });

            var dto = new LevelDetailDto
            {
                Id = level.Id,
                Title = level.Title,
                Tier = level.Tier,
                OrderIndex = level.OrderIndex,
                MasteryThreshold = level.MasteryThreshold,
                Modules = level.Modules.Select(m => new ModuleDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    ContentMarkdown = m.ContentMarkdown,
                    OrderIndex = m.OrderIndex
                }).ToList()
            };

            return Ok(dto);
        }

        /// <summary>
        /// POST /api/levels — Create a new level (admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] CreateLevelDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var level = new Level
            {
                Id = Guid.NewGuid(),
                SkillPathId = dto.SkillPathId,
                Title = dto.Title,
                Tier = dto.Tier.ToLower(),
                OrderIndex = dto.OrderIndex,
                MasteryThreshold = dto.MasteryThreshold
            };

            await _levelService.AddAsync(level);

            return CreatedAtAction(nameof(GetDetail), new { levelId = level.Id }, new LevelDto
            {
                Id = level.Id,
                Title = level.Title,
                Tier = level.Tier,
                OrderIndex = level.OrderIndex,
                TotalModules = 0
            });
        }

        /// <summary>
        /// PUT /api/levels/{id} — Update an existing level (admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLevelDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var level = await _levelService.GetByIdAsync(id);
            if (level == null) return NotFound(new { message = "Level not found." });

            level.Title = dto.Title;
            level.Tier = dto.Tier.ToLower();
            level.OrderIndex = dto.OrderIndex;
            level.MasteryThreshold = dto.MasteryThreshold;

            await _levelService.UpdateAsync(level);

            return Ok(new LevelDto
            {
                Id = level.Id,
                Title = level.Title,
                Tier = level.Tier,
                OrderIndex = level.OrderIndex
            });
        }

        /// <summary>
        /// DELETE /api/levels/{id} — Delete a level (admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var level = await _levelService.GetByIdAsync(id);
            if (level == null) return NotFound(new { message = "Level not found." });

            await _levelService.DeleteAsync(id);
            return NoContent();
        }
    }
}
