using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface IAnnouncementService
    {
        Task<Announcement?> GetByIdAsync(Guid id);
        Task<IEnumerable<Announcement>> GetAllAsync();
        Task AddAsync(Announcement entity);
        Task UpdateAsync(Announcement entity);
        Task DeleteAsync(Guid id);
    }
}
