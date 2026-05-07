using myapp_backend.DTOs;

namespace myapp_backend.Services.Interfaces
{
    public interface IProgressService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync(Guid userId);
        Task<IEnumerable<EnrolledPathDto>> GetEnrolledPathsAsync(Guid userId);
        Task<PathProgressDto?> GetPathProgressAsync(Guid userId, Guid skillPathId);
        Task<bool> MarkModuleReadAsync(Guid userId, Guid moduleId);
        Task<TestResultDto?> SubmitTestAsync(Guid userId, TestSubmitDto dto);
        Task<IEnumerable<LevelUnlockStatusDto>> GetLevelUnlockStatusAsync(Guid userId, Guid skillPathId);
        Task<AdminDashboardStatsDto> GetAdminStatsAsync();
        Task<bool> EnrollAsync(Guid userId, Guid skillPathId);
        Task<bool> UnenrollAsync(Guid userId, Guid skillPathId);
    }
}
