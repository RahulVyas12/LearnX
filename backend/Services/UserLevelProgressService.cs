using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class UserLevelProgressService : IUserLevelProgressService
    {
        private readonly IUserLevelProgressRepository _repository;

        public UserLevelProgressService(IUserLevelProgressRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserLevelProgress?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<UserLevelProgress>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(UserLevelProgress entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(UserLevelProgress entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<UserLevelProgress?> GetByUserAndLevelAsync(Guid userId, Guid levelId)
        {
            return await _repository.GetByUserAndLevelAsync(userId, levelId);
        }
    }
}
