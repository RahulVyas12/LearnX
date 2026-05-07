using AutoMapper;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class SkillPathService : ISkillPathService
    {
        private readonly ISkillPathRepository _repository;
        private readonly IMapper _mapper;

        public SkillPathService(ISkillPathRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<SkillPathDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _mapper.Map<SkillPathDto>(entity);
        }

        public async Task<IEnumerable<SkillPathDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<SkillPathDto>>(entities);
        }

        public async Task<SkillPathDto> AddAsync(SkillPathDto dto)
        {
            var entity = _mapper.Map<SkillPath>(dto);
            if (entity.Id == Guid.Empty) entity.Id = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            return _mapper.Map<SkillPathDto>(entity);
        }

        public async Task<bool> UpdateAsync(Guid id, SkillPathDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(entity);
            return true;
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
