using Microsoft.AspNetCore.Identity;

namespace Cinematrix.API.Utilidades
{
    public class SeedData
    {
        public static async Task SeedAdminAsync(UserManager<IdentityUser> userManager)
        {
            string adminEmail = "admin@cine.com";
            string password = "Admin123!";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                var user = new IdentityUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                await userManager.CreateAsync(user, password);
            }
        }
    }
}
