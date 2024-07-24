using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;

namespace Web_Eco3d_2024.Controllers
{
    public class GioiThieuController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly WebService _webService;
        private static int topValue = 1000;
        public GioiThieuController(ApplicationDbContext db, WebService webService)
        {
            _db = db;
            _webService = webService;
        }
        public async Task<IActionResult> GioiThieu()
        {
            return View();
        }
        public async Task<IActionResult> GiayChungNhan()
        {
            var GiaiThuong = await _db.GiaiThuong
           .FromSqlRaw("SELECT * FROM DM_Certificate WHERE TinhTrang=1 ORDER BY ViTri")
           .ToListAsync();
            var Count = await _db.Counts
           .FromSqlRaw("SELECT COUNT(*) AS Count FROM DM_Certificate")
           .ToListAsync();
            var List = new GioiThieuList
            {
                GiaiThuong = GiaiThuong,
                Counts = Count

            };
            return View(List);
        }
        public async Task<IActionResult> TaiLieu()
        {
            var TaiLieu = await _db.DMTaiLieu
            .FromSqlRaw("SELECT TOP 50 DM_TaiLieu.ID, ISNULL(DM_TaiLieu.ImageUrl,'') AS ImageUrl, ISNULL(DM_TaiLieu.FileName,'') AS FileName,ISNULL(DM_TaiLieu.UrlLink,'') AS UrlLink,DM_TaiLieu.Name FROM DM_TaiLieu INNER JOIN DM_Nhom_TaiLieu ON DM_TaiLieu.Nhom=DM_Nhom_TaiLieu.Ma LEFT OUTER JOIN DM_Loai_TaiLieu ON DM_TaiLieu.Loai=DM_Loai_TaiLieu.Ma WHERE DM_TaiLieu.Status=0 AND DM_TaiLieu.Loai=N'L0014' ORDER BY Date DESC")
            .ToListAsync();
            var TinTucList = await _webService.GetNewsList("", topValue.ToString(), "News.Status=1 AND News.NewsType !=',tin-tuyen-dung,'AND News.NewsType !=',tin-he-thong,'", "5", "1");
            ViewData["TinTucList"] = TinTucList;
            return View(TaiLieu);
        }
    }
}
