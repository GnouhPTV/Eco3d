using Microsoft.AspNetCore.Mvc;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;

namespace Web_Eco3d_2024.Component
{
    public class SupportViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _db;
        private readonly WebService _webService;
        public SupportViewComponent(ApplicationDbContext db, WebService webService)
        {
            _db = db;
            _webService = webService;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var supportlist = await _webService.GetSupport();
            return View("~/Views/Shared/_SupportPartialView.cshtml", supportlist);
        }
    }
}
