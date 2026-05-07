using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
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

        [HttpGet("{skillPathId}")]
        public async Task<IActionResult> GetBySkillPathId(Guid skillPathId)
        {
            var dtos = await _levelService.GetBySkillPathIdAsync(skillPathId);
            return Ok(dtos);
        }

        [HttpGet("path/{skillPathId}/details")]
        public async Task<IActionResult> GetBySkillPathIdWithModules(Guid skillPathId)
        {
            var dtos = await _levelService.GetBySkillPathIdWithModulesAsync(skillPathId);
            return Ok(dtos);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] LevelDto dto)
        {
            var result = await _levelService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var dto = await _levelService.GetByIdAsync(id);
            if (dto == null) return NotFound();

            return Ok(dto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] LevelDto dto)
        {
            var success = await _levelService.UpdateAsync(id, dto);
            if (!success) return NotFound();

            return Ok(new { message = "Level updated successfully." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _levelService.DeleteAsync(id);
            if (!success) return NotFound();

            return Ok(new { message = "Level deleted successfully." });
        }
    }
}
