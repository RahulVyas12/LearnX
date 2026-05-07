using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Repositories.Interfaces
{
    public interface IUserModuleProgressRepository
    {
        Task<UserModuleProgress?> GetByIdAsync(Guid id);
        Task<IEnumerable<UserModuleProgress>> GetAllAsync();
        Task AddAsync(UserModuleProgress entity);
        Task UpdateAsync(UserModuleProgress entity);
        Task DeleteAsync(Guid id);
        Task<UserModuleProgress?> GetByUserAndModuleAsync(Guid userId, Guid moduleId);
        Task<IEnumerable<UserModuleProgress>> GetByUserAndLevelAsync(Guid userId, Guid levelId);
    }
}
