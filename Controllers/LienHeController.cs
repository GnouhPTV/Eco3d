using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;

namespace Web_Eco3d_2024.Controllers
{
    public class LienHeController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly WebService _webService;
        public LienHeController(ApplicationDbContext db, WebService webService)
        {
            _db = db;
            _webService = webService;
        }
        public async Task<IActionResult> LienHe()
        {
            List<ChiNhanhModel> chinhanh = await _webService.GetMember();
            return View(chinhanh);
        }
        public async Task<IActionResult> Search(string? Ten)
        {
            var Chinhanh = await _webService.GetChinhanh("100", "DM_ChiNhanh.TinhTrang=1 AND Ten LIKE N'%" + Ten + "%'");
            return Json(Chinhanh);
        }
    }
}
