using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillPathsController : ControllerBase
    {
        private readonly ISkillPathService _skillPathService;

        public SkillPathsController(ISkillPathService skillPathService)
        {
            _skillPathService = skillPathService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var dtos = await _skillPathService.GetAllAsync();
            return Ok(dtos.Where(d => d.IsPublished));
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllAdmin()
        {
            var dtos = await _skillPathService.GetAllAsync();
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var dto = await _skillPathService.GetByIdAsync(id);
            if (dto == null) return NotFound();

            return Ok(dto);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] SkillPathDto dto)
        {
            var result = await _skillPathService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] SkillPathDto dto)
        {
            var success = await _skillPathService.UpdateAsync(id, dto);
            if (!success) return NotFound();

            return Ok(new { message = "Skill Path updated successfully." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _skillPathService.DeleteAsync(id);
            if (!success) return NotFound();

            return Ok(new { message = "Skill Path deleted successfully." });
        }
    }
}
