namespace Cinematrix.API.Common
{
    public static class CategoriaPelicula
    {
        public static string Accion = "ACCIÓN";
        public static string CienciaFiccion = "CIENCIA FICCIÓN";
        public static string Comedia = "COMEDIA";
        public static string Documental = "DOCUMENTAL";
        public static string Drama = "DRAMA";
        public static string Fantasia = "FANTASÍA";
        public static string Melodrama = "MELODRAMA";
        public static string Musical = "MUSICAL";
        public static string Romance = "ROMANCE";
        public static string Suspense = "SUSPENSE";
        public static string Terror = "TERROR";
        public static string Thriller = "THRILLER";


        public static List<string> Todas => new()
    {
        Accion, CienciaFiccion, Comedia, Documental, Drama,
        Fantasia, Melodrama, Musical, Romance, Suspense,
        Terror, Thriller
    };
    }
}
