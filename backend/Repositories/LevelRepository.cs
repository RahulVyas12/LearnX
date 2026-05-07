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
    public class LevelRepository : ILevelRepository
    {
        protected readonly AppDbContext _context;

        public LevelRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<Level?> GetByIdAsync(Guid id)
        {
            return await _context.Set<Level>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<Level>> GetAllAsync()
        {
            return await _context.Set<Level>().ToListAsync();
        }

        public virtual async Task AddAsync(Level entity)
        {
            await _context.Set<Level>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(Level entity)
        {
            _context.Set<Level>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<Level>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Level>> GetBySkillPathIdAsync(Guid skillPathId)
        {
            return await _context.Set<Level>()
                .Where(l => l.SkillPathId == skillPathId)
                .OrderBy(l => l.OrderIndex)
                .ToListAsync();
        }

        public async Task<Level?> GetByIdWithModulesAsync(Guid id)
        {
            return await _context.Levels
                .Include(l => l.Modules)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<IEnumerable<Level>> GetBySkillPathIdWithModulesAsync(Guid skillPathId)
        {
            return await _context.Levels
                .Where(l => l.SkillPathId == skillPathId)
                .Include(l => l.Modules)
                .OrderBy(l => l.OrderIndex)
                .ToListAsync();
        }
    }
}
