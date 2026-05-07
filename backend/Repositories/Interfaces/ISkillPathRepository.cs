using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Repositories.Interfaces
{
    public interface ISkillPathRepository
    {
        Task<SkillPath?> GetByIdAsync(Guid id);
        Task<IEnumerable<SkillPath>> GetAllAsync();
        Task AddAsync(SkillPath entity);
        Task UpdateAsync(SkillPath entity);
        Task DeleteAsync(Guid id);    }
}
