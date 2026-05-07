using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using myapp_backend.Data;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;

namespace myapp_backend.Repositories
{
    public class UserEnrollmentRepository : IUserEnrollmentRepository
    {
        protected readonly AppDbContext _context;

        public UserEnrollmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<UserEnrollment?> GetByIdAsync(Guid id)
        {
            return await _context.Set<UserEnrollment>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<UserEnrollment>> GetAllAsync()
        {
            return await _context.Set<UserEnrollment>().ToListAsync();
        }

        public virtual async Task AddAsync(UserEnrollment entity)
        {
            await _context.Set<UserEnrollment>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(UserEnrollment entity)
        {
            _context.Set<UserEnrollment>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<UserEnrollment>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<UserEnrollment>> GetByUserAsync(Guid userId)
        {
            return await _context.UserEnrollments.Where(e => e.UserId == userId).ToListAsync();
        }

        public async Task<bool> IsEnrolledAsync(Guid userId, Guid skillPathId)
        {
            return await _context.UserEnrollments.AnyAsync(e => e.UserId == userId && e.SkillPathId == skillPathId && e.Status == "active");
        }    }
}
