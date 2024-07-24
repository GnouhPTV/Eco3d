using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;
using X.PagedList;

namespace Web_Eco3d_2024.Controllers
{
    public class LinhVucController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly WebService _webService;
        private static int topValue = 1000;
        public LinhVucController(ApplicationDbContext db, WebService webService)
        {
            _dbContext = db;
            _webService = webService;
        }
        public async Task<IActionResult> linhvuc(string linkUrl, int? page)
        {
            int pageSize = 16;
            int pageNumber = page ?? 1;
            int? storedTopValue = HttpContext.Session.GetInt32("TopValue");
            if (storedTopValue.HasValue)
            {
                topValue = storedTopValue.Value;
            }
            var LoaiHangUrl = await _webService.GetUrlByLoaiHang(linkUrl);
            ViewData["LinkLH"] = LoaiHangUrl;
            if (LoaiHangUrl == null)
            {
                return NotFound();
            }
            var productbyLH = await _webService.GetProductByLoaiHang(LoaiHangUrl.Ma);
            IPagedList<ProductStoreModel> pagedList = productbyLH.ToPagedList(pageNumber, pageSize);
            string sCond = "DM_HangHoa.TinhTrang=1 AND DM_HangHoa.Ma IN (SELECT HangHoa FROM LoaiHang_HangHoa WHERE LoaiHang=N'" + LoaiHangUrl.Ma + "' AND TrangThai=1)";
            var countP = await _webService.Count_Data("DM_HangHoa", sCond);
            ViewData["CountProduct"] = countP;
            ViewData["ListProduct"] = productbyLH;
            return View(pagedList);
        }
    }
}
