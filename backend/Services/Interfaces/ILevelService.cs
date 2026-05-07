using myapp_backend.DTOs;

namespace myapp_backend.Services.Interfaces
{
    public interface ILevelService
    {
        Task<LevelDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<LevelDto>> GetAllAsync();
        Task<LevelDto> AddAsync(LevelDto dto);
        Task<bool> UpdateAsync(Guid id, LevelDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<LevelDto>> GetBySkillPathIdAsync(Guid skillPathId);
        Task<IEnumerable<LevelDetailDto>> GetBySkillPathIdWithModulesAsync(Guid skillPathId);
    }
}
