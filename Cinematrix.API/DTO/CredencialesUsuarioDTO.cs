using System.ComponentModel.DataAnnotations;

namespace Cinematrix.API.DTO
{
    public class CredencialesUsuarioDTO
    {

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}
