using System;


namespace NoteApp.Models
{
    public class Note
    {
        
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime? TriggerDateTime { get; set; }

        public string UserId { get; set; } = string.Empty;

    }
}