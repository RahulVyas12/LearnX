using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Models;
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

        /// <summary>
        /// GET /api/questions/{moduleId} — Get questions for a module test.
        /// Requires authentication. Strips CorrectAnswer from response.
        /// </summary>
        [HttpGet("{moduleId}")]
        [Authorize]
        public async Task<IActionResult> GetByModule(Guid moduleId)
        {
            var questions = await _questionService.GetByModuleIdAsync(moduleId);
            var dtos = questions.Select(MapToSafeDto).ToList();
            return Ok(dtos);
        }

        /// <summary>
        /// GET /api/questions/mastery/{levelId} — Get mastery test questions for a level.
        /// Requires authentication.
        /// </summary>
        [HttpGet("mastery/{levelId}")]
        [Authorize]
        public async Task<IActionResult> GetMasteryQuestions(Guid levelId)
        {
            var questions = await _questionService.GetMasteryByLevelIdAsync(levelId);
            var dtos = questions.Select(MapToSafeDto).ToList();
            return Ok(dtos);
        }

        /// <summary>
        /// GET /api/questions/practice/{skillPathId} — Get random 10 practice questions.
        /// Requires authentication.
        /// </summary>
        [HttpGet("practice/{skillPathId}")]
        [Authorize]
        public async Task<IActionResult> GetPracticeQuestions(Guid skillPathId)
        {
            var questions = await _questionService.GetPracticeBySkillPathIdAsync(skillPathId, 10);
            var dtos = questions.Select(MapToSafeDto).ToList();
            return Ok(dtos);
        }

        /// <summary>
        /// POST /api/questions — Create a new question (admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] CreateQuestionDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var question = new Question
            {
                Id = Guid.NewGuid(),
                ModuleId = dto.ModuleId,
                LevelId = dto.LevelId,
                Scope = dto.Scope.ToLower(),
                Type = dto.Type.ToLower(),
                QuestionText = dto.QuestionText,
                Options = dto.Options,
                CorrectAnswer = dto.CorrectAnswer,
                Points = dto.Points
            };

            await _questionService.AddAsync(question);

            return Created($"/api/questions/{question.Id}", new { question.Id, question.QuestionText, question.Scope });
        }

        /// <summary>
        /// PUT /api/questions/{id} — Update a question (admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateQuestionDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var question = await _questionService.GetByIdAsync(id);
            if (question == null) return NotFound(new { message = "Question not found." });

            question.ModuleId = dto.ModuleId;
            question.LevelId = dto.LevelId;
            question.Scope = dto.Scope.ToLower();
            question.Type = dto.Type.ToLower();
            question.QuestionText = dto.QuestionText;
            question.Options = dto.Options;
            question.CorrectAnswer = dto.CorrectAnswer;
            question.Points = dto.Points;

            await _questionService.UpdateAsync(question);

            return Ok(new { question.Id, question.QuestionText, question.Scope });
        }

        /// <summary>
        /// DELETE /api/questions/{id} — Delete a question (admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var question = await _questionService.GetByIdAsync(id);
            if (question == null) return NotFound(new { message = "Question not found." });

            await _questionService.DeleteAsync(id);
            return NoContent();
        }

        // ── Private helper: strips CorrectAnswer to prevent cheating ──
        private static QuestionDto MapToSafeDto(Question q) => new()
        {
            Id = q.Id,
            QuestionText = q.QuestionText,
            Type = q.Type,
            Scope = q.Scope,
            Options = q.Options,
            Points = q.Points
        };
    }
}
