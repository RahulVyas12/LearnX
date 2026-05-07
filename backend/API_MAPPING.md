# API Mapping: Frontend Expectations vs Current Implementation

## Authentication Endpoints

### Frontend Expectation (Node.js)
- `POST /api/auth/login` → `{ user: { id, username, email, role }, token }`
- `POST /api/auth/register` → `{ user: { id, username, email }, token }`
- `GET /api/auth/me` → `{ id, username, email, role }`

### Current ASP.NET Implementation
- `POST /api/auth/login` ✅ (exists, but response format needs verification)
- `POST /api/auth/register` ✅ (exists, but response format needs verification)
- `GET /api/auth/me` ✅ (exists, but response format needs verification)

**Action Needed**: Verify and fix response formats to match frontend expectations

## Skill Paths Endpoints

### Frontend Expectation
- `GET /api/skillpaths` → List of published skill paths
- `GET /api/skillpaths/{id}` → Single skill path details
- `GET /api/skillpaths/admin/all` → All skill paths (admin only)
- `POST /api/skillpaths` → Create skill path (admin)
- `PUT /api/skillpaths/{id}` → Update skill path (admin)
- `DELETE /api/skillpaths/{id}` → Delete skill path (admin)

### Current ASP.NET Implementation
- `GET /api/skillpaths` ✅ (exists)
- `GET /api/skillpaths/{id}` ✅ (exists)
- `GET /api/skillpaths/admin/all` ✅ (exists)
- `POST /api/skillpaths` ✅ (exists)
- `PUT /api/skillpaths/{id}` ✅ (exists)
- `DELETE /api/skillpaths/{id}` ✅ (exists)

**Status**: ✅ Complete

## Levels Endpoints

### Frontend Expectation
- `GET /api/levels/{skillPathId}` → Get levels for skill path
- `POST /api/levels` → Create level (admin)
- `PUT /api/levels/{id}` → Update level (admin)
- `DELETE /api/levels/{id}` → Delete level (admin)

### Current ASP.NET Implementation
- `GET /api/levels/{skillPathId}` ✅ (exists)
- `POST /api/levels` ✅ (exists)
- `PUT /api/levels/{id}` ✅ (exists)
- `DELETE /api/levels/{id}` ✅ (exists)

**Status**: ✅ Complete

## Modules Endpoints

### Frontend Expectation
- `GET /api/modules/{levelId}` → Get modules for level
- `GET /api/modules/detail/{moduleId}` → Get module details with content
- `POST /api/modules` → Create module (admin)
- `PUT /api/modules/{id}` → Update module (admin)
- `DELETE /api/modules/{id}` → Delete module (admin)

### Current ASP.NET Implementation
- `GET /api/modules/{levelId}` ✅ (exists)
- `GET /api/modules/detail/{moduleId}` ✅ (exists)
- `POST /api/modules` ✅ (exists)
- `PUT /api/modules/{id}` ✅ (exists)
- `DELETE /api/modules/{id}` ✅ (exists)

**Status**: ✅ Complete

## Questions Endpoints

### Frontend Expectation
- `GET /api/questions/module/{moduleId}` → Get questions for module
- `GET /api/questions/mastery/{levelId}` → Get mastery test questions
- `GET /api/questions/practice/{skillPathId}` → Get practice questions
- `POST /api/questions` → Create question (admin)
- `PUT /api/questions/{id}` → Update question (admin)
- `DELETE /api/questions/{id}` → Delete question (admin)

### Current ASP.NET Implementation
- `GET /api/questions/module/{moduleId}` ✅ (exists)
- `GET /api/questions/mastery/{levelId}` ✅ (exists)
- `GET /api/questions/practice/{skillPathId}` ❌ (missing)
- `POST /api/questions` ✅ (exists)
- `PUT /api/questions/{id}` ✅ (exists)
- `DELETE /api/questions/{id}` ✅ (exists)

**Action Needed**: Add practice questions endpoint

## Progress Endpoints

### Frontend Expectation
- `GET /api/progress/dashboard` → User dashboard stats
- `GET /api/progress/enrolled` → User's enrolled skill paths
- `GET /api/progress/path/{pathId}` → Progress for specific path
- `GET /api/progress/levels/{pathId}` → Level status for path
- `POST /api/progress/module/{moduleId}/read` → Mark module as read
- `POST /api/progress/test/submit` → Submit test results
- `POST /api/progress/enroll/{pathId}` → Enroll in skill path
- `DELETE /api/progress/unenroll/{pathId}` → Unenroll from skill path
- `GET /api/progress/levels/unlock-status/{skillPathId}` → Check level unlock status
- `GET /api/progress/admin/stats` → Admin dashboard stats

### Current ASP.NET Implementation
- `GET /api/progress/dashboard` ✅ (exists)
- `GET /api/progress/enrolled` ✅ (exists)
- `GET /api/progress/path/{pathId}` ✅ (exists)
- `GET /api/progress/levels/{pathId}` ✅ (exists)
- `POST /api/progress/module/{moduleId}/read` ✅ (exists)
- `POST /api/progress/test/submit` ✅ (exists)
- `POST /api/progress/enroll/{pathId}` ✅ (exists)
- `DELETE /api/progress/unenroll/{pathId}` ✅ (exists)
- `GET /api/progress/levels/unlock-status/{skillPathId}` ✅ (exists)
- `GET /api/progress/admin/stats` ✅ (exists)

**Status**: ✅ Complete

## Admin Endpoints

### Frontend Expectation (Node.js)
- `GET /api/admin/stats` → Admin dashboard stats
- `GET /api/admin/users` → All users with stats
- `PUT /api/admin/users/{id}` → Update user
- `DELETE /api/admin/users/{id}` → Delete user
- `POST /api/admin/invite` → Invite user

### Current ASP.NET Implementation
- `GET /api/admin/stats` ❌ (missing - exists in progress controller)
- `GET /api/admin/users` ❌ (missing - exists in users controller)
- `PUT /api/admin/users/{id}` ❌ (missing)
- `DELETE /api/admin/users/{id}` ❌ (missing)
- `POST /api/admin/invite` ❌ (missing)

**Action Needed**: Create dedicated AdminController or map to existing endpoints

## Certificates Endpoints

### Frontend Expectation
- `GET /api/certificates` → User certificates
- `POST /api/certificates` → Claim certificate

### Current ASP.NET Implementation
- `GET /api/certificates` ✅ (exists)
- `POST /api/certificates` ✅ (exists)

**Status**: ✅ Complete

## Announcements Endpoints

### Frontend Expectation
- `GET /api/announcements` → All announcements
- `POST /api/announcements` → Create announcement (admin)
- `DELETE /api/announcements/{id}` → Delete announcement (admin)

### Current ASP.NET Implementation
- `GET /api/announcements` ✅ (exists)
- `POST /api/announcements` ✅ (exists)
- `DELETE /api/announcements/{id}` ✅ (exists)

**Status**: ✅ Complete

## Upload Endpoints

### Frontend Expectation
- `POST /api/uploads/skillpath/{id}` → Upload skill path image

### Current ASP.NET Implementation
- `POST /api/uploads/skillpath/{id}` ✅ (exists)

**Status**: ✅ Complete

## Summary

**Complete**: 6/8 endpoint groups
**Missing/Issues**: 2/8 endpoint groups
**Priority Actions**:
1. Fix authentication response formats
2. Add missing practice questions endpoint
3. Create/fix admin endpoints
4. Verify all response formats match frontend expectations
