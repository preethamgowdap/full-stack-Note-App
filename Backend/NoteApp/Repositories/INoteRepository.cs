using System;
using System.Collections.Generic;
using NoteApp.Models;

namespace NoteApp.Repositories
{
    public interface INoteRepository
    {
        IEnumerable<Note> GetAll();
        Note? GetById(Guid id);
        bool Add(Note note);
        bool Update(Note note);
        bool Delete(Guid id);
    }
}
