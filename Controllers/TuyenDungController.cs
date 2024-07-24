using Data.Models;
using Lib;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;
using X.PagedList;

namespace Web_Eco3d_2024.Controllers
{
    public class TuyenDungController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly WebService _webService;
        private readonly EmailService _emailService;
        private static int topValue = 10000;
        public TuyenDungController(ApplicationDbContext db, WebService webService, EmailService emailService)
        {
            _db = db;
            _webService = webService;
            _emailService = emailService;
        }
        public async Task<IActionResult> TuyenDung(int? page, string Name)
        {
            int pageSize = 10;
            int pageNumber = page ?? 1;
            int? storedTopValue = HttpContext.Session.GetInt32("TopValue");

            if (storedTopValue.HasValue)
            {
                topValue = storedTopValue.Value;
            }

            var TuyenDung = await _webService.GetNewsList("", topValue.ToString(), "News.Status=1 AND News.NewsType =',tin-tuyen-dung,' AND Name LIKE N'%" + Name + "%'", "10000", "1");
            var NganhTuyenDung = await _db.NganhTuyenDung.FromSqlRaw("SELECT * FROM TuyenDung_Nghanh WHERE TinhTrang=1").ToListAsync();
            ViewData["NganhTuyenDung"] = NganhTuyenDung;

            IPagedList<NewsModel> pagedList = TuyenDung.ToPagedList(pageNumber, pageSize);
            var BannerCTV = new List<SlideModel>();
            var type3 = "pano-cong-tac-vien";
            BannerCTV = await _webService.GetSlides(type3);
            ViewData["BannerCTVModel"] = BannerCTV;
            var TuyenDung1 = new List<NewsModel>();
            var sKeyCached = "TuyenDung";
            if (MemoryCache.GetValue(sKeyCached) != null)
            {
                TuyenDung1 = (List<NewsModel>)MemoryCache.GetValue(sKeyCached);
            }
            else
            {
                TuyenDung1 = TuyenDung;
                MemoryCache.Add(sKeyCached, TuyenDung1);
            }
            var BranchList = new List<HangsxModel>();
            var sBranchCached = "BranchList_";
            if (MemoryCache.GetValue(sBranchCached) != null)
            {
                BranchList = (List<HangsxModel>)MemoryCache.GetValue(sBranchCached);
            }
            else
            {
                BranchList = await _webService.GetListBrand();
                MemoryCache.Add(sBranchCached, BranchList);
            }
            ViewData["BranchListModel"] = BranchList;
            return View(pagedList);
        }
        public async Task<IActionResult> TuyenDungDetail(string? LinkHref, BinhLuan model)
        {
            var Detail = await _db.Newss
                .FromSqlRaw("EXEC [dbo].[News_Detail] @LinkHref", new SqlParameter("@LinkHref", LinkHref))
                .ToListAsync();
            var TuyenDungList = await _webService.GetNewsList("", "30", "News.Status=1 AND News.NewsType =',tin-tuyen-dung,'", "5", "1");

            var viewModel = new DetailList
            {
                NewsDetail = Detail,
                LinkHref = LinkHref,
                NewsList = TuyenDungList
            };
            var NewsInfor = Detail[0];
            string NameNews = NewsInfor.Name;
            ViewData["Nametuyendung"] = NameNews;
            var BannerCTV = new List<SlideModel>();
            var type3 = "pano-cong-tac-vien";
            BannerCTV = await _webService.GetSlides(type3);
            ViewData["BannerCTVModel"] = BannerCTV;
            var BranchList = new List<HangsxModel>();
            var sBranchCached = "BranchList_";
            if (MemoryCache.GetValue(sBranchCached) != null)
            {
                BranchList = (List<HangsxModel>)MemoryCache.GetValue(sBranchCached);
            }
            else
            {
                BranchList = await _webService.GetListBrand();
                MemoryCache.Add(sBranchCached, BranchList);
            }
            var contentHTML = await _webService.GetContentHTML("News_vi", NewsInfor.ID.ToString());
            ViewData["ContentHTML"] = contentHTML;
            ViewData["BranchListModel"] = BranchList;
            return View(viewModel);
        }
        public async Task<IActionResult> NopHoSo()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendEmailNopHoSo([FromBody] NophosoModel model)
        {
            var result = await _emailService.SendEmailNopHoSo(model.HoTen, model.Email, model.DiaChi, model.ChucVu, model.DienThoai, model.NgaySinh, model.GioiTinh, model.HocVan, model.LinkCV);

            if (result == 1)
            {
                return Content("1");
            }
            return Content("Failed to send email");
        }
        [HttpGet]
        public async Task<IActionResult> Search(string Name)
        {
            var TuyenDung = await _webService.GetNewsList("", "30", "News.Status=1 AND News.NewsType =',tin-tuyen-dung,' AND Name LIKE N'%" + Name + "%'", "500", "1");
            return Json(TuyenDung);
        }
    }
}
