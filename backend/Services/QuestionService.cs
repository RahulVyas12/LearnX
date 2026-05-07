using AutoMapper;
using myapp_backend.DTOs;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _repository;
        private readonly IMapper _mapper;

        public QuestionService(IQuestionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<QuestionDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _mapper.Map<QuestionDto>(entity);
        }

        public async Task<IEnumerable<QuestionDto>> GetByModuleIdAsync(Guid moduleId)
        {
            var entities = await _repository.GetByModuleIdAsync(moduleId);
            return _mapper.Map<IEnumerable<QuestionDto>>(entities);
        }

        public async Task<IEnumerable<QuestionDto>> GetMasteryByLevelIdAsync(Guid levelId)
        {
            var entities = await _repository.GetMasteryByLevelIdAsync(levelId);
            return _mapper.Map<IEnumerable<QuestionDto>>(entities);
        }

        public async Task<IEnumerable<QuestionDto>> GetPracticeBySkillPathIdAsync(Guid skillPathId, int count)
        {
            var entities = await _repository.GetPracticeBySkillPathIdAsync(skillPathId, count);
            return _mapper.Map<IEnumerable<QuestionDto>>(entities);
        }

        public async Task<QuestionDto> AddAsync(CreateQuestionDto dto)
        {
            var entity = _mapper.Map<Question>(dto);
            if (entity.Id == Guid.Empty) entity.Id = Guid.NewGuid();
            
            await _repository.AddAsync(entity);
            return _mapper.Map<QuestionDto>(entity);
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateQuestionDto dto)
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
    }
}
