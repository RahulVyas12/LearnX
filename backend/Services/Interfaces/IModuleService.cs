using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface IModuleService
    {
        Task<Module?> GetByIdAsync(Guid id);
        Task<IEnumerable<Module>> GetAllAsync();
        Task AddAsync(Module entity);
        Task UpdateAsync(Module entity);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Module>> GetByLevelIdAsync(Guid levelId);
    }
}
