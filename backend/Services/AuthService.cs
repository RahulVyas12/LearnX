using AutoMapper;
using BCrypt.Net;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;

        public AuthService(
            IUserRepository userRepository, 
            ITokenService tokenService, 
            IMapper mapper, 
            IWebHostEnvironment env)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _mapper = mapper;
            _env = env;
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null) return null;

            var user = _mapper.Map<User>(dto);
            user.Id = Guid.NewGuid();
            user.Role = "student";
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.AddAsync(user);

            var response = _mapper.Map<AuthResponseDto>(user);
            response.Token = _tokenService.GenerateToken(user);
            return response;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return null;

            var response = _mapper.Map<AuthResponseDto>(user);
            response.Token = _tokenService.GenerateToken(user);
            return response;
        }

        public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return null;

            return _mapper.Map<UserProfileDto>(user);
        }

        public async Task<bool> UpdateProfileAsync(Guid userId, ProfileUpdateDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            _mapper.Map(dto, user);
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<string?> UploadAvatarAsync(Guid userId, IFormFile file)
        {
            if (file == null || file.Length == 0) return null;

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return null;

            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads", "avatars");
            if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var avatarUrl = $"/uploads/avatars/{fileName}";
            user.AvatarUrl = avatarUrl;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            return avatarUrl;
        }
    }
}
