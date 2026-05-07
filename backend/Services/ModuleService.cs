using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class ModuleService : IModuleService
    {
        private readonly IModuleRepository _repository;

        public ModuleService(IModuleRepository repository)
        {
            _repository = repository;
        }

        public async Task<Module?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Module>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(Module entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(Module entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Module>> GetByLevelIdAsync(Guid levelId)
        {
            return await _repository.GetByLevelIdAsync(levelId);
        }
    }
}
