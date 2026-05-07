using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface ILevelService
    {
        Task<Level?> GetByIdAsync(Guid id);
        Task<IEnumerable<Level>> GetAllAsync();
        Task AddAsync(Level entity);
        Task UpdateAsync(Level entity);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Level>> GetBySkillPathIdAsync(Guid skillPathId);
        Task<Level?> GetByIdWithModulesAsync(Guid id);
    }
}
