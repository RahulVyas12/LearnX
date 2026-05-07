using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface ITestAttemptService
    {
        Task<TestAttempt?> GetByIdAsync(Guid id);
        Task<IEnumerable<TestAttempt>> GetAllAsync();
        Task AddAsync(TestAttempt entity);
        Task UpdateAsync(TestAttempt entity);
        Task DeleteAsync(Guid id);
    }
}
