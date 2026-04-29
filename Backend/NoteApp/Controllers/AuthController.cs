using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoteApp.DTOs;
using NoteApp.Services;

namespace NoteApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserDto userDto)
        {
            var cleanUsername = userDto.Username;
            var userExists = _authService.GetAllUsers().Any(u => u.Username == cleanUsername);
            if(userExists){
                return BadRequest("User allready exists! please choose a differnt username. ");
            }
            userDto.Username = cleanUsername;
             _authService.Register(userDto);
           
            return Ok(new{message = "Registration succesful!"});
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserDto userDto)
        {
            var token = _authService.Login(userDto);

            if (token == null)
                return Unauthorized("Invalid username or password");

            var  user = _authService.GetAllUsers().FirstOrDefault(u => u.Username == userDto.Username);

            return Ok(new { 
                Token = token,
                username = user.Username,
                userId = user.Id,
                Message = "Login successfully" });
        }

        [HttpGet("users")]
        [Authorize] 
        public IActionResult GetAllUsers()
        {
            var users = _authService.GetAllUsers();
            return Ok(users);
        }
    }
}