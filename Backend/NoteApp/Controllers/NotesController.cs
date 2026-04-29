using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoteApp.Models;
using NoteApp.Repositories;
using System.Linq;

namespace NoteApp.Controllers
{           // This enforces JWT Authentication for all routes in this controller
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly INoteRepository _noteRepository;

        public NotesController(INoteRepository noteRepository)
        {
            _noteRepository = noteRepository;
        }

        [HttpGet("{userId}")]
        public IActionResult GetNotes(string userId)
        {
            var allNotes = _noteRepository.GetAll();

            var userNotes = allNotes.Where(note => note.UserId == userId).ToList();
            return Ok(userNotes);
        }

        [HttpPost]
        public IActionResult CreateNote([FromBody] Note note)
        {
            note.Id = Guid.NewGuid();
            _noteRepository.Add(note);
            return Ok(note);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateNote(Guid id, [FromBody] Note updatedNote)
        {
        

            var existingNote = _noteRepository.GetById(id);
            if (existingNote == null) {
                return NotFound("Note Not Found");
            }
            _noteRepository.Update(updatedNote);
            return Ok(updatedNote);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNote(Guid id)
        {
            var existingNote = _noteRepository.GetById(id);
            if (existingNote == null) return NotFound();

            _noteRepository.Delete(id);
            return NoContent();
        }
    }
}