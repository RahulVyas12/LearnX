using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
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
            var skillPaths = await _skillPathService.GetAllAsync();
            var dtos = skillPaths
                .Where(sp => sp.IsPublished)
                .Select(sp => new SkillPathDto
                {
                    Id = sp.Id,
                    Title = sp.Title,
                    Description = sp.Description ?? "",
                    Domain = sp.Domain ?? "",
                    IsPublished = sp.IsPublished,
                    ImageUrl = sp.ImageUrl ?? ""
                }).ToList();

            return Ok(dtos);
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllAdmin()
        {
            var skillPaths = await _skillPathService.GetAllAsync();
            var dtos = skillPaths.Select(sp => new SkillPathDto
            {
                Id = sp.Id,
                Title = sp.Title,
                Description = sp.Description ?? "",
                Domain = sp.Domain ?? "",
                IsPublished = sp.IsPublished,
                ImageUrl = sp.ImageUrl ?? ""
            }).ToList();

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var sp = await _skillPathService.GetByIdAsync(id);
            if (sp == null) return NotFound();

            var dto = new SkillPathDto
            {
                Id = sp.Id,
                Title = sp.Title,
                Description = sp.Description ?? "",
                Domain = sp.Domain ?? "",
                IsPublished = sp.IsPublished,
                ImageUrl = sp.ImageUrl ?? ""
            };

            return Ok(dto);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] SkillPathDto dto)
        {
            var sp = new SkillPath
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                Domain = dto.Domain,
                IsPublished = dto.IsPublished,
                ImageUrl = dto.ImageUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _skillPathService.AddAsync(sp);
            return CreatedAtAction(nameof(GetById), new { id = sp.Id }, sp);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] SkillPathDto dto)
        {
            var sp = await _skillPathService.GetByIdAsync(id);
            if (sp == null) return NotFound();

            sp.Title = dto.Title;
            sp.Description = dto.Description;
            sp.Domain = dto.Domain;
            sp.IsPublished = dto.IsPublished;
            sp.ImageUrl = dto.ImageUrl;
            sp.UpdatedAt = DateTime.UtcNow;

            await _skillPathService.UpdateAsync(sp);
            return Ok(sp);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var sp = await _skillPathService.GetByIdAsync(id);
            if (sp == null) return NotFound();

            await _skillPathService.DeleteAsync(id);
            return Ok(new { message = "Skill Path deleted successfully." });
        }
    }
}
