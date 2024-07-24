using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;
using X.PagedList;

namespace Web_Eco3d_2024.Controllers
{
    public class SearchController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly WebService _webService;
        private static int topValue = 1000;
        public SearchController(ApplicationDbContext db, WebService webService)
        {
            _db = db;
            _webService = webService;
        }
        public async Task<IActionResult> Search(int? page, string? pName)
        {
            int pageSize = 16;
            int pageNumber = page ?? 1;
            int? storedTopValue = HttpContext.Session.GetInt32("TopValue");
            var ListProduct = await _webService.GetListProduct(
            topValue.ToString(), "", $"DM_HangHoa.TinhTrang=1 AND (DM_HangHoa.Ten LIKE N'%{pName}%' OR DM_HangHoa.Ma LIKE '%{pName}%')", "10000", "1");

            IPagedList<ProductStoreModel> pagedList = ListProduct.ToPagedList(pageNumber, pageSize);
            var Count = await _webService.Count_Data("DM_HangHoa", $"TinhTrang=1 AND Ten LIKE N'%{pName}%' OR DM_HangHoa.Ma LIKE '%{pName}%'");
            ViewData["Count"] = Count;
            ViewBag.SearchTen = pName;

            return View(pagedList);
        }
        public async Task<IActionResult> SearchTags(string? linkUrl, int? page)
        {
            int pageSize = 16;
            int pageNumber = page ?? 1;
            int? storedTopValue = HttpContext.Session.GetInt32("TopValue");
            string searchTerm = await _db.Tags_Search
               .Where(t => t.LinkUrl == linkUrl)
               .Select(t => t.Name)
               .FirstOrDefaultAsync();
            var detail = await _db.ProductStoreModels
                .FromSqlRaw("EXEC [dbo].[Product_GetInfo] @Condition", new SqlParameter("@Condition", $"DM_HangHoa.TinhTrang=1 AND DM_HangHoa.Ma IN (SELECT Code FROM Tags WHERE TableName='DM_HangHoa' AND N',' + Value + ',' LIKE N'%,{searchTerm},%')"))
                .ToListAsync();
            var Tintuctag = await _webService.GetNewsList("", topValue.ToString(), $@"News.status=1 AND News.ID IN (SELECT DISTINCT(Code) FROM Tags WHERE Tags.TableName='News' AND Tags.Value Like N'%{searchTerm}')", "5", "1");
            var count = await _db.Counts
              .FromSqlRaw($@"SELECT COUNT(DM_HangHoa.Ma) AS Count FROM DM_HangHoa WHERE DM_HangHoa.TinhTrang = 1 AND DM_HangHoa.Ma IN (SELECT Code FROM Tags WHERE TableName = 'DM_HangHoa' AND N',' + Value + ',' LIKE N'%,{searchTerm},%')")
              .Select(c => c.Count)
              .FirstOrDefaultAsync();
            IPagedList<ProductStoreModel> pagedList = detail.ToPagedList(pageNumber, pageSize);
            var supportlist = await _webService.GetSupport();
            ViewData["support"] = supportlist;
            ViewBag.Count = count;
            ViewBag.SearchTerm = searchTerm;
            ViewData["Tintuctag"] = Tintuctag;
            return View(pagedList);
        }
    }
}
