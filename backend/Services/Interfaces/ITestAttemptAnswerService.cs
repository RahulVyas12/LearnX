using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface ITestAttemptAnswerService
    {
        Task<TestAttemptAnswer?> GetByIdAsync(Guid id);
        Task<IEnumerable<TestAttemptAnswer>> GetAllAsync();
        Task AddAsync(TestAttemptAnswer entity);
        Task UpdateAsync(TestAttemptAnswer entity);
        Task DeleteAsync(Guid id);
    }
}
