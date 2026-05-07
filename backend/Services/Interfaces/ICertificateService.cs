using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface ICertificateService
    {
        Task<Certificate?> GetByIdAsync(Guid id);
        Task<IEnumerable<Certificate>> GetAllAsync();
        Task AddAsync(Certificate entity);
        Task UpdateAsync(Certificate entity);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Certificate>> GetByUserAsync(Guid userId);
    }
}
