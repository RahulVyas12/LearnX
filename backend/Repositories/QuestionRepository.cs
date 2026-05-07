using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using myapp_backend.Data;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;

namespace myapp_backend.Repositories
{
    public class QuestionRepository : IQuestionRepository
    {
        protected readonly AppDbContext _context;

        public QuestionRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<Question?> GetByIdAsync(Guid id)
        {
            return await _context.Set<Question>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<Question>> GetAllAsync()
        {
            return await _context.Set<Question>().ToListAsync();
        }

        public virtual async Task AddAsync(Question entity)
        {
            await _context.Set<Question>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(Question entity)
        {
            _context.Set<Question>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<Question>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Question>> GetByModuleIdAsync(Guid moduleId)
        {
            return await _context.Set<Question>()
                .Where(q => q.ModuleId == moduleId && q.Scope == "module")
                .ToListAsync();
        }

        public async Task<IEnumerable<Question>> GetMasteryByLevelIdAsync(Guid levelId)
        {
            return await _context.Set<Question>()
                .Where(q => q.LevelId == levelId && q.Scope == "mastery")
                .ToListAsync();
        }

        public async Task<IEnumerable<Question>> GetPracticeBySkillPathIdAsync(Guid skillPathId, int count = 10)
        {
            // Get all questions from levels belonging to this skill path
            var levelIds = await _context.Set<Level>()
                .Where(l => l.SkillPathId == skillPathId)
                .Select(l => l.Id)
                .ToListAsync();

            return await _context.Set<Question>()
                .Where(q => q.LevelId.HasValue && levelIds.Contains(q.LevelId.Value))
                .OrderBy(q => Guid.NewGuid()) // Random ordering
                .Take(count)
                .ToListAsync();
        }
    }
}
