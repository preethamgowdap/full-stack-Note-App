using NoteApp.DTOs;
using NoteApp.Models;

namespace NoteApp.Services
{
    public interface IAuthService
    {
        string? Login(UserDto userDto);
        User Register(UserDto userDto);

        List<User> GetAllUsers();
        
    }
}