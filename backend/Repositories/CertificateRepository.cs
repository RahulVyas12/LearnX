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
    public class CertificateRepository : ICertificateRepository
    {
        protected readonly AppDbContext _context;

        public CertificateRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<Certificate?> GetByIdAsync(Guid id)
        {
            return await _context.Set<Certificate>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<Certificate>> GetAllAsync()
        {
            return await _context.Set<Certificate>().ToListAsync();
        }

        public virtual async Task AddAsync(Certificate entity)
        {
            await _context.Set<Certificate>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(Certificate entity)
        {
            _context.Set<Certificate>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<Certificate>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Certificate>> GetByUserAsync(Guid userId)
        {
            return await _context.Certificates.Where(c => c.UserId == userId).ToListAsync();
        }

        public async Task<bool> ExistsForUserAndPathAsync(Guid userId, Guid skillPathId)
        {
            return await _context.Certificates.AnyAsync(c => c.UserId == userId && c.SkillPathId == skillPathId);
        }    }
}
