using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
