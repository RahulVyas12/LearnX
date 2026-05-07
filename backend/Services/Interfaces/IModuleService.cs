using myapp_backend.DTOs;

namespace myapp_backend.Services.Interfaces
{
    public interface IModuleService
    {
        Task<ModuleDto?> GetByIdAsync(Guid id);
        Task<ModuleDetailDto?> GetDetailByIdAsync(Guid id);
        Task<IEnumerable<ModuleDto>> GetAllAsync();
        Task<ModuleDto> AddAsync(ModuleDto dto);
        Task<bool> UpdateAsync(Guid id, ModuleDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<ModuleDto>> GetByLevelIdAsync(Guid levelId);
    }
}
