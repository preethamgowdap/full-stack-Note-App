using System;
using System.Collections.Generic;
using System.Linq;
using NoteApp.Models;

namespace NoteApp.Repositories
{
    public class NoteRepository : INoteRepository
    {
        private static readonly List<Note> _notes = new();

        public IEnumerable<Note> GetAll() => _notes;

        public Note? GetById(Guid id) =>
            _notes.FirstOrDefault(n => n.Id == id);

        public bool Add(Note note)
        {
            note.Id = Guid.NewGuid();
            _notes.Add(note);
            return true;
        }

        public bool Update(Note note)
        {
            var existing = GetById(note.Id);            
            if (existing == null) return false;

            existing.Title = note.Title;
            existing.Body = note.Body;
            existing.Category = note.Category;
            existing.TriggerDateTime = note.TriggerDateTime;

           
            return true;
        }

        public bool Delete(Guid id)
        {
            var noteToRemove = _notes.FirstOrDefault(n => n.Id == id);

            if (noteToRemove != null){

            _notes.Remove(noteToRemove);
            return true;
            }
            return false;
        }
    }
}