using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Repositories.Interfaces
{
    public interface IUserLevelProgressRepository
    {
        Task<UserLevelProgress?> GetByIdAsync(Guid id);
        Task<IEnumerable<UserLevelProgress>> GetAllAsync();
        Task AddAsync(UserLevelProgress entity);
        Task UpdateAsync(UserLevelProgress entity);
        Task DeleteAsync(Guid id);
        Task<UserLevelProgress?> GetByUserAndLevelAsync(Guid userId, Guid levelId);
        Task<IEnumerable<UserLevelProgress>> GetUnlockedLevelsForUserAsync(Guid userId);    }
}
