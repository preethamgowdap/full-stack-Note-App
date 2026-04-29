using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using NoteApp.Repositories;
using NoteApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSingleton<INoteRepository, NoteRepository>();
builder.Services.AddSingleton<IAuthService, AuthService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
    {
         var jwtKey = builder.Configuration["Jwt:Key"]; //?? "ThisIsMySuperSecretKeyForJwtAuthentication123!"; 
        options.SaveToken = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>{
    options.AddPolicy("AllowReactApp",policy =>{
        policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();

    });
});

var app = builder.Build();


app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("AllowReactApp");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();