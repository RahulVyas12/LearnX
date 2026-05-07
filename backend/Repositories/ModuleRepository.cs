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
    public class ModuleRepository : IModuleRepository
    {
        protected readonly AppDbContext _context;

        public ModuleRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<Module?> GetByIdAsync(Guid id)
        {
            return await _context.Set<Module>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<Module>> GetAllAsync()
        {
            return await _context.Set<Module>().ToListAsync();
        }

        public virtual async Task AddAsync(Module entity)
        {
            await _context.Set<Module>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(Module entity)
        {
            _context.Set<Module>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<Module>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Module>> GetByLevelIdAsync(Guid levelId)
        {
            return await _context.Set<Module>()
                .Where(m => m.LevelId == levelId)
                .OrderBy(m => m.OrderIndex)
                .ToListAsync();
        }
    }
}
