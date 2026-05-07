namespace myapp_backend.Services
{
    using myapp_backend.Services.Interfaces;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using System;
    using System.IO;
    using System.Threading.Tasks;

    public class UploadService : IUploadService
    {
        private readonly IWebHostEnvironment _environment;

        public UploadService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string?> UploadFileAsync(IFormFile file, string subDirectory, string? prefix = null)
        {
            if (file == null || file.Length == 0) return null;

            var webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsDir = Path.Combine(webRootPath, "uploads", subDirectory);
            
            if (!Directory.Exists(uploadsDir))
            {
                Directory.CreateDirectory(uploadsDir);
            }

            var fileName = $"{(prefix != null ? prefix + "_" : "")}{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{subDirectory}/{fileName}".Replace("\\", "/");
        }

        public bool DeleteFile(string fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl)) return false;

            var webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var filePath = Path.Combine(webRootPath, fileUrl.TrimStart('/').Replace("/", "\\"));

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }

            return false;
        }
    }
}
