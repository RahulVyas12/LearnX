using myapp_backend.DTOs;

namespace myapp_backend.Services.Interfaces
{
    public interface ILevelMasteryTestService
    {
        Task<LevelMasteryTestDto?> GetByIdAsync(Guid id);
        Task<LevelMasteryTestDto?> GetByLevelIdAsync(Guid levelId);
        Task<LevelMasteryTestDto> AddAsync(CreateLevelMasteryTestDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateLevelMasteryTestDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
