using AutoMapper;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class LevelService : ILevelService
    {
        private readonly ILevelRepository _repository;
        private readonly IMapper _mapper;

        public LevelService(ILevelRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<LevelDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _mapper.Map<LevelDto>(entity);
        }

        public async Task<IEnumerable<LevelDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<LevelDto>>(entities);
        }

        public async Task<LevelDto> AddAsync(LevelDto dto)
        {
            var entity = _mapper.Map<Level>(dto);
            if (entity.Id == Guid.Empty) entity.Id = Guid.NewGuid();

            await _repository.AddAsync(entity);
            return _mapper.Map<LevelDto>(entity);
        }

        public async Task<bool> UpdateAsync(Guid id, LevelDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);

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

        public async Task<IEnumerable<LevelDto>> GetBySkillPathIdAsync(Guid skillPathId)
        {
            var entities = await _repository.GetBySkillPathIdAsync(skillPathId);
            return _mapper.Map<IEnumerable<LevelDto>>(entities);
        }

        public async Task<IEnumerable<LevelDetailDto>> GetBySkillPathIdWithModulesAsync(Guid skillPathId)
        {
            var entities = await _repository.GetBySkillPathIdWithModulesAsync(skillPathId);
            return _mapper.Map<IEnumerable<LevelDetailDto>>(entities);
        }
    }
}
