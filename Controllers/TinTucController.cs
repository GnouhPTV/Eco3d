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
    public class TinTucController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly WebService _webService;
        private static int topValue = 2000;
        public TinTucController(ApplicationDbContext db, WebService webService)
        {
            _db = db;
            _webService = webService;
        }
        public async Task<IActionResult> TinTuc(int? page, string newsType, string Name)
        {
            int pageSize = 10;
            int pageNumber = page ?? 1;
            var Condition = $"News.Status=1 AND News.NewsType NOT IN (',tin-tuyen-dung,', ',tin-he-thong,') AND Name LIKE N'%" + Name + "%'";
            int? storedTopValue = HttpContext.Session.GetInt32("TopValue");

            if (storedTopValue.HasValue)
            {
                topValue = storedTopValue.Value;
            }
            var ListNew = await _webService.GetNewsList("", topValue.ToString(), Condition, topValue.ToString(), "1");
            var TinTucList = await _webService.GetNewsList("", topValue.ToString(), "News.Status=1 AND News.NewsType !=',tin-tuyen-dung,' AND News.NewsType !=',tin-he-thong,'", "5", "1");
            ViewData["TinTucList"] = TinTucList;
            IPagedList<NewsModel> pagedList = ListNew.ToPagedList(pageNumber, pageSize);
            var News = new List<NewsModel>();
            var sKeyCached = "News";
            if (MemoryCache.GetValue(sKeyCached) != null)
            {
                News = (List<NewsModel>)MemoryCache.GetValue(sKeyCached);
            }
            else
            {
                News = ListNew;
                MemoryCache.Add(sKeyCached, News);
            }

            return View(pagedList);
        }
        public async Task<IActionResult> TinTucList(string newsType, int? page)
        {
            int pageSize = 10;
            int pageNumber = page ?? 1;
            int? storedTopValue = HttpContext.Session.GetInt32("TopValue");

            if (storedTopValue.HasValue)
            {
                topValue = storedTopValue.Value;
            }
            var ListNew = await _webService.GetNewsList("", topValue.ToString(), $"News.Status=1 AND NewsType=',{newsType},'", "10000", "1");
            var TinTucList = await _webService.GetNewsList("", topValue.ToString(), "News.Status=1 AND News.NewsType !=',tin-tuyen-dung,'AND News.NewsType !=',tin-he-thong,'", "5", "1");
            ViewData["TinTucList"] = TinTucList;

            IPagedList<NewsModel> pagedList = ListNew.ToPagedList(pageNumber, pageSize);

            return View(pagedList);
        }
        public async Task<IActionResult> TinTucDetail(string? LinkHref, BinhLuan model)
        {
            var Detail = await _db.Newss
                .FromSqlRaw("EXEC [dbo].[News_Detail] @LinkHref", new SqlParameter("@LinkHref", LinkHref))
                .ToListAsync();

            //if (Detail.Any())
            //{
            //    var newsDetail = Detail.First();
            //    var newsId = newsDetail.ID;
            //    await _db.Database.ExecuteSqlRawAsync("EXEC [dbo].[Increment_News_ViewCount] @NewsID", new SqlParameter("@NewsID", newsId));
            //    HttpContext.Session.SetString("CountNewsDetail" + newsId, "viewed");
            //}
            var NewsInfor = Detail[0];
            string NameNews = NewsInfor.Name;
            string ImageNews = NewsInfor.ImageLink;
            string SeoDescription = NewsInfor.SeoDescription;
            ViewData["NameNews"] = NameNews;
            ViewData["Image"] = ImageNews;
            ViewData["SeoDescription"] = SeoDescription;
            //Get_HTML Content
            var contentHTML = await _webService.GetContentHTML("News_vi", NewsInfor.ID.ToString());
            ViewData["ContentHTML"] = contentHTML;

            var relatednews = await _webService.GetNewsList("", "30", "News.Status=1 AND News.NewsType !=',tin-tuyen-dung,' AND News.NewsType !=',tin-he-thong,'", "5", "1");
            var viewModel = new DetailList
            {
                NewsDetail = Detail,
                NewsList = relatednews,
                LinkHref = LinkHref
            };
            return View(viewModel);
        }
    }
}