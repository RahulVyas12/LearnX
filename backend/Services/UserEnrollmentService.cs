using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class UserEnrollmentService : IUserEnrollmentService
    {
        private readonly IUserEnrollmentRepository _repository;

        public UserEnrollmentService(IUserEnrollmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserEnrollment?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<UserEnrollment>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync(UserEnrollment entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(UserEnrollment entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<UserEnrollment>> GetByUserAsync(Guid userId)
        {
            return await _repository.GetByUserAsync(userId);
        }

        public async Task<bool> IsEnrolledAsync(Guid userId, Guid skillPathId)
        {
            return await _repository.IsEnrolledAsync(userId, skillPathId);
        }
    }
}
