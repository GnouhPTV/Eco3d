using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Eco3d_2024.Data;

namespace Web_Eco3d_2024.Compoment
{
    public class MenuViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _db;
        public MenuViewComponent(ApplicationDbContext db)
        {
            _db = db;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            //var test = _db.GetRegSystem("HtmlMenu").Replace("-group", "");
            //ViewData["MenuRegSystem"] = _db.GetRegSystem("HtmlMenu");
            var list = await _db.Reg_System
                                      .FromSqlRaw("SELECT SysValue FROM Reg_System WHERE SysCode='HtmlMenu'").ToListAsync();
            return View("~/Views/Shared/_menuPartialView.cshtml", list);
        }
    }
}
