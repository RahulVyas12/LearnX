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
    public class UserLevelProgressRepository : IUserLevelProgressRepository
    {
        protected readonly AppDbContext _context;

        public UserLevelProgressRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<UserLevelProgress?> GetByIdAsync(Guid id)
        {
            return await _context.Set<UserLevelProgress>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<UserLevelProgress>> GetAllAsync()
        {
            return await _context.Set<UserLevelProgress>().ToListAsync();
        }

        public virtual async Task AddAsync(UserLevelProgress entity)
        {
            await _context.Set<UserLevelProgress>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(UserLevelProgress entity)
        {
            _context.Set<UserLevelProgress>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<UserLevelProgress>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<UserLevelProgress?> GetByUserAndLevelAsync(Guid userId, Guid levelId)
        {
            return await _context.UserLevelProgresses.FirstOrDefaultAsync(p => p.UserId == userId && p.LevelId == levelId);
        }

        public async Task<IEnumerable<UserLevelProgress>> GetUnlockedLevelsForUserAsync(Guid userId)
        {
            return await _context.UserLevelProgresses.Where(p => p.UserId == userId && p.IsUnlocked).ToListAsync();
        }    }
}
