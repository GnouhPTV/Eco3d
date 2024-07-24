using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;

namespace Web_Eco3d_2024.Controllers
{
    public class DichVuController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly WebService _webService;
        private static int topValue = 1000;
        public DichVuController(ApplicationDbContext db, WebService webService)
        {
            _db = db;
            _webService = webService;
        }
        public async Task<IActionResult> DichVuDetail(string LinkUrl)
        {
            int ID = _db.DM_DichVu
                        .Where(p => p.LinkUrl == LinkUrl && p.TinhTrang)
                        .Select(p => p.ID)
                        .SingleOrDefault();

            var TinTucList = await _webService.GetNewsList("", topValue.ToString(), "News.Status=1 AND News.NewsType !=',tin-tuyen-dung,'AND News.NewsType !=',tin-he-thong,'", "5", "1");
            var DichVu = await _db.DM_DichVu
            .FromSqlRaw($"SELECT * FROM DM_DichVu WHERE ID= " + ID + " ORDER BY ViTri")
            .ToListAsync();
            var DichVuKhac = await _db.DM_DichVu
            .FromSqlRaw($"SELECT * FROM DM_DichVu WHERE ID != " + ID + " ORDER BY ViTri")
            .ToListAsync();
            var BangGia_Loai = await _db.DM_BangGia_Loai
            .FromSqlRaw($"SELECT * FROM DM_BangGia_Loai  WHERE ID_DichVu= " + ID + " ORDER BY ViTri")
            .ToListAsync();
            var BangGia = await _db.DM_BangGia
            .FromSqlRaw($"SELECT * FROM DM_BangGia ORDER BY ViTri")
            .ToListAsync();
            ViewData["Title"] = _db.DM_DichVu
                        .Where(p => p.LinkUrl == LinkUrl && p.TinhTrang)
                        .Select(p => p.Ten)
                        .SingleOrDefault();
            ViewData["MoTa"] = _db.DM_DichVu
                       .Where(p => p.LinkUrl == LinkUrl && p.TinhTrang)
                       .Select(p => p.MoTa)
                       .SingleOrDefault();
            ViewData["Image"] = _db.DM_DichVu
                       .Where(p => p.LinkUrl == LinkUrl && p.TinhTrang)
                       .Select(p => p.ImageUrl)
                       .SingleOrDefault();
            ViewData["DichVu"] = DichVu;
            ViewData["DichVuKhac"] = DichVuKhac;
            ViewData["BangGia"] = BangGia;
            ViewData["BangGia_Loai"] = BangGia_Loai;
            ViewData["TinTucList"] = TinTucList;
            return View();
        }
    }
}
