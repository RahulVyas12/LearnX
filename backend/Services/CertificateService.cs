using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly ICertificateRepository _repository;

        public CertificateService(ICertificateRepository repository)
        {
            _repository = repository;
        }

        public async Task<Certificate?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Certificate>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(Certificate entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(Certificate entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Certificate>> GetByUserAsync(Guid userId)
        {
            return await _repository.GetByUserAsync(userId);
        }
    }
}
