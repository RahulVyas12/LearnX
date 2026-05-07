using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class TestAttemptService : ITestAttemptService
    {
        private readonly ITestAttemptRepository _repository;

        public TestAttemptService(ITestAttemptRepository repository)
        {
            _repository = repository;
        }

        public async Task<TestAttempt?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<TestAttempt>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(TestAttempt entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(TestAttempt entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
