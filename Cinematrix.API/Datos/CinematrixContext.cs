using System;
using System.Collections.Generic;
using Cinematrix.API.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Cinematrix.API.Datos;

public partial class CinematrixContext : DbContext
{
    public CinematrixContext()
    {
    }

    public CinematrixContext(DbContextOptions<CinematrixContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Compra> Compras { get; set; }

    public virtual DbSet<Ocupacion> Ocupaciones { get; set; }

    public virtual DbSet<Pelicula> Peliculas { get; set; }

    public virtual DbSet<Rol> Roles { get; set; }

    public virtual DbSet<Sala> Salas { get; set; }

    public virtual DbSet<Sesion> Sesiones { get; set; }

    public virtual DbSet<Tarifa> Tarifas { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-49V8H3B;Database=CinematrixCodeFirst;Integrated Security=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Compra>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Compra__3213E83F8A962A2B");

            entity.ToTable("Compra");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Autorizacion)
                .HasMaxLength(50)
                .HasDefaultValue("")
                .HasColumnName("autorizacion");
            entity.Property(e => e.Canal)
                .HasMaxLength(20)
                .HasColumnName("canal");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .HasDefaultValue("EN_PROCESO")
                .HasColumnName("estado");
            entity.Property(e => e.Fin)
                .HasColumnType("datetime")
                .HasColumnName("fin");
            entity.Property(e => e.Importe)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("importe");
            entity.Property(e => e.Inicio)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("inicio");
            entity.Property(e => e.Medio)
                .HasMaxLength(20)
                .HasDefaultValue("")
                .HasColumnName("medio");
            entity.Property(e => e.SesionId).HasColumnName("sesion_id");

            entity.HasOne(d => d.Sesion).WithMany(p => p.Compras)
                .HasForeignKey(d => d.SesionId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Compra__sesion_i__49C3F6B7");
        });

        modelBuilder.Entity<Ocupacion>(entity =>
        {
            entity.HasKey(e => new { e.SesionId, e.Butaca }).HasName("PK__Ocupacio__4EA6BB6DF73B9873");

            entity.ToTable("Ocupacion");

            entity.Property(e => e.SesionId).HasColumnName("sesion_id");
            entity.Property(e => e.Butaca)
                .HasMaxLength(10)
                .HasColumnName("butaca");
            entity.Property(e => e.CompraId).HasColumnName("compra_id");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .HasDefaultValue("RESERVADA")
                .HasColumnName("estado");
            entity.Property(e => e.TarifaNombre)
                .HasMaxLength(10)
                .HasColumnName("tarifa_nombre");

            entity.HasOne(d => d.Compra).WithMany(p => p.Ocupaciones)
                .HasForeignKey(d => d.CompraId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Ocupacion__compr__571DF1D5");

            entity.HasOne(d => d.Sesion).WithMany(p => p.Ocupaciones)
                .HasForeignKey(d => d.SesionId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Ocupacion__sesio__5441852A");

            entity.HasOne(d => d.TarifaNombreNavigation).WithMany(p => p.Ocupaciones)
                .HasForeignKey(d => d.TarifaNombre)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Ocupacion__tarif__5812160E");
        });

        modelBuilder.Entity<Pelicula>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Pelicula__3213E83F1E396DEF");

            entity.ToTable("Pelicula");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Anio).HasColumnName("anio");
            entity.Property(e => e.Calificacion)
                .HasMaxLength(5)
                .HasColumnName("calificacion");
            entity.Property(e => e.Categoria)
                .HasMaxLength(50)
                .HasColumnName("categoria");
            entity.Property(e => e.Duracion).HasColumnName("duracion");
            entity.Property(e => e.Formato)
                .HasMaxLength(50)
                .HasDefaultValue("2D ESPAÑOL")
                .HasColumnName("formato");
            entity.Property(e => e.Imagen)
                .HasMaxLength(255)
                .HasColumnName("imagen");
            entity.Property(e => e.Poster)
                .HasMaxLength(500)
                .HasColumnName("poster");
            entity.Property(e => e.Sinopsis)
                .HasMaxLength(500)
                .HasColumnName("sinopsis");
            entity.Property(e => e.Titulo).HasColumnName("titulo");
            entity.Property(e => e.Trailer)
                .HasMaxLength(500)
                .HasColumnName("trailer");
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Rol__3213E83F9FE5E9A8");

            entity.ToTable("Rol");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Nombre)
                .HasMaxLength(20)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<Sala>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Sala__3213E83F3EDF4A3C");

            entity.ToTable("Sala");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Aforo).HasColumnName("aforo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .HasColumnName("nombre");
            entity.Property(e => e.Plano)
                .HasMaxLength(2048)
                .HasColumnName("plano");
        });

        modelBuilder.Entity<Sesion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Sesion__3213E83F1FA82287");

            entity.ToTable("Sesion");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .HasDefaultValue("PROGRAMADA")
                .HasColumnName("estado");
            entity.Property(e => e.Fin)
                .HasColumnType("datetime")
                .HasColumnName("fin");
            entity.Property(e => e.Inicio)
                .HasColumnType("datetime")
                .HasColumnName("inicio");
            entity.Property(e => e.PeliculaId).HasColumnName("pelicula_id");
            entity.Property(e => e.SalaId).HasColumnName("sala_id");

            entity.HasOne(d => d.Pelicula).WithMany(p => p.Sesiones)
                .HasForeignKey(d => d.PeliculaId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Sesion__pelicula__403A8C7D");

            entity.HasOne(d => d.Sala).WithMany(p => p.Sesiones)
                .HasForeignKey(d => d.SalaId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Sesion__sala_id__3F466844");
        });

        modelBuilder.Entity<Tarifa>(entity =>
        {
            entity.HasKey(e => e.Nombre).HasName("PK__Tarifa__72AFBCC733D2AAC3");

            entity.ToTable("Tarifa");

            entity.Property(e => e.Nombre)
                .HasMaxLength(10)
                .HasColumnName("nombre");
            entity.Property(e => e.Precio)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("precio");
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Ticket__3213E83FF2CCECBB");

            entity.ToTable("Ticket");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Butaca)
                .HasMaxLength(10)
                .HasColumnName("butaca");
            entity.Property(e => e.CompraId).HasColumnName("compra_id");
            entity.Property(e => e.Importe)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("importe");
            entity.Property(e => e.PeliculaTitulo).HasColumnName("pelicula_titulo");
            entity.Property(e => e.SalaNombre)
                .HasMaxLength(50)
                .HasColumnName("sala_nombre");
            entity.Property(e => e.SesionInicio)
                .HasColumnType("datetime")
                .HasColumnName("sesion_inicio");
            entity.Property(e => e.TarifaNombre)
                .HasMaxLength(10)
                .HasColumnName("tarifa_nombre");

            entity.HasOne(d => d.Compra).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.CompraId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Ticket__compra_i__5AEE82B9");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Usuario__3213E83F31F84249");

            entity.ToTable("Usuario");

            entity.HasIndex(e => e.Correo, "UQ__Usuario__2A586E0B41E36D91").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Contrasenia)
                .HasMaxLength(100)
                .HasColumnName("contraseña");
            entity.Property(e => e.Correo)
                .HasMaxLength(100)
                .HasColumnName("correo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .HasColumnName("nombre");
            entity.Property(e => e.RolId).HasColumnName("rol_id");

            entity.HasOne(d => d.Rol).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.RolId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Usuario__rol_id__628FA481");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
