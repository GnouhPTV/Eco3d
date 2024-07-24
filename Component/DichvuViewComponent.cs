using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Eco3d_2024.Data;

namespace Web_Eco3d_2024.Component
{
    public class DichvuViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _db;
        public DichvuViewComponent(ApplicationDbContext db)
        {
            _db = db;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var dv = await _db.DM_DichVu
                                      .FromSqlRaw("SELECT * FROM DM_DichVu").ToListAsync();
            return View("~/Views/Shared/Menudichvu.cshtml", dv);
        }
    }
}
