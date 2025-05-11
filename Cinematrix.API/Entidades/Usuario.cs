using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinematrix.API.Entidades;

public partial class Usuario
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string Correo { get; set; } = null!;

    [Column("Contraseña")]
    public string Contrasenia { get; set; } = null!;

    public int RolId { get; set; }

    public virtual Rol Rol { get; set; } = null!;
}
