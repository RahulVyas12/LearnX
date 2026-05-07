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
    public class AnnouncementRepository : IAnnouncementRepository
    {
        protected readonly AppDbContext _context;

        public AnnouncementRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<Announcement?> GetByIdAsync(Guid id)
        {
            return await _context.Set<Announcement>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<Announcement>> GetAllAsync()
        {
            return await _context.Set<Announcement>().ToListAsync();
        }

        public virtual async Task AddAsync(Announcement entity)
        {
            await _context.Set<Announcement>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(Announcement entity)
        {
            _context.Set<Announcement>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<Announcement>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }    }
}
