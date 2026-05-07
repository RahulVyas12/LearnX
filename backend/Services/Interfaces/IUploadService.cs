namespace myapp_backend.Services.Interfaces
{
    public interface IUploadService
    {
        Task<string?> UploadFileAsync(IFormFile file, string subDirectory, string? prefix = null);
        bool DeleteFile(string fileUrl);
    }
}
