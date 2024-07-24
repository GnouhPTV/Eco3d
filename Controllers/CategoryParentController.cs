using Data.Models;
using Data.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;
using X.PagedList;

namespace Web_Eco3d_2024.Controllers
{
    public class CategoryParentController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly WebService _webService;
        private static int topValue = 10000;
        public CategoryParentController(ApplicationDbContext db, WebService webService)
        {
            _dbContext = db;
            _webService = webService;
        }
        public async Task<IActionResult> NganhHang(string linkUrl, string condition, string? listThSo)
        {
            int ID = _dbContext.Category.Where(p => p.LinkUrl == linkUrl && p.TinhTrang).Select(p => p.ID).SingleOrDefault();
            string code = _dbContext.Category.Where(p => p.LinkUrl == linkUrl && p.TinhTrang).Select(p => p.Ma).SingleOrDefault();
            List<string?> listThSoString = new();
            var category = await _webService.GetCategoryByUrl(linkUrl);
            ViewData["CateP"] = category;
            if (category == null)
            {
                return NotFound();
            }
            var childElements = await _webService.GetChildElementsByCategoryId(category.ID);
            List<GroupProductViewModel> listGroupProduct = new();
            foreach (var childElement in childElements)
            {
                var products = await _webService.GetProductsByCategory(childElement.Ma, listThSo);
                listGroupProduct.Add(new GroupProductViewModel()
                {
                    GroupName = childElement.Name,
                    GroupLinkUrl = childElement.LinkUrl,
                    Products = products
                });
            }
            //Tin tức liên quan
            var TinTuc = await _webService.GetNewsList("", topValue.ToString(), $"News.ID IN (SELECT DM_NhomHang_News.IDNew FROM DM_NhomHang_News WHERE 1 <> 1 OR DM_NhomHang_News.IDNhomHang ='{ID}' ) ORDER BY News.CreateDate DESC", "5", "1");
            //Top sản phẩm
            var pNhomHang = from nh in _dbContext.Category
                            where _dbContext.Category.Any(nhChild => nhChild.Ma == category.Ma && nhChild.ID == nh.IDParent && nhChild.TinhTrang)
                            select nh.Ma;
            var maNhom = pNhomHang.ToList();
            var TopProduct = await _webService.GetTopProduct(maNhom);
            ViewData["ListProductTop"] = TopProduct;
            ViewData["listThSo"] = listThSo;
            ViewData["TinTuc"] = TinTuc;
            ViewData["listMenuThSo"] = await _webService.GetMenuThongSoByCode(category.Ma);
            var result = listGroupProduct.Where(a => a.Products.Count != 0).ToList();
            return View(result);
        }
        public async Task<IActionResult> NhomHang(int? page, string? LinkUrl, string? hangsx, string? listThSo)
        {
            int pageSize = 16;
            int pageNumber = page ?? 1;
            int? storedTopValue = HttpContext.Session.GetInt32("TopValue");
            string CondBrand = "";
            string CondThSo = "";
            if (storedTopValue.HasValue)
            {
                topValue = storedTopValue.Value;
            }
            if (!string.IsNullOrEmpty(hangsx))
            {
                ViewData["CodeBrand"] = hangsx;
                CondBrand = $"AND DM_HangHoa.HangSX='{hangsx}'";
            }
            var Childcategory = await _webService.GetCategoryByUrl(LinkUrl);
            ViewData["CateChild"] = Childcategory;
            int ID = _dbContext.Category.Where(p => p.LinkUrl == LinkUrl && p.TinhTrang).Select(p => p.ID).SingleOrDefault();
            string code = _dbContext.Category.Where(p => p.LinkUrl == LinkUrl && p.TinhTrang).Select(p => p.Ma).SingleOrDefault();
            //Top sản phẩm
            var TopProductCate = await _webService.GetTopProductChildCate(code);
            ViewData["ListProductTopCate"] = TopProductCate;

            var listCateChild = await _dbContext.Category.Where(c => c.IDParent == Childcategory.IDParent).ToListAsync();
            ViewData["listCateChild"] = listCateChild;
            var TinTuc = await _webService.GetNewsList("", topValue.ToString(), $"News.ID IN (SELECT DM_NhomHang_News.IDNew FROM DM_NhomHang_News WHERE 1 <> 1 OR DM_NhomHang_News.IDNhomHang ='{ID}' ) ORDER BY News.CreateDate DESC", "5", "1");
            var ListProduct = await _webService.GetListProduct(topValue.ToString(), "", $"DM_HangHoa.TinhTrang=1  AND DM_NhomHang.LinkUrl='{LinkUrl}' {CondBrand} {CondThSo}", "10000", "1");
            var NameCate = await _webService.GetTileCount(topValue.ToString(), $"DM_NhomHang.LinkUrl=N'{LinkUrl}'");
            if (ListProduct != null && ListProduct.Any())
            {
                ViewData["NameGroupParent"] = await _webService.GetNameCategoryParentById(ListProduct[0].IDParent);
                var LinkParent = await _webService.GetLinkCategoryParentById(ListProduct[0].IDParent);
                ViewData["LinkGroupParent"] = LinkParent;
            }
            else
            {
                ViewData["NameGroupParent"] = "";
                ViewData["LinkGroupParent"] = "";
            }
            var ParentCateMa = await _webService.GetMaCategoryParentById(ListProduct[0].IDParent);
            var HangSx = await _dbContext.thongso
                              .FromSqlRaw($"SELECT TOP 20 ROW_NUMBER() OVER(ORDER BY DM_HangSX.ViTri) AS STT, DM_HangSX.Ma AS Id, DM_HangSX.Ten AS Name,ISNULL(DM_HangSX.ImageUrl,'') AS ImageUrl " +
                                           $"FROM DM_HangSX LEFT OUTER JOIN (SELECT HangSX,COUNT(*) AS SoLuong FROM DM_HangHoa WHERE NhomHang=N'{code}' GROUP BY HangSX) HangHoa ON DM_HangSX.Ma=HangHoa.HangSX " +
                                           $"WHERE DM_HangSX.TrangThai=1 AND DM_HangSX.Ma IN (SELECT DISTINCT(HangSX) FROM DM_HangHoa WHERE NhomHang=N'{code}') ")
                              .ToListAsync();
            ViewData["nameCate"] = NameCate;
            ViewData["ListProduct"] = ListProduct;
            ViewData["TinTuc"] = TinTuc;
            ViewData["HangSx"] = HangSx;
            IPagedList<ProductStoreModel> pagedList = ListProduct.ToPagedList(pageNumber, pageSize);
            return View(pagedList);
        }
        public async Task<IActionResult> DetailProduct(string? LinkUrl)
        {
            string code = _dbContext.Products
                             .Where(p => p.LinkUrl == LinkUrl && p.TinhTrang)
                             .Select(p => p.Ma)
                             .SingleOrDefault();
            string NhomHang = _dbContext.Products
                            .Where(p => p.LinkUrl == LinkUrl && p.TinhTrang)
                            .Select(p => p.NhomHang)
                            .SingleOrDefault();
            var Detail = await _dbContext.ProductStoreModels
                 .FromSqlRaw("EXEC [dbo].[Product_GetInfo] @Condition", new SqlParameter("@Condition", $"DM_HangHoa.LinkUrl = N'{LinkUrl}'")).ToListAsync();
            var ProductInfor = Detail[0];
            var urlImages = await _dbContext.ImagePhu.FromSqlRaw($"SELECT * FROM DM_HangHoa_Anh WHERE HangHoa = N'{ProductInfor.Ma}'").ToListAsync();
            var ParentCateName = await _webService.GetNameCategoryParentById(ProductInfor.IDParent);
            var ParentCateLink = await _webService.GetLinkCategoryParentById(ProductInfor.IDParent);
            var TaiLieu = await _dbContext.DM_HangHoa_TaiLieu
                                         .FromSqlRaw($"SELECT DISTINCT Name,UrlLink,ViTri,ISNULL(FileType,'pdf') AS FileType,ISNULL([FileName],'') AS[FileName],ISNULL(FileSize,'**') AS FileSize FROM DM_HangHoa_TaiLieu WHERE Status=1 AND HangHoa LIKE N'{code}' ORDER BY ViTri,Name")
                                         .ToListAsync();
            var HinhAnh = await _dbContext.DM_Anh_ThucTe
                                      .FromSqlRaw($"SELECT TOP 10 ID,HangHoa,ImageUrl FROM DM_Anh_ThucTe WHERE HangHoa=N'{code}' AND TinhTrang=1")
                                      .ToListAsync();
            var NhanVien = await _dbContext.HT_CuaHang
                                           .FromSqlRaw($"SELECT TOP 10 ISNULL(HT_CuaHang.Ten,'') AS Ten, ISNULL(HT_CuaHang.KeToanTruong,'') AS NguoiLienHe, ISNULL(HT_CuaHang.ImageUrl,'') AS ImageUrl, ISNULL(HT_CuaHang.Email,'') AS Email, ISNULL(HT_CuaHang.DienThoai,'') AS DienThoai, ISNULL(HT_CuaHang.DiaChi,'') AS DiaChi, ISNULL(HT_CuaHang.GiamDoc,'') AS NguoiDaiDien, ISNULL(HT_CuaHang.ChucDanh,'') AS ChucDanh " +
                                                        $"FROM HT_CuaHang " +
                                                        $"INNER JOIN Shop_HangHoa ON Shop_HangHoa.IDCuaHang = HT_CuaHang.ID " +
                                                        $"WHERE Shop_HangHoa.HangHoa =N'{code}' " +
                                                        $"AND Shop_HangHoa.NgayDangKy IS NOT NULL AND Shop_HangHoa.TinhTrang = 1 " +
                                                        $"ORDER BY Shop_HangHoa.NgayDangKy;")
                                           .ToListAsync();
            var Giaychungnhan = await _dbContext.GiaiThuong
                                         .FromSqlRaw($"SELECT TOP 3 PERCENT ROW_NUMBER() OVER(ORDER BY ISNULL(DM_Certificate.ViTri,0)) AS STT,ISNULL(DM_Certificate.Description,'') AS Description,ISNULL(DM_Certificate.ViTri,'') AS ViTri,DM_Certificate.ID,ISNULL(DM_Certificate.Name,'') AS Name,ISNULL(DM_Certificate.UrlLink,'') AS UrlLink,ISNULL(DM_Certificate.ImageUrl,'') AS ImageUrl,ISNULL(DM_Certificate.Title,'') AS Title,ISNULL(DM_Certificate.HangSX,'') AS HangSX FROM DM_Certificate")
                                         .ToListAsync();
            var ListProduct = await _webService.GetListProduct(topValue.ToString(), "", $"DM_HangHoa.NhomHang=N'{NhomHang}' AND DM_HangHoa.NhomHang<>'' AND DM_HangHoa.Ma<>N'{code}'", "12", "1");
            var tagsSearch = await _dbContext.Tags_Search
                                  .FromSqlRaw($"SELECT ID, Name, ISNULL(LinkUrl, '') AS LinkUrl " +
                                              $"FROM Tags_Search " +
                                              $"WHERE (SELECT Value FROM Tags WHERE TableName='DM_HangHoa' AND Code= '{code}') LIKE '%' + Name + '%'" +
                                              $"ORDER BY Name;")
                                  .ToListAsync();
            var contentHTML = await _webService.GetContentHTML("HangHoa_vi", code);
            ViewData["ContentHTML"] = contentHTML;
            var BannerCTV = new List<SlideModel>();
            var type3 = "pano-cong-tac-vien";
            BannerCTV = await _webService.GetSlides(type3);
            ViewData["BannerCTVModel"] = BannerCTV;
            var ProductInfor1 = Detail[0];
            string ProductName = ProductInfor1.Ten;
            ViewData["ProductName"] = ProductName;
            string Description = ProductInfor1.Description;
            ViewData["Description"] = Description;
            ViewData["ListImagePhu"] = urlImages;
            ViewData["NhanVien"] = NhanVien;
            ViewData["tagsSearch"] = tagsSearch;
            ViewData["HinhAnh"] = HinhAnh;
            //ViewData["AppProduct"] = AppByProduct;
            ViewData["ListProduct"] = ListProduct;
            ViewData["Giaychungnhan"] = Giaychungnhan;
            //ViewData["NhanVien"] = NhanVien;
            ViewData["ParentCateName"] = ParentCateName;
            ViewData["ParentCateLink"] = ParentCateLink;
            ViewData["TaiLieu"] = TaiLieu;
            return View(ProductInfor);
        }
        public async Task<IActionResult> CateList()
        {
            // Gọi đến service để lấy dữ liệu
            int top = 100;
            var viewModelList = _webService.GetParentsAndChildrenById(top);
            return View(viewModelList);
        }
        public async Task<IActionResult> ThuongHieu(string? LinkUrl)
        {
            //string mahangsx = _dbContext.HangSX.Where(p => p.LinkUrl == linkUrl).Select(p => p.Ma).SingleOrDefault();
            string linkUrlLower = LinkUrl.ToLower();
            string mahangsx = _dbContext.HangSX
                                       .Where(p => p.LinkUrl == linkUrlLower)
                                       .Select(p => p.Ma)
                                       .SingleOrDefault();
            string Namehangsx = _dbContext.HangSX
                                      .Where(p => p.LinkUrl == linkUrlLower)
                                      .Select(p => p.Ten)
                                      .SingleOrDefault();
            var TenHangSx = await _dbContext.Category
                          .FromSqlRaw($"SELECT TOP 20 ROW_NUMBER() OVER(ORDER BY ViTri) AS STT, ID,ISNULL(LinkUrl,'') AS LinkUrl, ISNULL(Ma,'') AS Ma,ISNULL(Ten,'') AS Ten, ISNULL(ImageUrl,'') AS ImageUrl, ISNULL(IconUrl,'') AS IconUrl, ISNULL(BannerUrl,'') AS BannerUrl, ISNULL(IDParent,'') AS IDParent, ISNULL(Title,'') AS Title , ISNULL(Description,'') AS Description , ISNULL(MoTaHangHoa,'') AS MoTaHangHoa , ISNULL(TinhTrang,'') AS TinhTrang, ISNULL(Mota,'') AS Mota, ISNULL(ViTri,'') AS ViTri FROM DM_NhomHang " +
                                        $"WHERE TinhTrang = 1 AND ISNULL(IDParent,0) <> 0 AND Ma IN (SELECT distinct(NhomHang) " +
                                       $"FROM DM_HangHoa WHERE HangSX=N'{mahangsx}')")
                          .ToListAsync();
            var ListProduct = await _webService.GetListProduct(topValue.ToString(), "", $"DM_HangHoa.TinhTrang=1  AND DM_HangHoa.HangSX='{mahangsx}'", "10000", "1");
            ViewBag.LinkUrl = LinkUrl;
            ViewData["TenHangSx"] = TenHangSx;
            ViewData["Namehangsx"] = Namehangsx;
            ViewData["ListProduct"] = ListProduct;
            return View(TenHangSx);
        }

    }
}
