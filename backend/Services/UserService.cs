using AutoMapper;
using Microsoft.EntityFrameworkCore;
using myapp_backend.Data;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Services.Interfaces;
using BCrypt.Net;

namespace myapp_backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UserService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AdminUserDto?> GetByIdAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            return _mapper.Map<AdminUserDto>(user);
        }

        public async Task<AdminUserDto?> GetByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return _mapper.Map<AdminUserDto>(user);
        }

        public async Task<IEnumerable<AdminUserDto>> GetAllUsersWithStatsAsync()
        {
            var users = await _context.Users
                .Select(u => new AdminUserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    JoinedDate = u.CreatedAt,
                    EnrollmentCount = _context.UserEnrollments.Count(e => e.UserId == u.Id),
                    CompletedModules = _context.UserModuleProgresses.Count(p => p.UserId == u.Id && p.IsRead)
                })
                .ToListAsync();

            return users;
        }

        public async Task<int> CountAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<bool> UpdateUserAsync(Guid id, AdminUserUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            if (dto.Name != null) user.Name = dto.Name;
            if (dto.Email != null) user.Email = dto.Email;
            if (dto.Role != null) user.Role = dto.Role;
            if (dto.Department != null) user.Department = dto.Department;
            if (dto.AvatarUrl != null) user.AvatarUrl = dto.AvatarUrl;
            
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<AdminUserDto> InviteUserAsync(InviteUserDto dto)
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Email = dto.Email,
                Role = dto.Role ?? "student",
                Department = dto.Department,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<AdminUserDto>(user);
        }
    }
}
