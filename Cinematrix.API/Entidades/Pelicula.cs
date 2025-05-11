using System;
using System.Collections.Generic;

namespace Cinematrix.API.Entidades;

public partial class Pelicula
{
    public int Id { get; set; }

    public string Titulo { get; set; } = null!;

    public int? Anio { get; set; }

    public string Calificacion { get; set; } = null!;

    public string Categoria { get; set; } = null!;

    public int? Duracion { get; set; }

    public string? Formato { get; set; }

    public string Imagen { get; set; } = null!;

    public string? Poster { get; set; }

    public string Sinopsis { get; set; } = null!;

    public string Trailer { get; set; } = null!;

    public virtual ICollection<Sesion> Sesiones { get; set; } = new List<Sesion>();
}
