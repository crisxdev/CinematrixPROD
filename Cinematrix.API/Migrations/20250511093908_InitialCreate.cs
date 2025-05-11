using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cinematrix.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pelicula",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    titulo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    anio = table.Column<int>(type: "int", nullable: true),
                    calificacion = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    categoria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    duracion = table.Column<int>(type: "int", nullable: true),
                    formato = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValue: "2D ESPAÑOL"),
                    imagen = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    poster = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    sinopsis = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    trailer = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Pelicula__3213E83F1E396DEF", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Rol",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Rol__3213E83F9FE5E9A8", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Sala",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    aforo = table.Column<int>(type: "int", nullable: true),
                    plano = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Sala__3213E83F3EDF4A3C", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Tarifa",
                columns: table => new
                {
                    nombre = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    precio = table.Column<decimal>(type: "decimal(4,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Tarifa__72AFBCC733D2AAC3", x => x.nombre);
                });

            migrationBuilder.CreateTable(
                name: "Usuario",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    correo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    contraseña = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    rol_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Usuario__3213E83F31F84249", x => x.id);
                    table.ForeignKey(
                        name: "FK__Usuario__rol_id__628FA481",
                        column: x => x.rol_id,
                        principalTable: "Rol",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Sesion",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    sala_id = table.Column<int>(type: "int", nullable: false),
                    pelicula_id = table.Column<int>(type: "int", nullable: false),
                    inicio = table.Column<DateTime>(type: "datetime", nullable: false),
                    fin = table.Column<DateTime>(type: "datetime", nullable: false),
                    estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "PROGRAMADA")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Sesion__3213E83F1FA82287", x => x.id);
                    table.ForeignKey(
                        name: "FK__Sesion__pelicula__403A8C7D",
                        column: x => x.pelicula_id,
                        principalTable: "Pelicula",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK__Sesion__sala_id__3F466844",
                        column: x => x.sala_id,
                        principalTable: "Sala",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Compra",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    sesion_id = table.Column<int>(type: "int", nullable: false),
                    inicio = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    fin = table.Column<DateTime>(type: "datetime", nullable: true),
                    estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "EN_PROCESO"),
                    autorizacion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: ""),
                    canal = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    medio = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: ""),
                    importe = table.Column<decimal>(type: "decimal(5,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Compra__3213E83F8A962A2B", x => x.id);
                    table.ForeignKey(
                        name: "FK__Compra__sesion_i__49C3F6B7",
                        column: x => x.sesion_id,
                        principalTable: "Sesion",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Ocupacion",
                columns: table => new
                {
                    sesion_id = table.Column<int>(type: "int", nullable: false),
                    butaca = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "RESERVADA"),
                    compra_id = table.Column<int>(type: "int", nullable: false),
                    tarifa_nombre = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Ocupacio__4EA6BB6DF73B9873", x => new { x.sesion_id, x.butaca });
                    table.ForeignKey(
                        name: "FK__Ocupacion__compr__571DF1D5",
                        column: x => x.compra_id,
                        principalTable: "Compra",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK__Ocupacion__sesio__5441852A",
                        column: x => x.sesion_id,
                        principalTable: "Sesion",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK__Ocupacion__tarif__5812160E",
                        column: x => x.tarifa_nombre,
                        principalTable: "Tarifa",
                        principalColumn: "nombre",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Ticket",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    compra_id = table.Column<int>(type: "int", nullable: false),
                    butaca = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    tarifa_nombre = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    importe = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    pelicula_titulo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    sala_nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    sesion_inicio = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Ticket__3213E83FF2CCECBB", x => x.id);
                    table.ForeignKey(
                        name: "FK__Ticket__compra_i__5AEE82B9",
                        column: x => x.compra_id,
                        principalTable: "Compra",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Compra_sesion_id",
                table: "Compra",
                column: "sesion_id");

            migrationBuilder.CreateIndex(
                name: "IX_Ocupacion_compra_id",
                table: "Ocupacion",
                column: "compra_id");

            migrationBuilder.CreateIndex(
                name: "IX_Ocupacion_tarifa_nombre",
                table: "Ocupacion",
                column: "tarifa_nombre");

            migrationBuilder.CreateIndex(
                name: "IX_Sesion_pelicula_id",
                table: "Sesion",
                column: "pelicula_id");

            migrationBuilder.CreateIndex(
                name: "IX_Sesion_sala_id",
                table: "Sesion",
                column: "sala_id");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_compra_id",
                table: "Ticket",
                column: "compra_id");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_rol_id",
                table: "Usuario",
                column: "rol_id");

            migrationBuilder.CreateIndex(
                name: "UQ__Usuario__2A586E0B41E36D91",
                table: "Usuario",
                column: "correo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ocupacion");

            migrationBuilder.DropTable(
                name: "Ticket");

            migrationBuilder.DropTable(
                name: "Usuario");

            migrationBuilder.DropTable(
                name: "Tarifa");

            migrationBuilder.DropTable(
                name: "Compra");

            migrationBuilder.DropTable(
                name: "Rol");

            migrationBuilder.DropTable(
                name: "Sesion");

            migrationBuilder.DropTable(
                name: "Pelicula");

            migrationBuilder.DropTable(
                name: "Sala");
        }
    }
}
