using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<Question?> GetByIdAsync(Guid id);
        Task<IEnumerable<Question>> GetAllAsync();
        Task AddAsync(Question entity);
        Task UpdateAsync(Question entity);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Question>> GetByModuleIdAsync(Guid moduleId);
        Task<IEnumerable<Question>> GetMasteryByLevelIdAsync(Guid levelId);
        Task<IEnumerable<Question>> GetPracticeBySkillPathIdAsync(Guid skillPathId, int count = 10);
    }
}
