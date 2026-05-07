using myapp_backend.DTOs;

namespace myapp_backend.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<QuestionDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<QuestionDto>> GetByModuleIdAsync(Guid moduleId);
        Task<IEnumerable<QuestionDto>> GetMasteryByLevelIdAsync(Guid levelId);
        Task<IEnumerable<QuestionDto>> GetPracticeBySkillPathIdAsync(Guid skillPathId, int count);
        Task<QuestionDto> AddAsync(CreateQuestionDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateQuestionDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
