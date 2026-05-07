using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionsController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet("{moduleId}")]
        [Authorize]
        public async Task<IActionResult> GetByModule(Guid moduleId)
        {
            var dtos = await _questionService.GetByModuleIdAsync(moduleId);
            return Ok(dtos);
        }

        [HttpGet("mastery/{levelId}")]
        [Authorize]
        public async Task<IActionResult> GetMasteryQuestions(Guid levelId)
        {
            var dtos = await _questionService.GetMasteryByLevelIdAsync(levelId);
            return Ok(dtos);
        }

        [HttpGet("practice/{skillPathId}")]
        [Authorize]
        public async Task<IActionResult> GetPracticeQuestions(Guid skillPathId)
        {
            var dtos = await _questionService.GetPracticeBySkillPathIdAsync(skillPathId, 10);
            return Ok(dtos);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] CreateQuestionDto dto)
        {
            var result = await _questionService.AddAsync(dto);
            return Created($"/api/questions/{result.Id}", result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateQuestionDto dto)
        {
            var success = await _questionService.UpdateAsync(id, dto);
            if (!success) return NotFound();

            return Ok(new { message = "Question updated successfully." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _questionService.DeleteAsync(id);
            if (!success) return NotFound();

            return Ok(new { message = "Question deleted successfully." });
        }
    }
}
