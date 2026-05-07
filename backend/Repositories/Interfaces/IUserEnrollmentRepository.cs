using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Repositories.Interfaces
{
    public interface IUserEnrollmentRepository
    {
        Task<UserEnrollment?> GetByIdAsync(Guid id);
        Task<IEnumerable<UserEnrollment>> GetAllAsync();
        Task AddAsync(UserEnrollment entity);
        Task UpdateAsync(UserEnrollment entity);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<UserEnrollment>> GetByUserAsync(Guid userId);
        Task<bool> IsEnrolledAsync(Guid userId, Guid skillPathId);    }
}
