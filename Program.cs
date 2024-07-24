using Microsoft.EntityFrameworkCore;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Models;
using Web_Eco3d_2024.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
#pragma warning disable CS8604 // Possible null reference argument.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(Lib.Common.Decrypt(toDecrypt: builder.Configuration.GetConnectionString("ConnectionWeb"))));
#pragma warning restore CS8604 // Possible null reference argument.
builder.Services.Configure<AppSetting>(builder.Configuration.GetSection("AppSettings"));
builder.Services.AddScoped<WebService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUrlService, CurrentUrlService>();
IConfiguration configuration = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json")
        .Build();
builder.Services.AddSingleton(configuration);
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<PdfGenerator>();
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSession();
app.UseRouting();
app.UseAuthorization();
app.MapControllerRoute(name: "clearcache",
                       pattern: "Clear",
                       defaults: new { controller = "Clear", action = "Clear" });
//--------Danh muc------- 
app.MapControllerRoute(name: "danhmuc",
                       pattern: "danh-muc-san-pham",
                       defaults: new { controller = "CategoryParent", action = "CateList" });
app.MapControllerRoute(name: "linhvuc",
                       pattern: "linh-vuc/{LinkUrl}",
                       defaults: new { controller = "LinhVuc", action = "linhvuc" });
//--------Category page------- 
app.MapControllerRoute(
                       name: "CatePageParent",
                       pattern: "nganh-hang/{linkUrl}",
                       defaults: new { controller = "CategoryParent", action = "NganhHang" });
app.MapControllerRoute(name: "CatePage",
                       pattern: "nhom-hang/{LinkUrl}",
                       defaults: new { controller = "CategoryParent", action = "NhomHang" });
app.MapControllerRoute(name: "CatePage",
                       pattern: "san-pham/{LinkUrl}",
                       defaults: new { controller = "CategoryParent", action = "DetailProduct" });
app.MapControllerRoute(name: "ThuongHieu",
                       pattern: "thuong-hieu/{LinkUrl}",
                       defaults: new { controller = "CategoryParent", action = "ThuongHieu" });
//--------Giới thiệu _ Tài liệu------- 
app.MapControllerRoute(name: "gioithieu",
                       pattern: "gioi-thieu",
                       defaults: new { controller = "GioiThieu", action = "GioiThieu" });
app.MapControllerRoute(name: "gioithieugiaychungnhan",
                       pattern: "giay-chung-nhan",
                       defaults: new { controller = "GioiThieu", action = "GiayChungNhan" });
app.MapControllerRoute(name: "gioithieu-tailieu",
                       pattern: "tai-lieu",
                       defaults: new { controller = "GioiThieu", action = "TaiLieu" });
app.MapControllerRoute(name: "gioithieuNewType",
                       pattern: "tin-tuc-list/{newsType?}",
                       defaults: new { controller = "GioiThieu", action = "TinTucList" });
//--------Tin tức-------
app.MapControllerRoute(name: "tintuc",
                       pattern: "tin-tuc",
                       defaults: new { controller = "TinTuc", action = "TinTuc" });
app.MapControllerRoute(name: "tintuclist",
                       pattern: "tin-tuc-list/{newsType?}/{page?}",
                       defaults: new { controller = "TinTuc", action = "TinTucList" });
app.MapControllerRoute(name: "tintucdetail",
                       pattern: "tin-tuc/{LinkHref}",
                       defaults: new { controller = "TinTuc", action = "TinTucDetail" });
//--------Video------- 
app.MapControllerRoute(name: "video",
                       pattern: "video",
                       defaults: new { controller = "Video", action = "videolist" });
//--------Liên hệ------- 
app.MapControllerRoute(name: "lienhe",
                       pattern: "he-thong-chi-nhanh",
                       defaults: new { controller = "LienHe", action = "LienHe" });
//--------Tuyển dụng------- 
app.MapControllerRoute(name: "tuyendung",
                       pattern: "tuyen-dung",
                       defaults: new { controller = "TuyenDung", action = "TuyenDung" });
app.MapControllerRoute(name: "tuyendungdetail",
                       pattern: "tuyen-dung/{LinkHref?}",
                       defaults: new { controller = "TuyenDung", action = "TuyenDungDetail" });
//--------Tìm kiếm------- 
app.MapControllerRoute(name: "timkiem",
                       pattern: "tim-kiem/{pName?}/{page?}",
                       defaults: new { controller = "Search", action = "Search" });
app.MapControllerRoute(name: "timkiem",
                       pattern: "tag/{linkUrl?}/{page?}",
                       defaults: new { controller = "Search", action = "SearchTags" });
//Dịch Vụ
app.MapControllerRoute(name: "dichvu",
                       pattern: "bang-gia/{linkUrl?}",
                       defaults: new { controller = "DichVu", action = "DichVuDetail" });
app.MapControllerRoute(name: "dichvuNewType",
                       pattern: "tin-tuc-list/{newsType?}",
                       defaults: new { controller = "DichVu", action = "TinTucList" });
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();