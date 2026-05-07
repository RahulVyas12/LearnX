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
    public class UserModuleProgressRepository : IUserModuleProgressRepository
    {
        protected readonly AppDbContext _context;

        public UserModuleProgressRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<UserModuleProgress?> GetByIdAsync(Guid id)
        {
            return await _context.Set<UserModuleProgress>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<UserModuleProgress>> GetAllAsync()
        {
            return await _context.Set<UserModuleProgress>().ToListAsync();
        }

        public virtual async Task AddAsync(UserModuleProgress entity)
        {
            await _context.Set<UserModuleProgress>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(UserModuleProgress entity)
        {
            _context.Set<UserModuleProgress>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<UserModuleProgress>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<UserModuleProgress?> GetByUserAndModuleAsync(Guid userId, Guid moduleId)
        {
            return await _context.Set<UserModuleProgress>()
                .FirstOrDefaultAsync(p => p.UserId == userId && p.ModuleId == moduleId);
        }

        public async Task<IEnumerable<UserModuleProgress>> GetByUserAndLevelAsync(Guid userId, Guid levelId)
        {
            var moduleIds = await _context.Set<Module>()
                .Where(m => m.LevelId == levelId)
                .Select(m => m.Id)
                .ToListAsync();

            return await _context.Set<UserModuleProgress>()
                .Where(p => p.UserId == userId && moduleIds.Contains(p.ModuleId))
                .ToListAsync();
        }
    }
}
