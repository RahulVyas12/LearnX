using myapp_backend.DTOs;

namespace myapp_backend.Services.Interfaces
{
    public interface ISkillPathService
    {
        Task<SkillPathDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<SkillPathDto>> GetAllAsync();
        Task<SkillPathDto> AddAsync(SkillPathDto dto);
        Task<bool> UpdateAsync(Guid id, SkillPathDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
