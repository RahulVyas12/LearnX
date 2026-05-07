using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Repositories.Interfaces
{
    public interface ITestAttemptAnswerRepository
    {
        Task<TestAttemptAnswer?> GetByIdAsync(Guid id);
        Task<IEnumerable<TestAttemptAnswer>> GetAllAsync();
        Task AddAsync(TestAttemptAnswer entity);
        Task UpdateAsync(TestAttemptAnswer entity);
        Task DeleteAsync(Guid id);    }
}
