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
    public class SkillPathRepository : ISkillPathRepository
    {
        protected readonly AppDbContext _context;

        public SkillPathRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<SkillPath?> GetByIdAsync(Guid id)
        {
            return await _context.Set<SkillPath>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<SkillPath>> GetAllAsync()
        {
            return await _context.Set<SkillPath>().ToListAsync();
        }

        public virtual async Task AddAsync(SkillPath entity)
        {
            await _context.Set<SkillPath>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(SkillPath entity)
        {
            _context.Set<SkillPath>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<SkillPath>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }    }
}
