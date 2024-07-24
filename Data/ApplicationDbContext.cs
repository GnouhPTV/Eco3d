using Data.Models;
using Data.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace Web_Eco3d_2024.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<SystemDataModel> SystemData { get; set; }
        public DbSet<NewsModel> Newss { get; set; }
        public DbSet<HTContentModel> HTMLContent { get; set; }
        public DbSet<BinhLuan> BinhLuans { get; set; }
        public DbSet<SlideModel> Slides { get; set; }
        public DbSet<CategoryParentModel> CategoryParents { get; set; }
        public DbSet<CategoryModel> Category { get; set; }
        public DbSet<LoaiHangModel> LoaiHang { get; set; }
        public DbSet<NhomHangStoredModel> CategoryStored { get; set; }
        public DbSet<CategoryModel> CategoryChildren { get; set; }
        public DbSet<CateTest> CateTest { get; set; }
        public DbSet<ChiNhanhModel> Branch { get; set; }
        public DbSet<ListMediaModel> ListMedia { get; set; }
        public DbSet<DoiTacModel> Partner { get; set; }
        public DbSet<NewsModel> NewsHome { get; set; }
        public DbSet<NuocSX> NuocSX { get; set; }
        public DbSet<NuocSXLQModel> NuocSXLQ { get; set; }
        public DbSet<HangsxModel> HangSX { get; set; }
        public DbSet<CountModel> Counts { get; set; }
        public DbSet<CertificateModel> GiaiThuong { get; set; }
        public DbSet<DuAnModel> DuAn { get; set; }
        public DbSet<ProductModel> Products { get; set; }
        public DbSet<HangsxModel> Brand { get; set; }
        public DbSet<ProductStoreModel> ProductStoreModels { get; set; }
        public DbSet<NhanVienModel> NhanVien { get; set; }
        public DbSet<ChucVuModel> Chucvu { get; set; }
        public DbSet<SupportViewModel> supportnv { get; set; }
        public DbSet<tblDanhMucModel> DanhMuc { get; set; }
        public DbSet<LabelThongSoViewModel> LabelTS { get; set; }
        public DbSet<HangHoaThongSoModel> HHTSDetails { get; set; }
        public DbSet<ThongSoChiTietModel> TSDetails { get; set; }
        public DbSet<ProductImageModel> ImagePhu { get; set; }
        public DbSet<PromotionModel> Promotions { get; set; }
        public DbSet<PromotionProductModel> PromotionsHH { get; set; }
        public DbSet<CTKMHangHoaViewModel> PromotionsProduct { get; set; }
        public DbSet<Product_TaiLieuModel> TaiLieu { get; set; }
        public DbSet<TuyenDung_NganhModel> NganhTuyenDung { get; set; }
        public DbSet<DMKhachHangModel> KhachHangModels { get; set; }
        public DbSet<DMTaiLieu> DMTaiLieu { get; set; }
        public DbSet<DM_DichVuModel> DM_DichVu { get; set; }
        public DbSet<DM_BangGiaModel> DM_BangGia { get; set; }
        public DbSet<DM_BangGia_LoaiModel> DM_BangGia_Loai { get; set; }
        public DbSet<VideoListModel> VideoList { get; set; }
        public DbSet<Tags_SearchModel> Tags_Search { get; set; }
        public DbSet<HT_CuaHangModel> HT_CuaHang { get; set; }
        public DbSet<DM_HangHoa_TaiLieuModel> DM_HangHoa_TaiLieu { get; set; }
        public DbSet<DM_Anh_ThucTeModel> DM_Anh_ThucTe { get; set; }
        public DbSet<Reg_SystemModel> Reg_System { get; set; }
        public DbSet<Productthongso> thongso { get; set; }
        public DbSet<DM_HangHoa_ThongSoModel> DM_HangHoa_ThongSo { get; set; }
    }
}
