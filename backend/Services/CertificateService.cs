using AutoMapper;
using Microsoft.EntityFrameworkCore;
using myapp_backend.Data;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CertificateService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CertificateDto>> GetByUserAsync(Guid userId)
        {
            var entities = await _context.Certificates
                .Where(c => c.UserId == userId)
                .Include(c => c.SkillPath)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CertificateDto>>(entities);
        }

        public async Task<IEnumerable<CertificateDto>> GetAllCertificatesAsync()
        {
            var entities = await _context.Certificates
                .Include(c => c.User)
                .Include(c => c.SkillPath)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CertificateDto>>(entities);
        }

        public async Task<CertificateDto?> ClaimCertificateAsync(Guid userId, Guid skillPathId)
        {
            var existing = await _context.Certificates
                .Include(c => c.SkillPath)
                .FirstOrDefaultAsync(c => c.UserId == userId && c.SkillPathId == skillPathId);

            if (existing != null)
                return _mapper.Map<CertificateDto>(existing);

            var path = await _context.SkillPaths.FindAsync(skillPathId);
            if (path == null) return null;

            // Simple verification: in a production app, verify all levels are completed
            var cert = new Certificate
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                SkillPathId = skillPathId,
                CertificateNumber = "LX-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                IssuedAt = DateTime.UtcNow
            };

            await _context.Certificates.AddAsync(cert);
            await _context.SaveChangesAsync();

            // Load navigation property for mapping
            cert.SkillPath = path;

            return _mapper.Map<CertificateDto>(cert);
        }
    }
}
