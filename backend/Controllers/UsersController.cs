using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserEnrollmentService _enrollmentService;
        private readonly IUserModuleProgressService _moduleProgressService;

        public UsersController(
            IUserService userService,
            IUserEnrollmentService enrollmentService,
            IUserModuleProgressService moduleProgressService)
        {
            _userService = userService;
            _enrollmentService = enrollmentService;
            _moduleProgressService = moduleProgressService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            var result = new List<AdminUserDto>();

            foreach (var user in users)
            {
                var enrollments = await _enrollmentService.GetByUserAsync(user.Id);
                var moduleProgress = await _moduleProgressService.GetAllAsync();
                var userModuleProgress = moduleProgress.Where(p => p.UserId == user.Id).ToList();

                result.Add(new AdminUserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    JoinedDate = user.CreatedAt,
                    EnrollmentCount = enrollments.Count(),
                    CompletedModules = userModuleProgress.Count(p => p.IsRead)
                });
            }

            return Ok(result);
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UserRoleUpdateDto dto)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound();

            user.Role = dto.Role;
            await _userService.UpdateAsync(user);

            return Ok(new { message = "User role updated successfully." });
        }
    }
}
