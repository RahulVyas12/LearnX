using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace myapp_backend.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var response = exception switch
            {
                ArgumentException => CreateErrorResponse("Invalid argument provided", HttpStatusCode.BadRequest, "INVALID_ARGUMENT"),
                UnauthorizedAccessException => CreateErrorResponse("Unauthorized access", HttpStatusCode.Unauthorized, "UNAUTHORIZED"),
                KeyNotFoundException => CreateErrorResponse("Resource not found", HttpStatusCode.NotFound, "NOT_FOUND"),
                InvalidOperationException => CreateErrorResponse("Invalid operation", HttpStatusCode.BadRequest, "INVALID_OPERATION"),
                TimeoutException => CreateErrorResponse("Operation timed out", HttpStatusCode.RequestTimeout, "TIMEOUT"),
                _ => CreateErrorResponse("An internal server error occurred", HttpStatusCode.InternalServerError, "INTERNAL_ERROR")
            };

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            
            if (exception is ArgumentException || exception is InvalidOperationException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
            else if (exception is UnauthorizedAccessException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            }
            else if (exception is KeyNotFoundException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            }
            else if (exception is TimeoutException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
            }

            var jsonResponse = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(jsonResponse);
        }

        private static object CreateErrorResponse(string message, HttpStatusCode statusCode, string errorCode)
        {
            return new
            {
                error = message,
                status = (int)statusCode,
                code = errorCode,
                timestamp = DateTime.UtcNow
            };
        }
    }
}
