using System;
using System.Collections.Generic;

namespace Cinematrix.API.Entidades;

public partial class Tarifa
{
    public string Nombre { get; set; } = null!;

    public decimal? Precio { get; set; }

    public virtual ICollection<Ocupacion> Ocupaciones { get; set; } = new List<Ocupacion>();
}
