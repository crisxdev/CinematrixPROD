using Cinematrix.API.Common;
using Cinematrix.API.Datos;
using Microsoft.EntityFrameworkCore;

namespace Cinematrix.API.Services
{
    public class ReservaCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _intervalo = TimeSpan.FromSeconds(30);

        public ReservaCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<CinematrixContext>();

                    var vencidas = await dbContext.Compras
                        .Where(c => c.Estado == EstadoCompra.EnProceso && c.Inicio < DateTime.Now.AddMinutes(-15))
                        .ToListAsync();

                    if (vencidas.Any())
                    {
                        foreach (var compra in vencidas)
                        {
                            compra.Estado = EstadoCompra.Cancelada;

                            var ocupaciones = await dbContext.Ocupaciones
                                .Where(o => o.CompraId == compra.Id)
                                .ToListAsync();

                            dbContext.Ocupaciones.RemoveRange(ocupaciones);
                        }

                        await dbContext.SaveChangesAsync();
                    }
                }

                await Task.Delay(_intervalo, stoppingToken);
            }
        }

    }
}

