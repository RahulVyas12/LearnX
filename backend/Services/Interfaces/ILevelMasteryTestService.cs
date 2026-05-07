using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface ILevelMasteryTestService
    {
        Task<LevelMasteryTest?> GetByIdAsync(Guid id);
        Task<LevelMasteryTest?> GetByLevelIdAsync(Guid levelId);
        Task<IEnumerable<LevelMasteryTest>> GetAllAsync();
        Task<LevelMasteryTest> AddAsync(LevelMasteryTest masteryTest);
        Task<LevelMasteryTest> UpdateAsync(LevelMasteryTest masteryTest);
        Task DeleteAsync(Guid id);
    }
}
