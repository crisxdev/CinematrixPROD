using System;
using System.Collections.Generic;

namespace Cinematrix.API.Entidades;

public partial class Sala
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public int? Aforo { get; set; }

    public string Plano { get; set; } = null!;

    public virtual ICollection<Sesion> Sesiones { get; set; } = new List<Sesion>();
}
