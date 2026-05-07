using myapp_backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using myapp_backend.Repositories.Interfaces;
using myapp_backend.Repositories;
using myapp_backend.Services.Interfaces;
using myapp_backend.Services;
using myapp_backend.Middleware;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// 1. AddDbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. AddCors
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins(allowedOrigins ?? new[] { "http://localhost:5173" })
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// 3. AddAuthentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!))
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Token validation failed: {context.Exception.Message}");
                if (context.Exception.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {context.Exception.InnerException.Message}");
                }
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Console.WriteLine($"OnChallenge error: {context.Error}, {context.ErrorDescription}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// 4. Register Repositories and Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<ISkillPathRepository, SkillPathRepository>();
builder.Services.AddScoped<ISkillPathService, SkillPathService>();

builder.Services.AddScoped<ILevelRepository, LevelRepository>();
builder.Services.AddScoped<ILevelService, LevelService>();

builder.Services.AddScoped<IModuleRepository, ModuleRepository>();
builder.Services.AddScoped<IModuleService, ModuleService>();

builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IQuestionService, QuestionService>();

builder.Services.AddScoped<IUserEnrollmentRepository, UserEnrollmentRepository>();
builder.Services.AddScoped<IUserEnrollmentService, UserEnrollmentService>();

builder.Services.AddScoped<IUserLevelProgressRepository, UserLevelProgressRepository>();
builder.Services.AddScoped<IUserLevelProgressService, UserLevelProgressService>();

builder.Services.AddScoped<IUserModuleProgressRepository, UserModuleProgressRepository>();
builder.Services.AddScoped<IUserModuleProgressService, UserModuleProgressService>();

builder.Services.AddScoped<ITestAttemptRepository, TestAttemptRepository>();
builder.Services.AddScoped<ITestAttemptService, TestAttemptService>();

builder.Services.AddScoped<ITestAttemptAnswerRepository, TestAttemptAnswerRepository>();
builder.Services.AddScoped<ITestAttemptAnswerService, TestAttemptAnswerService>();

builder.Services.AddScoped<IPracticeSessionRepository, PracticeSessionRepository>();
builder.Services.AddScoped<IPracticeSessionService, PracticeSessionService>();

builder.Services.AddScoped<ICertificateRepository, CertificateRepository>();
builder.Services.AddScoped<ICertificateService, CertificateService>();

builder.Services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
builder.Services.AddScoped<IAnnouncementService, AnnouncementService>();

builder.Services.AddScoped<ILevelMasteryTestService, LevelMasteryTestService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.WebHost.UseUrls("https://localhost:7001", "http://localhost:5000");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
    // Seed Data
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        await SeedData.InitializeAsync(services);
    }
}

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseStaticFiles(new StaticFileOptions {
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
    RequestPath = ""
});
// app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
