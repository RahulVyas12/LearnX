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
    public class TestAttemptRepository : ITestAttemptRepository
    {
        protected readonly AppDbContext _context;

        public TestAttemptRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<TestAttempt?> GetByIdAsync(Guid id)
        {
            return await _context.Set<TestAttempt>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<TestAttempt>> GetAllAsync()
        {
            return await _context.Set<TestAttempt>().ToListAsync();
        }

        public virtual async Task AddAsync(TestAttempt entity)
        {
            await _context.Set<TestAttempt>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(TestAttempt entity)
        {
            _context.Set<TestAttempt>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<TestAttempt>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<TestAttempt>> GetAttemptsByUserAndLevelAsync(Guid userId, Guid levelId)
        {
            return await _context.TestAttempts.Where(t => t.UserId == userId && t.LevelId == levelId).ToListAsync();
        }

        public async Task<TestAttempt?> GetLatestAttemptAsync(Guid userId, Guid levelId)
        {
            return await _context.TestAttempts.Where(t => t.UserId == userId && t.LevelId == levelId).OrderByDescending(t => t.AttemptedAt).FirstOrDefaultAsync();
        }    }
}
