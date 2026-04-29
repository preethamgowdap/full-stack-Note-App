using Microsoft.IdentityModel.Tokens;
using NoteApp.DTOs;
using NoteApp.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NoteApp.Services
{
    public class AuthService : IAuthService
    {
        private static readonly List<User> Users =new();
        private readonly IConfiguration _config;

        public AuthService(IConfiguration config)
        {
            
            _config = config;
        }

       

        public string? Login(UserDto userDto)
        {
           var user = Users.FirstOrDefault(u => 
                u.Username == userDto.Username && 
                u.Password == userDto.Password);

            if (user == null) return null;

             var jwtKey = _config["Jwt:Key"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("Guid", user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2), // Token valid for 2 hours
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
         public User Register(UserDto userDto)
        {
            bool userExists = Users.Any(u => u.Username == userDto.Username);
            if(userExists){
                return null;

            }
            var User = new User
            {
                Id =  Guid.NewGuid() ,
                Username = userDto.Username,
                Password = userDto.Password,
            };

            Users.Add(User);
            return User;
            
        }
        public List<User>GetAllUsers()
        {
            return Users;
        }
        
    }
}