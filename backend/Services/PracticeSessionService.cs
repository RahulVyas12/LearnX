using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class PracticeSessionService : IPracticeSessionService
    {
        private readonly IPracticeSessionRepository _repository;

        public PracticeSessionService(IPracticeSessionRepository repository)
        {
            _repository = repository;
        }

        public async Task<PracticeSession?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<PracticeSession>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(PracticeSession entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(PracticeSession entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
