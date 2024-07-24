using Microsoft.AspNetCore.Mvc;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;

namespace Web_Eco3d_2024.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly WebService _webService;
        public static string OrderTicket = "";
        public ProductController(ApplicationDbContext db, WebService webService)
        {
            _dbContext = db;
            _webService = webService;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> GetInforProductByCodeAsync(string Code)
        {
            var result = await _webService.GetProductByCode(Code);
            return Json(result);
        }

        public static string GetTicketTypeId()
        {
            Random rand = new Random();
            var now = DateTime.Now;
            var randInter = rand.Next(100, 999);
            return string.Format("{0:yyyyMMddhhss}", now) + randInter.ToString();
        }
    }
}
