using System;
using System.Collections.Generic;

namespace Cinematrix.API.Entidades;

public partial class Ticket
{
    public int Id { get; set; }

    public int CompraId { get; set; }

    public string Butaca { get; set; } = null!;

    public string TarifaNombre { get; set; } = null!;

    public decimal? Importe { get; set; }

    public string? PeliculaTitulo { get; set; }

    public string? SalaNombre { get; set; }

    public DateTime? SesionInicio { get; set; }

    public virtual Compra Compra { get; set; } = null!;
}
