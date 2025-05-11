using System;
using System.Collections.Generic;

namespace Cinematrix.API.Entidades;

public partial class Sesion
{
    public int Id { get; set; }

    public int SalaId { get; set; }

    public int PeliculaId { get; set; }

    public DateTime Inicio { get; set; }

    public DateTime Fin { get; set; }

    public string Estado { get; set; } = null!;

    public virtual ICollection<Compra> Compras { get; set; } = new List<Compra>();

    public virtual ICollection<Ocupacion> Ocupaciones { get; set; } = new List<Ocupacion>();

    public virtual Pelicula Pelicula { get; set; } = null!;

    public virtual Sala Sala { get; set; } = null!;
}
