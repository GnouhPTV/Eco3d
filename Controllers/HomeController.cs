using Data.Models;
using Lib;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;

namespace Web_Eco3d_2024.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly WebService _webService;
        private readonly ApplicationDbContext _dbContext;

        public HomeController(ILogger<HomeController> logger, WebService webService, ApplicationDbContext db)
        {
            _logger = logger;
            _webService = webService;
            _dbContext = db;
        }

        public async Task<IActionResult> Index()
        {
            
            //---------------------Layer Slide--------------------
            var SlideList = new List<SlideModel>();
            var sKeyCached = "SlideList";
            var type = "slide-main";
            if (MemoryCache.GetValue(sKeyCached) != null)
            {
                SlideList = (List<SlideModel>)MemoryCache.GetValue(sKeyCached);
            }
            else
            {
                SlideList = await _webService.GetSlides(type);
                MemoryCache.Add(sKeyCached, SlideList);
            }
            ViewData["SlideModel"] = SlideList;
            //---------------------Layer banner --------------------
            var BannerPano = new List<SlideModel>();
            var sPanoCached = "PanoLink_";
            var type2 = "pano-link";
            if (MemoryCache.GetValue(sPanoCached) != null)
            {
                BannerPano = (List<SlideModel>)MemoryCache.GetValue(sPanoCached);
            }
            else
            {
                BannerPano = await _webService.GetSlides(type2);
                MemoryCache.Add(sPanoCached, BannerPano);
            }
            ViewData["BannerModel"] = BannerPano;
            //---------------------Layer banner CTV --------------------
            var BannerCTV = new List<SlideModel>();
            var type3 = "pano-cong-tac-vien";
            BannerCTV = await _webService.GetSlides(type3);
            ViewData["BannerCTVModel"] = BannerCTV;
            //---------------------Layer Branch --------------------
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
            //---------------------Layer News --------------------
            var NewsHome = new List<NewsModel>();
            var sKeyNewsHome = "LogNewsHome_";
            if (MemoryCache.GetValue(sKeyNewsHome) != null)
            {
                NewsHome = (List<NewsModel>)MemoryCache.GetValue(sKeyNewsHome);
            }
            else
            {
                NewsHome = await _webService.GetNewsHome();
                MemoryCache.Add(sKeyNewsHome, NewsHome);
            }
            ViewData["NewsHomeModel"] = NewsHome;

            ViewData["Description"] = "Công ty TNHH ECO3D chuyên nhập khẩu và phân phối các loại đồ bảo hộ lao động, găng tay, kính, giày ủng bảo hộ, mặt nạ phòng độc chính hãng của nhiều thương hiệu như Honeywell, COV, C&G với các chi nhánh được rải đều toàn quốc. Cơ sở chính trực thuộc Hà Nội";
            return View();
        }
        public async Task<IActionResult> ListCateHome()
        {
            //------------------------Layer CategoryProduct---------------------------
            var CategoryProduct = new List<ParentChildViewModel>();
            var sKeyCateP = "CategoryProduct_";
            int top = 8;
            if (MemoryCache.GetValue(sKeyCateP) != null)
            {
                CategoryProduct = (List<ParentChildViewModel>)MemoryCache.GetValue(sKeyCateP);
            }
            else
            {
                CategoryProduct = _webService.GetParentsAndChildrenById(top);
                MemoryCache.Add(sKeyCateP, CategoryProduct);
            }
            //ViewData["CategoryProduct"] = CategoryProduct;
            return View(CategoryProduct);
        }
        public async Task<IActionResult> LoadHomeIndustry()
        {
            var HomeLinhVuc = new List<LoaiHangModel>();
            var keyLinhvuc = "HomeLinhVuc_";
            if (MemoryCache.GetValue(keyLinhvuc) != null)
            {
                HomeLinhVuc = (List<LoaiHangModel>)MemoryCache.GetValue(keyLinhvuc);
            }
            else
            {
                HomeLinhVuc = await _webService.GetLoaiHang();
                MemoryCache.Add(keyLinhvuc, HomeLinhVuc);
            }
            return View(HomeLinhVuc);
        }
        public async Task<IActionResult> LoadHomeService()
        {
            var HomeService = new List<DM_DichVuModel>();
            var keyService = "HomeService_";
            if (MemoryCache.GetValue(keyService) != null)
            {
                HomeService = (List<DM_DichVuModel>)MemoryCache.GetValue(keyService);
            }
            else
            {
                HomeService = await _webService.GetListService();
                MemoryCache.Add(keyService, HomeService);
            }
            return View(HomeService);
        }
        [HttpGet]
        public async Task<IActionResult> LoadHomeVideo(int top, string type)
        {
            //----------------Layer Video Home----------------------
            var galleryVideo = new List<VideoListModel>();
            var sKeygallery = "GalleryLog_";
            if (MemoryCache.GetValue(sKeygallery) != null)
            {
                galleryVideo = (List<VideoListModel>)MemoryCache.GetValue(sKeygallery);
            }
            else
            {
                galleryVideo = await _webService.GetVideo(top, type);
                MemoryCache.Add(sKeygallery, galleryVideo);
            }
            return View(galleryVideo);
        }
        public IActionResult Privacy()
        {
            return View();
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new Models.ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
