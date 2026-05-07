using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface IUserEnrollmentService
    {
        Task<UserEnrollment?> GetByIdAsync(Guid id);
        Task<IEnumerable<UserEnrollment>> GetAllAsync();
        Task AddAsync(UserEnrollment entity);
        Task UpdateAsync(UserEnrollment entity);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<UserEnrollment>> GetByUserAsync(Guid userId);
        Task<bool> IsEnrolledAsync(Guid userId, Guid skillPathId);
    }
}
