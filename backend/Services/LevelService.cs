using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class LevelService : ILevelService
    {
        private readonly ILevelRepository _repository;

        public LevelService(ILevelRepository repository)
        {
            _repository = repository;
        }

        public async Task<Level?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Level>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(Level entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(Level entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Level>> GetBySkillPathIdAsync(Guid skillPathId)
        {
            return await _repository.GetBySkillPathIdAsync(skillPathId);
        }

        public async Task<Level?> GetByIdWithModulesAsync(Guid id)
        {
            return await _repository.GetByIdWithModulesAsync(id);
        }
    }
}
