using AutoMapper;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class ModuleService : IModuleService
    {
        private readonly IModuleRepository _repository;
        private readonly IMapper _mapper;

        public ModuleService(IModuleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ModuleDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _mapper.Map<ModuleDto>(entity);
        }

        public async Task<ModuleDetailDto?> GetDetailByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _mapper.Map<ModuleDetailDto>(entity);
        }

        public async Task<IEnumerable<ModuleDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ModuleDto>>(entities);
        }

        public async Task<ModuleDto> AddAsync(ModuleDto dto)
        {
            var entity = _mapper.Map<Module>(dto);
            if (entity.Id == Guid.Empty) entity.Id = Guid.NewGuid();

            await _repository.AddAsync(entity);
            return _mapper.Map<ModuleDto>(entity);
        }

        public async Task<bool> UpdateAsync(Guid id, ModuleDto dto)
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

        public async Task<IEnumerable<ModuleDto>> GetByLevelIdAsync(Guid levelId)
        {
            var entities = await _repository.GetByLevelIdAsync(levelId);
            return _mapper.Map<IEnumerable<ModuleDto>>(entities);
        }
    }
}
