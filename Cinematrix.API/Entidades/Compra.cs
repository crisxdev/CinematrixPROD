using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Cinematrix.API.Entidades;

public partial class Compra
{
    public int Id { get; set; }

    public int SesionId { get; set; }

    public required DateTime Inicio { get; set; }

    public DateTime? Fin { get; set; }

    [Required]
    public required string Estado { get; set; } = null!;

    public required string Autorizacion { get; set; } = null!;

    public required string Canal { get; set; } = null!;

    public required string Medio { get; set; } = null!;

    public decimal? Importe { get; set; }

    public virtual ICollection<Ocupacion> Ocupaciones { get; set; } = new List<Ocupacion>();

    public virtual Sesion Sesion { get; set; } = null!;

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
