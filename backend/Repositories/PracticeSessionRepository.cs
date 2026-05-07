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
    public class PracticeSessionRepository : IPracticeSessionRepository
    {
        protected readonly AppDbContext _context;

        public PracticeSessionRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<PracticeSession?> GetByIdAsync(Guid id)
        {
            return await _context.Set<PracticeSession>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<PracticeSession>> GetAllAsync()
        {
            return await _context.Set<PracticeSession>().ToListAsync();
        }

        public virtual async Task AddAsync(PracticeSession entity)
        {
            await _context.Set<PracticeSession>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(PracticeSession entity)
        {
            _context.Set<PracticeSession>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<PracticeSession>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }    }
}
