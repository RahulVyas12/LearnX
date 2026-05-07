using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class UserModuleProgressService : IUserModuleProgressService
    {
        private readonly IUserModuleProgressRepository _repository;

        public UserModuleProgressService(IUserModuleProgressRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserModuleProgress?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<UserModuleProgress>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(UserModuleProgress entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(UserModuleProgress entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<UserModuleProgress?> GetByUserAndModuleAsync(Guid userId, Guid moduleId)
        {
            return await _repository.GetByUserAndModuleAsync(userId, moduleId);
        }

        public async Task<IEnumerable<UserModuleProgress>> GetByUserAndLevelAsync(Guid userId, Guid levelId)
        {
            return await _repository.GetByUserAndLevelAsync(userId, levelId);
        }
    }
}
