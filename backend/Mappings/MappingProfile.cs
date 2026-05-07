using AutoMapper;
using myapp_backend.Models;
using myapp_backend.DTOs;

namespace myapp_backend.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserProfileDto>()
                .ForMember(dest => dest.Joined, opt => opt.MapFrom(src => src.CreatedAt));
            
            CreateMap<User, AuthResponseDto>()
                .ForMember(dest => dest.JoinedAt, opt => opt.MapFrom(src => src.CreatedAt));
            CreateMap<User, AdminUserDto>()
                .ForMember(dest => dest.JoinedDate, opt => opt.MapFrom(src => src.CreatedAt));
            CreateMap<RegisterDto, User>();
            CreateMap<ProfileUpdateDto, User>();

            // SkillPath mappings
            CreateMap<SkillPath, SkillPathDto>();
            CreateMap<SkillPathDto, SkillPath>();

            // Level mappings
            CreateMap<Level, LevelDto>();
            CreateMap<Level, LevelDetailDto>();
            CreateMap<LevelDto, Level>();

            // Module mappings
            CreateMap<Module, ModuleDto>();
            CreateMap<Module, ModuleDetailDto>();
            CreateMap<ModuleDto, Module>();

            // Question mappings
            CreateMap<Question, QuestionDto>();
            CreateMap<CreateQuestionDto, Question>();
            CreateMap<UpdateQuestionDto, Question>();

            // Announcement mappings
            CreateMap<Announcement, AnnouncementDto>();
            CreateMap<AnnouncementCreateDto, Announcement>();

            // Certificate mappings
            CreateMap<Certificate, CertificateDto>()
                .ForMember(dest => dest.SkillPathTitle, opt => opt.MapFrom(src => src.SkillPath.Title))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Name));

            // LevelMasteryTest mappings
            CreateMap<LevelMasteryTest, LevelMasteryTestDto>()
                .ForMember(dest => dest.QuestionCount, opt => opt.MapFrom(src => src.Questions.Count));
            CreateMap<CreateLevelMasteryTestDto, LevelMasteryTest>();
            CreateMap<UpdateLevelMasteryTestDto, LevelMasteryTest>();

            // Progress mappings
            // Note: Some complex mappings might still need service-level logic
            // but we can map the basic fields here.
        }
    }
}
