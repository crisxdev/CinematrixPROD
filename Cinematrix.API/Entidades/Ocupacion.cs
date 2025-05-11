using System;
using System.Collections.Generic;

namespace Cinematrix.API.Entidades;

public partial class Ocupacion
{
    public int SesionId { get; set; }

    public string Butaca { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public int CompraId { get; set; }

    public string TarifaNombre { get; set; } = null!;

    public virtual Compra Compra { get; set; } = null!;

    public virtual Sesion Sesion { get; set; } = null!;

    public virtual Tarifa TarifaNombreNavigation { get; set; } = null!;
}
