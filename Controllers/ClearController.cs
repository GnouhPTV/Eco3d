using Microsoft.AspNetCore.Mvc;

namespace Web_Eco3d_2024.Controllers
{
    public class ClearController : Controller
    {
        public IActionResult Clear()
        {
            Lib.MemoryCache.DeleteAll();
            return Redirect("~/");
            return View();
        }
    }
}
