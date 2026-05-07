using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Repositories.Interfaces
{
    public interface ITestAttemptRepository
    {
        Task<TestAttempt?> GetByIdAsync(Guid id);
        Task<IEnumerable<TestAttempt>> GetAllAsync();
        Task AddAsync(TestAttempt entity);
        Task UpdateAsync(TestAttempt entity);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<TestAttempt>> GetAttemptsByUserAndLevelAsync(Guid userId, Guid levelId);
        Task<TestAttempt?> GetLatestAttemptAsync(Guid userId, Guid levelId);    }
}
