using myapp_backend.DTOs;

namespace myapp_backend.Services.Interfaces
{
    public interface IAnnouncementService
    {
        Task<AnnouncementDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<AnnouncementDto>> GetAllAsync();
        Task<AnnouncementDto> AddAsync(AnnouncementCreateDto dto, Guid userId);
        Task<bool> DeleteAsync(Guid id);
    }
}
