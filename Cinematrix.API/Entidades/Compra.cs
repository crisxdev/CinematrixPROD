using System;
using System.Collections.Generic;

namespace Cinematrix.API.Entidades;

public partial class Compra
{
    public int Id { get; set; }

    public int SesionId { get; set; }

    public DateTime Inicio { get; set; }

    public DateTime? Fin { get; set; }

    public string Estado { get; set; } = null!;

    public string Autorizacion { get; set; } = null!;

    public string Canal { get; set; } = null!;

    public string Medio { get; set; } = null!;

    public decimal? Importe { get; set; }

    public virtual ICollection<Ocupacion> Ocupaciones { get; set; } = new List<Ocupacion>();

    public virtual Sesion Sesion { get; set; } = null!;

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
