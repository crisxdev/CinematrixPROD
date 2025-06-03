namespace Cinematrix.API.Common
{
    public class FormatosPeliculas
    {
        public static string DosD = "2D ESPAÑOL";
        public static string TresD = "3D ESPAÑOL";
        public static string Imax = "IMAX ESPAÑOL";

        public static List<string> Todas => new()
    {
        DosD, TresD, Imax
    };
    }
}
