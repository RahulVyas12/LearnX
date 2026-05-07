using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface IUserModuleProgressService
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
