using Cinematrix.API.Entidades;
using System.Text.Json;

namespace Cinematrix.API.Common
{
    public static class TransformaAforo
    {

        public static Dictionary<string, List<Dictionary<string, string>>> TransformarAforo(string sala, List<Ocupacion> ocupacion)
        {
            var aforo = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(sala);
            var aforoInfo = new Dictionary<string, List<Dictionary<string, string>>>();
            var fila = new List<Dictionary<string, string>>();
            string asientoCompleto;
            if (aforo is not null)
            {
                foreach (var aforoItem in aforo)
                {
                    fila = new List<Dictionary<string, string>>();
                    
                    //System.Diagnostics.Debug.WriteLine(aforoItem.Key);

                    foreach(var asiento in aforoItem.Value)
                    {
                        asientoCompleto = aforoItem.Key + asiento;
                        //System.Diagnostics.Debug.WriteLine(asiento);
                        var asientoOcupado = ocupacion.FirstOrDefault(x => x.Butaca == asientoCompleto);
                        if(asientoOcupado is not null)
                        {
                            //System.Diagnostics.Debug.WriteLine("Ocupadooo",asientoOcupado.Butaca);
                            fila.Add(new Dictionary<string, string>
                            {
                                {  asientoCompleto,"OCUPADO" } 
                               
                            });
                        }
                        else
                        {
                            var dicAsientoInfo=asiento == "__" ? new Dictionary<string, string> { { asiento, "NO_DISPONIBLE" } } : new Dictionary<string, string> { { asientoCompleto, "DISPONIBLE" } };
                            fila.Add(dicAsientoInfo);

                        }
                    }
                    aforoInfo[aforoItem.Key] = fila;
                }
            }



            //foreach (var af in aforoInfo)
            //{
            //    System.Diagnostics.Debug.WriteLine($"Fila {af.Key}: [{string.Join(",", af.Value)}]");
            //}

            return aforoInfo;


        }

    }
}
