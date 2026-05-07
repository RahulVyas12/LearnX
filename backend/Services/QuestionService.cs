using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _repository;

        public QuestionService(IQuestionRepository repository)
        {
            _repository = repository;
        }

        public async Task<Question?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Question>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(Question entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(Question entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Question>> GetByModuleIdAsync(Guid moduleId)
        {
            return await _repository.GetByModuleIdAsync(moduleId);
        }

        public async Task<IEnumerable<Question>> GetMasteryByLevelIdAsync(Guid levelId)
        {
            return await _repository.GetMasteryByLevelIdAsync(levelId);
        }

        public async Task<IEnumerable<Question>> GetPracticeBySkillPathIdAsync(Guid skillPathId, int count = 10)
        {
            return await _repository.GetPracticeBySkillPathIdAsync(skillPathId, count);
        }
    }
}
