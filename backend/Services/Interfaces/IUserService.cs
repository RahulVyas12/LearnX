using myapp_backend.DTOs;

namespace myapp_backend.Services.Interfaces
{
    public interface IUserService
    {
        Task<AdminUserDto?> GetByIdAsync(Guid id);
        Task<AdminUserDto?> GetByEmailAsync(string email);
        Task<IEnumerable<AdminUserDto>> GetAllUsersWithStatsAsync();
        Task<int> CountAsync();
        Task<bool> UpdateUserAsync(Guid id, AdminUserUpdateDto dto);
        Task<bool> DeleteUserAsync(Guid id);
        Task<AdminUserDto> InviteUserAsync(InviteUserDto dto);
    }
}
