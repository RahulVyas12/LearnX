using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface IPracticeSessionService
    {
        Task<PracticeSession?> GetByIdAsync(Guid id);
        Task<IEnumerable<PracticeSession>> GetAllAsync();
        Task AddAsync(PracticeSession entity);
        Task UpdateAsync(PracticeSession entity);
        Task DeleteAsync(Guid id);
    }
}
