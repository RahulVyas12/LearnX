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
    public class TestAttemptAnswerRepository : ITestAttemptAnswerRepository
    {
        protected readonly AppDbContext _context;

        public TestAttemptAnswerRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<TestAttemptAnswer?> GetByIdAsync(Guid id)
        {
            return await _context.Set<TestAttemptAnswer>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<TestAttemptAnswer>> GetAllAsync()
        {
            return await _context.Set<TestAttemptAnswer>().ToListAsync();
        }

        public virtual async Task AddAsync(TestAttemptAnswer entity)
        {
            await _context.Set<TestAttemptAnswer>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(TestAttemptAnswer entity)
        {
            _context.Set<TestAttemptAnswer>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<TestAttemptAnswer>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }    }
}
