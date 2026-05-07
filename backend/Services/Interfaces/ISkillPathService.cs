using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface ISkillPathService
    {
        Task<SkillPath?> GetByIdAsync(Guid id);
        Task<IEnumerable<SkillPath>> GetAllAsync();
        Task AddAsync(SkillPath entity);
        Task UpdateAsync(SkillPath entity);
        Task DeleteAsync(Guid id);
    }
}
