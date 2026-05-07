using Microsoft.EntityFrameworkCore;
using myapp_backend.Data;
using myapp_backend.Models;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class LevelMasteryTestService : ILevelMasteryTestService
    {
        private readonly AppDbContext _context;

        public LevelMasteryTestService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<LevelMasteryTest?> GetByIdAsync(Guid id)
        {
            return await _context.LevelMasteryTests
                .Include(lmt => lmt.Questions)
                .FirstOrDefaultAsync(lmt => lmt.Id == id);
        }

        public async Task<LevelMasteryTest?> GetByLevelIdAsync(Guid levelId)
        {
            return await _context.LevelMasteryTests
                .Include(lmt => lmt.Questions)
                .FirstOrDefaultAsync(lmt => lmt.LevelId == levelId);
        }

        public async Task<IEnumerable<LevelMasteryTest>> GetAllAsync()
        {
            return await _context.LevelMasteryTests
                .Include(lmt => lmt.Questions)
                .ToListAsync();
        }

        public async Task<LevelMasteryTest> AddAsync(LevelMasteryTest masteryTest)
        {
            await _context.LevelMasteryTests.AddAsync(masteryTest);
            await _context.SaveChangesAsync();
            return masteryTest;
        }

        public async Task<LevelMasteryTest> UpdateAsync(LevelMasteryTest masteryTest)
        {
            _context.LevelMasteryTests.Update(masteryTest);
            await _context.SaveChangesAsync();
            return masteryTest;
        }

        public async Task DeleteAsync(Guid id)
        {
            var masteryTest = await GetByIdAsync(id);
            if (masteryTest != null)
            {
                _context.LevelMasteryTests.Remove(masteryTest);
                await _context.SaveChangesAsync();
            }
        }
    }
}
