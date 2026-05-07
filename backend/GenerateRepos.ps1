$entities = @(
    "User", "SkillPath", "Level", "Module", "Question",
    "UserEnrollment", "UserLevelProgress", "UserModuleProgress",
    "TestAttempt", "TestAttemptAnswer", "PracticeSession",
    "Certificate", "Announcement"
)

$repoIntDir = "a:\Projects\Asp.net core\LearnX\backend\Repositories\Interfaces"
$repoImplDir = "a:\Projects\Asp.net core\LearnX\backend\Repositories"
$svcIntDir = "a:\Projects\Asp.net core\LearnX\backend\Services\Interfaces"
$svcImplDir = "a:\Projects\Asp.net core\LearnX\backend\Services"

New-Item -ItemType Directory -Force -Path $repoIntDir
New-Item -ItemType Directory -Force -Path $repoImplDir
New-Item -ItemType Directory -Force -Path $svcIntDir
New-Item -ItemType Directory -Force -Path $svcImplDir

foreach ($entity in $entities) {
    # Generate Repository Interface
    $repoIntPath = "$repoIntDir\I$($entity)Repository.cs"
    $repoIntContent = @"
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Repositories.Interfaces
{
    public interface I$($entity)Repository
    {
        Task<${entity}?> GetByIdAsync(Guid id);
        Task<IEnumerable<$entity>> GetAllAsync();
        Task AddAsync($entity entity);
        Task UpdateAsync($entity entity);
        Task DeleteAsync(Guid id);
"@
    # Add special methods
    if ($entity -eq "User") {
        $repoIntContent += "`n        Task<User?> GetByEmailAsync(string email);"
    } elseif ($entity -eq "UserLevelProgress") {
        $repoIntContent += "`n        Task<UserLevelProgress?> GetByUserAndLevelAsync(Guid userId, Guid levelId);"
        $repoIntContent += "`n        Task<IEnumerable<UserLevelProgress>> GetUnlockedLevelsForUserAsync(Guid userId);"
    } elseif ($entity -eq "TestAttempt") {
        $repoIntContent += "`n        Task<IEnumerable<TestAttempt>> GetAttemptsByUserAndLevelAsync(Guid userId, Guid levelId);"
        $repoIntContent += "`n        Task<TestAttempt?> GetLatestAttemptAsync(Guid userId, Guid levelId);"
    } elseif ($entity -eq "Certificate") {
        $repoIntContent += "`n        Task<IEnumerable<Certificate>> GetByUserAsync(Guid userId);"
        $repoIntContent += "`n        Task<bool> ExistsForUserAndPathAsync(Guid userId, Guid skillPathId);"
    } elseif ($entity -eq "UserEnrollment") {
        $repoIntContent += "`n        Task<IEnumerable<UserEnrollment>> GetByUserAsync(Guid userId);"
        $repoIntContent += "`n        Task<bool> IsEnrolledAsync(Guid userId, Guid skillPathId);"
    }
    
    $repoIntContent += @"
    }
}
"@
    Set-Content -Path $repoIntPath -Value $repoIntContent

    # Generate Repository Implementation
    $repoImplPath = "$repoImplDir\$($entity)Repository.cs"
    $pluralEntity = ""
    if ($entity.EndsWith("s")) {
        $pluralEntity = $entity + "es"
    } elseif ($entity -eq "Question") {
        $pluralEntity = "Questions"
    } else {
        $pluralEntity = $entity + "s"
    }

    $repoImplContent = @"
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
    public class $($entity)Repository : I$($entity)Repository
    {
        protected readonly AppDbContext _context;

        public $($entity)Repository(AppDbContext context)
        {
            _context = context;
        }

        public virtual async Task<${entity}?> GetByIdAsync(Guid id)
        {
            return await _context.Set<$entity>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<$entity>> GetAllAsync()
        {
            return await _context.Set<$entity>().ToListAsync();
        }

        public virtual async Task AddAsync($entity entity)
        {
            await _context.Set<$entity>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync($entity entity)
        {
            _context.Set<$entity>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<$entity>().Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
"@
    # Generate implementation for special methods
    if ($entity -eq "User") {
        $repoImplContent += @"

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
"@
    } elseif ($entity -eq "UserLevelProgress") {
        $repoImplContent += @"

        public async Task<UserLevelProgress?> GetByUserAndLevelAsync(Guid userId, Guid levelId)
        {
            return await _context.UserLevelProgresses.FirstOrDefaultAsync(p => p.UserId == userId && p.LevelId == levelId);
        }

        public async Task<IEnumerable<UserLevelProgress>> GetUnlockedLevelsForUserAsync(Guid userId)
        {
            return await _context.UserLevelProgresses.Where(p => p.UserId == userId && p.IsUnlocked).ToListAsync();
        }
"@
    } elseif ($entity -eq "TestAttempt") {
        $repoImplContent += @"

        public async Task<IEnumerable<TestAttempt>> GetAttemptsByUserAndLevelAsync(Guid userId, Guid levelId)
        {
            return await _context.TestAttempts.Where(t => t.UserId == userId && t.LevelId == levelId).ToListAsync();
        }

        public async Task<TestAttempt?> GetLatestAttemptAsync(Guid userId, Guid levelId)
        {
            return await _context.TestAttempts.Where(t => t.UserId == userId && t.LevelId == levelId).OrderByDescending(t => t.AttemptedAt).FirstOrDefaultAsync();
        }
"@
    } elseif ($entity -eq "Certificate") {
        $repoImplContent += @"

        public async Task<IEnumerable<Certificate>> GetByUserAsync(Guid userId)
        {
            return await _context.Certificates.Where(c => c.UserId == userId).ToListAsync();
        }

        public async Task<bool> ExistsForUserAndPathAsync(Guid userId, Guid skillPathId)
        {
            return await _context.Certificates.AnyAsync(c => c.UserId == userId && c.SkillPathId == skillPathId);
        }
"@
    } elseif ($entity -eq "UserEnrollment") {
        $repoImplContent += @"

        public async Task<IEnumerable<UserEnrollment>> GetByUserAsync(Guid userId)
        {
            return await _context.UserEnrollments.Where(e => e.UserId == userId).ToListAsync();
        }

        public async Task<bool> IsEnrolledAsync(Guid userId, Guid skillPathId)
        {
            return await _context.UserEnrollments.AnyAsync(e => e.UserId == userId && e.SkillPathId == skillPathId && e.Status == "active");
        }
"@
    }

    $repoImplContent += @"
    }
}
"@
    Set-Content -Path $repoImplPath -Value $repoImplContent

    # Generate Service Interface
    $svcIntPath = "$svcIntDir\I$($entity)Service.cs"
    $svcIntContent = @"
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;

namespace myapp_backend.Services.Interfaces
{
    public interface I$($entity)Service
    {
        Task<${entity}?> GetByIdAsync(Guid id);
        Task<IEnumerable<$entity>> GetAllAsync();
        Task AddAsync($entity entity);
        Task UpdateAsync($entity entity);
        Task DeleteAsync(Guid id);
    }
}
"@
    Set-Content -Path $svcIntPath -Value $svcIntContent

    # Generate Service Implementation
    $svcImplPath = "$svcImplDir\$($entity)Service.cs"
    $svcImplContent = @"
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using myapp_backend.Models;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Services.Interfaces;

namespace myapp_backend.Services
{
    public class $($entity)Service : I$($entity)Service
    {
        private readonly I$($entity)Repository _repository;

        public $($entity)Service(I$($entity)Repository repository)
        {
            _repository = repository;
        }

        public async Task<${entity}?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<$entity>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddAsync($entity entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync($entity entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
"@
    Set-Content -Path $svcImplPath -Value $svcImplContent
}
