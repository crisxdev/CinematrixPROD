using Cinematrix.API.Datos;
using Cinematrix.API.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var cadenaDeConexion = builder.Configuration.GetValue<string>("DefaultConnection");

//Inicio del área de servicios
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // URL del frontend Angular
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});



builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddControllers().AddJsonOptions(opciones => opciones.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddDbContext<CinematrixContext>(opciones => opciones.UseSqlServer("name=DefaultConnection"));

builder.Services.AddHostedService<ReservaCleanupService>();

//Fin del área del servicios



var app = builder.Build();


//Inicio del área de los middlewares
app.UseStaticFiles();
app.UseCors("AllowAngularDev");
app.MapControllers();

//Fin del área de los middlewares



app.Run();
