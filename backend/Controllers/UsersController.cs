using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myapp_backend.DTOs;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllUsersWithStatsAsync();
            return Ok(users);
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UserRoleUpdateDto dto)
        {
            var success = await _userService.UpdateUserAsync(id, new AdminUserUpdateDto { Role = dto.Role });
            if (!success) return NotFound();

            return Ok(new { message = "User role updated successfully." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] AdminUserUpdateDto dto)
        {
            var success = await _userService.UpdateUserAsync(id, dto);
            if (!success) return NotFound();

            return Ok(new { message = "User updated successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var success = await _userService.DeleteUserAsync(id);
            if (!success) return NotFound();

            return Ok(new { message = "User deleted successfully." });
        }
    }
}
