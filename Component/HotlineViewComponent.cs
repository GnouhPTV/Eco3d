using Microsoft.AspNetCore.Mvc;
using Web_Eco3d_2024.Data;

namespace Web_Eco3d_2024.Component
{
    
    public class HotlineViewComponent: ViewComponent
    {
        private readonly ApplicationDbContext _db;
        public HotlineViewComponent(ApplicationDbContext db)
        {
            _db = db;
        }
        public IViewComponentResult Invoke()
        {
            var hotline = Lib.XML.GetHotLine(0);
            //ViewBag.Hotline = hotline;
            return Content(hotline);
        }
    }
}
