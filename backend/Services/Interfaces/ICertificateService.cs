using myapp_backend.DTOs;

namespace myapp_backend.Services.Interfaces
{
    public interface ICertificateService
    {
        Task<IEnumerable<CertificateDto>> GetByUserAsync(Guid userId);
        Task<IEnumerable<CertificateDto>> GetAllCertificatesAsync();
        Task<CertificateDto?> ClaimCertificateAsync(Guid userId, Guid skillPathId);
    }
}
