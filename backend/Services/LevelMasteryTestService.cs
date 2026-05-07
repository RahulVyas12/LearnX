using AutoMapper;
using Microsoft.EntityFrameworkCore;
using myapp_backend.Data;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class LevelMasteryTestService : ILevelMasteryTestService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public LevelMasteryTestService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<LevelMasteryTestDto?> GetByIdAsync(Guid id)
        {
            var entity = await _context.LevelMasteryTests
                .Include(t => t.Questions)
                .FirstOrDefaultAsync(t => t.Id == id);
            return _mapper.Map<LevelMasteryTestDto>(entity);
        }

        public async Task<LevelMasteryTestDto?> GetByLevelIdAsync(Guid levelId)
        {
            var entity = await _context.LevelMasteryTests
                .Include(t => t.Questions)
                .FirstOrDefaultAsync(t => t.LevelId == levelId);
            return _mapper.Map<LevelMasteryTestDto>(entity);
        }

        public async Task<LevelMasteryTestDto> AddAsync(CreateLevelMasteryTestDto dto)
        {
            var entity = _mapper.Map<LevelMasteryTest>(dto);
            entity.Id = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.LevelMasteryTests.AddAsync(entity);
            await _context.SaveChangesAsync();

            return _mapper.Map<LevelMasteryTestDto>(entity);
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateLevelMasteryTestDto dto)
        {
            var entity = await _context.LevelMasteryTests.FindAsync(id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.LevelMasteryTests.FindAsync(id);
            if (entity == null) return false;

            _context.LevelMasteryTests.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
