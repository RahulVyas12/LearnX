using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Models;
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

        /// <summary>
        /// GET /api/modules/{levelId} — Get all modules for a level
        /// </summary>
        [HttpGet("{levelId}")]
        public async Task<IActionResult> GetByLevel(Guid levelId)
        {
            var modules = await _moduleService.GetByLevelIdAsync(levelId);
            var dtos = modules.Select(m => new ModuleDto
            {
                Id = m.Id,
                Title = m.Title,
                ContentMarkdown = m.ContentMarkdown,
                OrderIndex = m.OrderIndex
            }).ToList();

            return Ok(dtos);
        }

        /// <summary>
        /// GET /api/modules/detail/{moduleId} — Get a single module with full content
        /// </summary>
        [HttpGet("detail/{moduleId}")]
        public async Task<IActionResult> GetDetail(Guid moduleId)
        {
            var module = await _moduleService.GetByIdAsync(moduleId);
            if (module == null) return NotFound(new { message = "Module not found." });

            var dto = new ModuleDto
            {
                Id = module.Id,
                LevelId = module.LevelId,
                LevelTitle = module.Level?.Title ?? "Unknown Level",
                Title = module.Title,
                ContentMarkdown = module.ContentMarkdown,
                OrderIndex = module.OrderIndex
            };

            return Ok(dto);
        }

        /// <summary>
        /// POST /api/modules — Create a new module (admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] CreateModuleDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var module = new Module
            {
                Id = Guid.NewGuid(),
                LevelId = dto.LevelId,
                Title = dto.Title,
                ContentMarkdown = dto.ContentMarkdown,
                OrderIndex = dto.OrderIndex,
                CreatedAt = DateTime.UtcNow
            };

            await _moduleService.AddAsync(module);

            return CreatedAtAction(nameof(GetDetail), new { moduleId = module.Id }, new ModuleDto
            {
                Id = module.Id,
                Title = module.Title,
                ContentMarkdown = module.ContentMarkdown,
                OrderIndex = module.OrderIndex
            });
        }

        /// <summary>
        /// PUT /api/modules/{id} — Update an existing module (admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateModuleDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var module = await _moduleService.GetByIdAsync(id);
            if (module == null) return NotFound(new { message = "Module not found." });

            module.Title = dto.Title;
            module.ContentMarkdown = dto.ContentMarkdown;
            module.OrderIndex = dto.OrderIndex;

            await _moduleService.UpdateAsync(module);

            return Ok(new ModuleDto
            {
                Id = module.Id,
                Title = module.Title,
                ContentMarkdown = module.ContentMarkdown,
                OrderIndex = module.OrderIndex
            });
        }

        /// <summary>
        /// DELETE /api/modules/{id} — Delete a module (admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var module = await _moduleService.GetByIdAsync(id);
            if (module == null) return NotFound(new { message = "Module not found." });

            await _moduleService.DeleteAsync(id);
            return NoContent();
        }
    }
}
