using myapp_backend.DTOs;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<UserProfileDto?> GetProfileAsync(Guid userId);
        Task<bool> UpdateProfileAsync(Guid userId, ProfileUpdateDto dto);
        Task<string?> UploadAvatarAsync(Guid userId, IFormFile file);
    }
}
