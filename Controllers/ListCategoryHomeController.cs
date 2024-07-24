using Microsoft.AspNetCore.Mvc;

namespace Web_Eco3d_2024.Controllers
{
    public class ListCategoryHomeController : Controller
    {
        public async Task<IActionResult> ListCateHome()
        {
            return View();
        }
    }
}
