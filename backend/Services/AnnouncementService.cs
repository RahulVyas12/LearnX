using AutoMapper;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly IAnnouncementRepository _repository;
        private readonly IMapper _mapper;

        public AnnouncementService(IAnnouncementRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<AnnouncementDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _mapper.Map<AnnouncementDto>(entity);
        }

        public async Task<IEnumerable<AnnouncementDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<AnnouncementDto>>(entities);
        }

        public async Task<AnnouncementDto> AddAsync(AnnouncementCreateDto dto, Guid userId)
        {
            var entity = new Announcement
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Content = dto.Content,
                Category = dto.Category,
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(entity);
            return _mapper.Map<AnnouncementDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            await _repository.DeleteAsync(id);
            return true;
        }
    }
}
