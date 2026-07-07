using System;
using System.ComponentModel.DataAnnotations;

namespace NoteApp.Models
{
    public class Note
    {
        [Required]
        public Guid Id { get; set; }
         
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [RegularExpression(@"^[a-zA-Z ]*$",
        ErrorMessage = "Title can contain only alphabets (a-z, A-Z) and spaces")]
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime? TriggerDateTime { get; set; }

        public string UserId { get; set; } = string.Empty;

    }
}