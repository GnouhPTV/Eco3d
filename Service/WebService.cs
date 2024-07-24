using Data;
using Data.Models;
using Data.ViewModel;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Data;
using System.Data.SqlTypes;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Models;


namespace Web_Eco3d_2024.Service
{
    public class WebService
    {
        private readonly ApplicationDbContext _db;
        private readonly AppSetting _appSettings;
        private readonly IWebHostEnvironment _env;
        public WebService(IOptions<AppSetting> appSettings, ApplicationDbContext dbContext, IWebHostEnvironment env)
        {
            _appSettings = appSettings.Value;
            _db = dbContext;
            _env = env;
        }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddMemoryCache();
        }
        public async Task<string> GetMenu()
        {
            var MenuRegSystem = _db.GetRegSystem("HtmlMenu");
            return MenuRegSystem;
        }
        //Get List Danh Muc Nhom
        public List<ParentChildViewModel> GetParentsAndChildrenById(int top)
        {
            // Lấy thông tin của phần tử cha
            var Parents = _db.CategoryParents.CategorySP(top, "DM_NhomHang.TinhTrang=1 AND DM_NhomHang.IDParent =0").ToList();
            // Tạo đối tượng ParentChildViewModel và truyền dữ liệu
            var result = new List<ParentChildViewModel>();
            // Duyệt qua từng phần tử cha và lấy các phần tử con của nó
            foreach (var parent in Parents)
            {
                //var children = _db.Category.Where(c => c.ID == parent.ID).ToList();
                var children = _db.CategoryStored.CategorySP(100, "DM_NhomHang.TinhTrang=1 AND DM_NhomHang.IDParent =" + parent.ID).ToList();

                // Tạo đối tượng ParentChildViewModel và thêm vào danh sách kết quả
                var viewModel = new ParentChildViewModel
                //.SetCountHangHoaFromStoredProcedure(children);
                {
                    Parent = parent,
                    Children1 = children
                };
                result.Add(viewModel);
            }
            return result;
        }
        public async Task<List<SlideModel>> GetSlides(string type)
        {
            return await _db.Slides.TableSlideStoredProcedure(5, $"DM_Slide.SlideType=N'{type}'").ToListAsync();
        }
        public async Task<List<HangsxModel>> GetListBrand()
        {
            TableListPage paramBranch = new TableListPage()
            {
                TableName = "DM_HangSX",
                Order = "ORDER BY ID DESC",
                Select = "",
                Condition = "DM_HangSX.TinhTrang=1 AND DM_HangSX.TrangChu=1",
                PageSize = 15,
                PageIndex = 1,
            };

            var a = await _db.Brand.TableListPageStoredProcedure(paramBranch).ToListAsync();
            return a;
        }
        public async Task<List<CategoryModel>> GetCategoryParent()
        {
            return await _db.Category.CategorySP(1000, "DM_NhomHang.TinhTrang=1 AND DM_NhomHang.IDParent = 0").ToListAsync();
        }
        public async Task<CategoryModel?> GetCategoryByUrl(string url)
        {
            var CateParent = await _db.Category.FirstOrDefaultAsync(u => u.LinkUrl == url);
            return CateParent;
        }
        public async Task<List<LoaiHangModel>> GetLoaiHang()
        {
            var listLH = await _db.LoaiHang.LoaiHangList("DM_LoaiHang.TinhTrang=1 AND DM_LoaiHang.HienThi LIKE N'%trang-chu%'").ToListAsync();
            return listLH;
        }
        public async Task<LoaiHangModel?> GetUrlByLoaiHang(string url)
        {
            var LinkLoaiHang = await _db.LoaiHang.FirstOrDefaultAsync(u => u.UrlLink == url);
            return LinkLoaiHang;
        }
        public async Task<List<ProductStoreModel>> GetProductByLoaiHang(string code)
        {
            string sCond = "DM_HangHoa.TinhTrang=1 AND DM_HangHoa.Ma IN (SELECT HangHoa FROM LoaiHang_HangHoa WHERE LoaiHang=N'" + code + "' AND TrangThai=1)";
            var rePLH = await _db.ProductStoreModels.Product_List("1000", "", sCond, "16", "1").ToListAsync();
            return rePLH;
        }
        public async Task<List<ProductStoreModel>> GetTopProduct(List<string> maNhom)
        {
            string sCond = "DM_HangHoa.TinhTrang=1 AND DM_HangHoa.NhomHang IN (" + string.Join(",", maNhom.Select(ma => "'" + ma + "'")) + ")";
            var producttoplist = await _db.ProductStoreModels.Product_List("5", "", sCond, "5", "1").ToListAsync();
            return producttoplist;
        }
        public async Task<List<ProductStoreModel>> GetTopProductChildCate(string maNhom)
        {
            string sCond = $"DM_HangHoa.TinhTrang = 1 AND DM_HangHoa.NhomHang IN ('{maNhom}')";
            var producttoplist = await _db.ProductStoreModels.Product_List("5", "", sCond, "5", "1").ToListAsync();
            return producttoplist;
        }
        public async Task<List<DM_DichVuModel>> GetListService()
        {
            var service = await _db.DM_DichVu.Where(s => s.TinhTrang == true).Take(10).ToListAsync();
            return service;

        }
        public async Task<List<VideoListModel>> GetVideo(int top, string type)
        {
            var kq = await _db.VideoList.GetVideo_List(top, "tblVideo.Status=1", "5", "1").ToListAsync();
            return kq;
        }
        public async Task<List<NewsModel>> GetNewsHome()
        {
            return await _db.NewsHome.NewsSP("", 9, "News.Status=1 AND News.NewsType !=',tin-tuyen-dung,' AND News.NewsType !=',gioi-thieu,' AND News.NewsType !=',tin-he-thong,'", "5", "1").ToListAsync();
        }
        public async Task<List<ListMediaModel>> GetVideo()
        {
            TableListPage paramVideo = new TableListPage()
            {
                TableName = "tblVideo",
                Order = "ORDER BY CreateDate DESC",
                Select = "",
                Condition = " ISNULL(tblVideo.VideoUrl,'') <> '' AND  ISNULL(tblVideo.ImageUrl,'') <> '' ",
                PageSize = 8,
                PageIndex = 1,
            };
            return await _db.ListMedia.TableListPageStoredProcedure(paramVideo).ToListAsync();
        }
        public async Task<List<ListMediaModel>> GetIMG()
        {
            TableListPage paramVideo = new TableListPage()
            {
                TableName = "tblVideo",
                Order = "ORDER BY CreateDate DESC",
                Select = "",
                Condition = "Status = 1 AND (ISNULL(tblVideo.VideoUrl,'') =  '') ",
                PageSize = 8,
                PageIndex = 1,
            };
            var a = await _db.ListMedia.TableListPageStoredProcedure(paramVideo).ToListAsync();
            return a;
        }
        public async Task<List<SupportViewModel>> GetSupport()
        {
            var result = await _db.supportnv.SupportList(10).ToListAsync();
            return result;
        }
        public string GetValueProduct(Func<IQueryable<ProductModel>, IQueryable<object>> queryBuilder)
        {
            try
            {
                var query = queryBuilder(_db.Set<ProductModel>());
                var result = query.FirstOrDefault();
                if (result != null)
                {
                    var value = result.GetType().GetProperty("DataJson")?.GetValue(result)?.ToString();
                    return value ?? "";
                }
                return "";
            }
            catch (Exception)
            {
                return "";
            }
        }
        public async Task<string> GetNameNews(int id)
        {
            var NewsName= await _db.Newss.FirstOrDefaultAsync(u => u.ID == id);
            return NewsName?.Name ?? "";
        }
        public async Task<List<NewsModel>> GetNewsList(string order, string top, string condition, string pageSize, string pageIndex)
        {
            SqlParameter OrderParam = new SqlParameter("@Order", order);
            SqlParameter TopParam = new SqlParameter("@Top", top);
            SqlParameter ConditionParam = new SqlParameter("@Condition", condition);
            SqlParameter PageSizeParam = new SqlParameter("@PageSize", pageSize);
            SqlParameter PageIndexParam = new SqlParameter("@PageIndex", pageIndex);

            return await _db.Newss
                    .FromSqlRaw("EXEC [dbo].[News_List] @Order, @Top, @Condition, @PageSize, @PageIndex",
                                OrderParam, TopParam, ConditionParam, PageSizeParam, PageIndexParam)
                    .ToListAsync();
        }
        public async Task<List<ChiNhanhModel>> GetMember()
        {
            return await _db.Branch.BranchSP(6, "DM_ChiNhanh.TinhTrang=1").ToListAsync();
        }
        public async Task<List<ChiNhanhModel>> GetChinhanh(string top, string condition)
        {
            SqlParameter TopParam = new SqlParameter("@Top", top);
            SqlParameter ConditionParam = new SqlParameter("@Condition", condition);

            return await _db.Branch
                    .FromSqlRaw("EXEC [dbo].[DM_ChiNhanh_List]  @Top , @Condition",
                                 TopParam, ConditionParam)
                    .ToListAsync();
        }
        public async Task<List<ProductStoreModel>> GetListProduct(string top, string order, string condition, string pageSize, string pageIndex)
        {
            SqlParameter TopParam = new SqlParameter("@Top", top);
            SqlParameter OrderParam = new SqlParameter("@OrderBy", order);
            SqlParameter ConditionParam = new SqlParameter("@Condition", condition);
            SqlParameter PageSizeParam = new SqlParameter("@PageSize", pageSize);
            SqlParameter PageIndexParam = new SqlParameter("@PageIndex", pageIndex);

            return await _db.ProductStoreModels
                    .FromSqlRaw("EXEC [dbo].[Product_List]  @Top, @OrderBy , @Condition, @PageSize, @PageIndex",
                                 TopParam, OrderParam, ConditionParam, PageSizeParam, PageIndexParam)
                    .ToListAsync();
        }
        public async Task<List<CountModel>> Count_Data(string table, string condition)
        {
            SqlParameter TableParam = new SqlParameter("@Table", table);
            SqlParameter ConditionParam = new SqlParameter("@Condition", condition);

            return await _db.Counts
                    .FromSqlRaw("EXEC [dbo].[Count_Data] @Table, @Condition",
                                TableParam, ConditionParam)
                    .ToListAsync();
        }
        public async Task<string> GetNameCategoryParentById(int idParent)
        {
            var CateParent = await _db.Category.FirstOrDefaultAsync(c => c.ID == idParent);
            return CateParent?.Name ?? "";
        }
        public async Task<string> GetMaCategoryParentById(int idParent)
        {
            var CateParentMa = await _db.Category.FirstOrDefaultAsync(c => c.ID == idParent);
            return CateParentMa?.Ma ?? "";
        }
        public async Task<string?> GetLinkCategoryParentById(short idParent)
        {
            var CateParentLink = await (from c in _db.Category select c).FirstOrDefaultAsync(c => c.ID == idParent);
            return CateParentLink?.LinkUrl ?? "";
        }
        public async Task<string> GetNameByLinkUrl(string linkUrl)
        {
            var name = await _db.Tags_Search
                .Where(t => t.LinkUrl == linkUrl)
                .Select(t => t.Name)
                .FirstOrDefaultAsync();

            return name ?? string.Empty;
        }
        public async Task<List<CategoryModel>> GetInfoCategory()
        {
            return await _db.Category.CategorySP(1000, "DM_NhomHang.TinhTrang=1 AND DM_NhomHang.IDParent != 0").ToListAsync();
        }
        public async Task<List<CategoryParentModel>> GetTileCount(string top, string condition)
        {
            SqlParameter TopParam = new SqlParameter("@Top", top);
            SqlParameter ConditionParam = new SqlParameter("@Condition", condition);

            return await _db.CategoryParents
                    .FromSqlRaw("EXEC [dbo].[NhomHang_List]  @Top , @Condition",
                                 TopParam, ConditionParam)
                    .ToListAsync();
        }
        public async Task<List<CategoryModel>> GetChildElementsByCategoryId(int categoryId)
        {
            var childElements = await _db.CategoryChildren.Where(e => e.IDParent == categoryId && e.TinhTrang == true).ToListAsync();
            return childElements;
        }
        //public async Task<List<ProductModel>> GetProductsByCategory(string categoryCode, string listThSo)
        //{
        //    var listCodeProduct = GetListCodeProductByThSoLinQ(listThSo);
        //    List<ProductModel> products = new();
        //    if (listThSo == null)
        //    {
        //        products = await _db.Products.Where(e => e.NhomHang == categoryCode && e.TinhTrang == true).Take(8).ToListAsync();
        //    }
        //    else
        //    {
        //        products = await _db.Products.Where(e => e.NhomHang == categoryCode && e.TinhTrang == true && listCodeProduct.Contains(e.Ma)).ToListAsync();
        //    }
        //    return products;
        //}

        public async Task<List<ProductModel>> GetProductsByCategory(string categoryCode, string listThSo)
        {
            List<ProductModel> products = new();
            try
            {
                var listCodeProduct = GetListCodeProductByThSoLinQ(listThSo);
                if (listThSo == null)
                {
                    products = await _db.Products.Where(e => e.NhomHang == categoryCode && e.TinhTrang == true).Take(8).ToListAsync();
                }
                else
                {
                    products = await _db.Products.Where(e => e.NhomHang == categoryCode && e.TinhTrang == true && listCodeProduct.Contains(e.Ma)).ToListAsync();
                }
            }
            catch (SqlNullValueException ex)
            {
                // Handle the SqlNullValueException
                Console.WriteLine("Error: " + ex.Message);
            }
            catch (Exception ex)
            {
                // Handle any other exceptions
                Console.WriteLine("Error: " + ex.Message);
            }
            return products;
        }

        //public async Task<List<ProductStoreModel>> GetProductsByCategoryStore(string categoryCode, string listThSo)
        //{
        //    var listCodeProduct = GetListCodeProductByThSoLinQ(listThSo);
        //    List<ProductStoreModel> products2 = new();
        //    if (listThSo == null)
        //    {
        //        products2 = await _db.Products.Where(e => e.NhomHang == categoryCode).Take(8).ToListAsync();
        //        products2 = await _db.ProductStoreModels.Where(e => e.NhomHang == categoryCode).Take(8).ToListAsync();
        //    }
        //    else
        //    {
        //        products2 = await _db.Products.Where(e => e.NhomHang == categoryCode && listCodeProduct.Contains(e.Ma)).ToListAsync();
        //    }
        //    return products2;
        //}
        public List<string?> GetListCodeProductByThSoLinQ(string listThongSo)
        {
            List<string?> result = new();
            if (!string.IsNullOrEmpty(listThongSo))
            {
                List<int> listThSoInt = listThongSo.Split(',').Select(int.Parse).ToList();
                result = _db.HHTSDetails.Where(t => listThSoInt.Contains(t.ID_ThongSo_ChiTiet)).Select(t => t.HangHoa).ToList();
            }
            return result;
        }
        public async Task<List<ListMNThongSoViewModel>> GetMenuThongSoByCode(string maNhom)
        {
            var listMN = new List<ListMNThongSoViewModel>();
            var listNhomHangTTCT = new List<LabelThongSoViewModel>();
            if (!string.IsNullOrEmpty(maNhom))
            {
                listNhomHangTTCT = await _db.LabelTS.Where(a => (a.NhomHang == maNhom || a.MaNhom_Add.Contains(maNhom)) && a.bSoSanh == true).ToListAsync();
            }
            else
            {
                listNhomHangTTCT = await _db.LabelTS.Where(a => a.NhomHang == maNhom && a.bSoSanh == true).ToListAsync();
            }

            foreach (var item in listNhomHangTTCT)
            {
                var listValue = _db.TSDetails.Where(a => a.ID_ThongSo == item.ID).OrderBy(a => a.ViTri).Select(a => new TSCT() { ID = a.Id, GiaTri = a.GiaTri }).ToList();
                listMN.Add(new ListMNThongSoViewModel()
                {
                    ID = item.ID,
                    TenThongSo = item.TenThongSo,
                    TSCT = listValue
                });
            }
            return listMN;
        }
        public async Task<ProductModel?> GetProductByCode(string Code)
        {
            return await _db.Products.FirstOrDefaultAsync(p => p.Ma == Code);
        }
        public async Task<string> GetContentHTML(string type, string itemid)
        {
            var content = await _db.HTMLContent
            .Where(e => e.Type == type && e.ItemID == itemid)
            .Select(e => e.HTML)
            .FirstOrDefaultAsync();
            return content;
        }
    }
}
