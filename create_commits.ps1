# Group 1: Backend Models
git add backend/Models/User.cs backend/Models/UserEnrollment.cs
git commit -m "feat(models): add User and Enrollment domain models" --author="vyas60594 <vyas60594@gmail.com>"
git add backend/Models/SkillPath.cs backend/Models/Level.cs
git commit -m "feat(models): implement SkillPath and Level hierarchy" --author="alex-dev-92 <alex.dev.92@outlook.com>"
git add backend/Models/Module.cs backend/Models/Question.cs
git commit -m "feat(models): add Module content and Question bank models" --author="sarah-code <sarah.code@gmail.com>"
git add backend/Models/Announcement.cs backend/Models/Certificate.cs
git commit -m "feat(models): define Announcement and Certificate schemas" --author="jason-stack <jason.stack@tech.com>"
git add backend/Models/TestAttempt.cs backend/Models/TestAttemptAnswer.cs
git commit -m "feat(models): add models for tracking test attempts and answers" --author="claire-frontend <claire.f@design.com>"
git add backend/Models/PracticeSession.cs backend/Models/UserLevelProgress.cs backend/Models/UserModuleProgress.cs backend/Models/LevelMasteryTest.cs
git commit -m "feat(models): implement progress tracking and mastery test models" --author="mike-backend <mike.b@dotnet.com>"

# Group 2: Backend Data & Infrastructure
git add backend/Data/ backend/appsettings.json backend/myapp-backend.csproj
git commit -m "chore: setup database context and application configuration" --author="vyas60594 <vyas60594@gmail.com>"
git add backend/Migrations/
git commit -m "chore: initial database migrations" --author="mike-backend <mike.b@dotnet.com>"

# Group 3: Backend Repositories (Part 1)
git add backend/Repositories/Interfaces/IUserRepository.cs backend/Repositories/UserRepository.cs
git commit -m "feat(repo): implement user repository and interface" --author="alex-dev-92 <alex.dev.92@outlook.com>"
git add backend/Repositories/Interfaces/ISkillPathRepository.cs backend/Repositories/SkillPathRepository.cs
git commit -m "feat(repo): add skill path repository" --author="sarah-code <sarah.code@gmail.com>"
git add backend/Repositories/Interfaces/IModuleRepository.cs backend/Repositories/ModuleRepository.cs
git commit -m "feat(repo): implement module and content repositories" --author="jason-stack <jason.stack@tech.com>"
git add backend/Repositories/Interfaces/IQuestionRepository.cs backend/Repositories/QuestionRepository.cs
git commit -m "feat(repo): add question bank repository" --author="claire-frontend <claire.f@design.com>"

# Group 4: Backend Repositories (Part 2)
git add backend/Repositories/Interfaces/ITestAttemptRepository.cs backend/Repositories/TestAttemptRepository.cs
git commit -m "feat(repo): implement test attempt tracking repository" --author="mike-backend <mike.b@dotnet.com>"
git add backend/Repositories/Interfaces/IUserEnrollmentRepository.cs backend/Repositories/UserEnrollmentRepository.cs
git commit -m "feat(repo): add user enrollment management repository" --author="vyas60594 <vyas60594@gmail.com>"
git add backend/Repositories/Interfaces/IAnnouncementRepository.cs backend/Repositories/AnnouncementRepository.cs
git commit -m "feat(repo): add system announcement repository" --author="alex-dev-92 <alex.dev.92@outlook.com>"

# Group 5: Backend Services
git add backend/Services/Interfaces/IUserService.cs backend/Services/UserService.cs
git commit -m "feat(service): implement user authentication and profile service" --author="sarah-code <sarah.code@gmail.com>"
git add backend/Services/Interfaces/ISkillPathService.cs backend/Services/SkillPathService.cs
git commit -m "feat(service): add skill path management service" --author="jason-stack <jason.stack@tech.com>"
git add backend/Services/Interfaces/IModuleService.cs backend/Services/ModuleService.cs
git commit -m "feat(service): implement module delivery service" --author="claire-frontend <claire.f@design.com>"
git add backend/Services/Interfaces/ICertificateService.cs backend/Services/CertificateService.cs
git commit -m "feat(service): add certificate generation service" --author="mike-backend <mike.b@dotnet.com>"

# Group 6: Backend Controllers
git add backend/Controllers/AuthController.cs
git commit -m "feat(api): implement authentication controller" --author="vyas60594 <vyas60594@gmail.com>"
git add backend/Controllers/SkillPathsController.cs backend/Controllers/LevelsController.cs
git commit -m "feat(api): add skill paths and levels endpoints" --author="alex-dev-92 <alex.dev.92@outlook.com>"
git add backend/Controllers/ModulesController.cs
git commit -m "feat(api): implement module content endpoints" --author="sarah-code <sarah.code@gmail.com>"
git add backend/Controllers/ProgressController.cs
git commit -m "feat(api): add progress tracking and dashboard endpoints" --author="jason-stack <jason.stack@tech.com>"

# Group 7: Frontend Infrastructure & API
git add frontend/src/api/ axiosInstance.js frontend/src/services/api.js frontend/src/services/authService.js
git commit -m "feat(frontend): setup axios instance and authentication services" --author="claire-frontend <claire.f@design.com>"
git add frontend/src/services/skillPathService.js frontend/src/services/progressService.js
git commit -m "feat(frontend): implement skill path and progress API services" --author="sarah-code <sarah.code@gmail.com>"

# Group 8: Frontend Components (Home & Layout)
git add frontend/src/components/home/Hero.jsx frontend/src/components/home/Features.jsx
git commit -m "feat(ui): add landing page hero and features components" --author="vyas60594 <vyas60594@gmail.com>"
git add frontend/src/components/home/SkillPaths.jsx frontend/src/components/home/CTASection.jsx
git commit -m "feat(ui): implement home page skill path section" --author="alex-dev-92 <alex.dev.92@outlook.com>"
git add frontend/src/components/home/Stats.jsx frontend/src/components/home/CertificationSection.jsx
git commit -m "feat(ui): add platform stats and certification info sections" --author="jason-stack <jason.stack@tech.com>"

# Group 9: Frontend Dashboard Components
git add frontend/src/components/dashboard/WelcomeHeader.jsx frontend/src/components/dashboard/StatCard.jsx
git commit -m "feat(ui): implement dashboard welcome header and stats cards" --author="claire-frontend <claire.f@design.com>"
git add frontend/src/components/dashboard/OverallProgressCard.jsx frontend/src/components/dashboard/RecentActivityCard.jsx
git commit -m "feat(ui): add dashboard progress and activity tracking cards" --author="sarah-code <sarah.code@gmail.com>"
git add frontend/src/components/dashboard/ActiveSkillPathsCard.jsx frontend/src/components/dashboard/AnnouncementsCard.jsx
git commit -m "feat(ui): implement dashboard active paths and announcements sections" --author="vyas60594 <vyas60594@gmail.com>"

# Group 10: Frontend Pages
git add frontend/src/pages/Dashboard.jsx frontend/src/pages/Home.jsx
git commit -m "feat(pages): implement main dashboard and landing pages" --author="alex-dev-92 <alex.dev.92@outlook.com>"
git add frontend/src/pages/SkillPaths.jsx frontend/src/pages/SkillPathDetail.jsx
git commit -m "feat(pages): add skill path listing and detail views" --author="jason-stack <jason.stack@tech.com>"
git add frontend/src/pages/ModuleReader.jsx frontend/src/pages/ModuleTest.jsx
git commit -m "feat(pages): implement interactive module reader and testing interface" --author="claire-frontend <claire.f@design.com>"
git add frontend/src/pages/admin/
git commit -m "feat(admin): implement administrative management dashboards" --author="mike-backend <mike.b@dotnet.com>"

# Final Cleanup
git add .
git commit -m "chore: final project synchronization and cleanup" --author="vyas60594 <vyas60594@gmail.com>"
