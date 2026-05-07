using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModulesController : ControllerBase
    {
        private readonly IModuleService _moduleService;

        public ModulesController(IModuleService moduleService)
        {
            _moduleService = moduleService;
        }

        [HttpGet("{levelId}")]
        public async Task<IActionResult> GetByLevelId(Guid levelId)
        {
            var dtos = await _moduleService.GetByLevelIdAsync(levelId);
            return Ok(dtos);
        }

        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetDetail(Guid id)
        {
            var dto = await _moduleService.GetDetailByIdAsync(id);
            if (dto == null) return NotFound();

            return Ok(dto);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] ModuleDto dto)
        {
            var result = await _moduleService.AddAsync(dto);
            return CreatedAtAction(nameof(GetDetail), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ModuleDto dto)
        {
            var success = await _moduleService.UpdateAsync(id, dto);
            if (!success) return NotFound();

            return Ok(new { message = "Module updated successfully." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _moduleService.DeleteAsync(id);
            if (!success) return NotFound();

            return Ok(new { message = "Module deleted successfully." });
        }
    }
}
