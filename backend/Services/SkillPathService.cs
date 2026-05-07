using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class SkillPathService : ISkillPathService
    {
        private readonly ISkillPathRepository _repository;

        public SkillPathService(ISkillPathRepository repository)
        {
            _repository = repository;
        }

        public async Task<SkillPath?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<SkillPath>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(SkillPath entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(SkillPath entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
