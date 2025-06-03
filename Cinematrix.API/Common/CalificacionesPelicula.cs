namespace Cinematrix.API.Common
{
   
        public static class CalificacionesPelicula
        {
            public static string TP = "TP";
            public static string M7 = "M-7";
            public static string M12 = "M-12";
            public static string M16 = "M-16";
            public static string M18 = "M-18";

            public static List<string> Todas => new()
    {
        TP, M7, M12, M16, M18
    };
        }
    
}
