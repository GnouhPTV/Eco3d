using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;
using X.PagedList;

namespace Web_Eco3d_2024.Controllers
{
    public class VideoController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly WebService _webService;
        private static int topValue = 1000;
        public VideoController(WebService webService, ApplicationDbContext db)
        {
            _webService = webService;
            _db = db;
        }
        public async Task<IActionResult> videolist(int? page)
        {
            int pageSize = 6;
            int pageNumber = page ?? 1;
            int? storedTopValue = HttpContext.Session.GetInt32("TopValue");

            if (storedTopValue.HasValue)
            {
                topValue = storedTopValue.Value;
            }
            //var ListImg = await _webService.GetIMG();
            //IPagedList<ListMediaModel> pagedList = ListImg.ToPagedList(pageNumber, pageSize);

            var ListVideo = await _webService.GetVideo();
            IPagedList<ListMediaModel> pagedListVideo = ListVideo.ToPagedList(pageNumber, pageSize);
            ViewData["VideoList"] = pagedListVideo;

            return View(pagedListVideo);
        }
    }
}
