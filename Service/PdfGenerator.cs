using Data;
using Lib;
using SelectPdf;
using Web_Eco3d_2024.Data;

namespace Web_Eco3d_2024.Service
{
    public class PdfGenerator
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly WebService _webService;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public PdfGenerator(IWebHostEnvironment webHostEnvironment, ApplicationDbContext db, WebService webService, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _webHostEnvironment = webHostEnvironment;
            _dbContext = db;
            _webService = webService;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddMemoryCache();
        }

        public string SaveDetailPDF(string htmlPDF, string masp)
        {
            try
            {
                return SaveDetailPDF1(htmlPDF, masp, _httpContextAccessor);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private string SaveDetailPDF1(string htmlPDF, string masp, IHttpContextAccessor _httpContextAccessor)
        {
            string valueKey = Lib.UtilString.Setting(_configuration, "Website");
            HttpContext httpContext = _httpContextAccessor.HttpContext;
            try
            {
                //var dajson = _dbContext.Products.Select("DataJson", "DM_HangHoa", "Ma=N'" + masp + "'");
                var dajson = _webService.GetValueProduct(query => query.Where(e => e.Ma == masp).Select(e => new { e.DataJson }));
                var sMota = dajson.GetDJ("Note");
                var sUngDung = dajson.GetDJ("UngDung");
                var sName = dajson.GetDJ("Name");
                //var sName = _dbContext.GetValueFromSQLConnection("SELECT Ten FROM DM_HangHoa", "Ten", "Ma = N'" + masp + "'", "dbsalesoft");
                var sThongSo = DataContext.GetValueFromSQL(_dbContext, "SELECT TinhNang FROM DM_HangHoa", "TinhNang", "Ma = N'" + masp + "'");
                string fileName = FriendlyUrl.GeneratePath(sName + "-" + masp);
                sMota = sMota.Replace("\n\"\r\n", "\n").Replace("\r\n\"", "\n").Replace("\n*", "<br>&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;").Replace("\n", "<br>");
                sUngDung = sUngDung.Replace("\n\"\r\n", "\n").Replace("\r\n\"", "\n").Replace("\n*", "<br>&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;").Replace("\n", "<br>");
                htmlPDF = htmlPDF.Replace("{{html-masp}}", masp);
                htmlPDF = htmlPDF.Replace("{{html-motasp}}", sMota.Replace("- ", "<i class=i-list></i>").Replace("•", "<i class=i-list></i>"));
                htmlPDF = htmlPDF.Replace("{{html-ungdung}}", sUngDung.Replace("- ", "<i class=i-list></i>").Replace("•", "<i class=i-list></i>"));
                htmlPDF = htmlPDF.Replace("src=\"/", "src=\"" + valueKey + "/").Replace("href=\"/", "href=\"" + valueKey + "/");
                htmlPDF = htmlPDF.Replace("{{html-thongso}}", sThongSo);
                string folder = "Images/Temp";
                //string savepath = HttpContext.Current.Server.MapPath("~" + folder);
                if (httpContext != null)
                {
                    // Lấy đường dẫn gốc của ứng dụng web
                    string webRootPath = _webHostEnvironment.WebRootPath;
                    // Kết hợp đường dẫn gốc với đường dẫn thư mục
                    string folderPath = Path.Combine(webRootPath, folder);
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    HtmlToPdf converter = new HtmlToPdf();
                    converter.Options.MarginTop = 20;
                    converter.Options.MarginRight = 20;
                    converter.Options.MarginBottom = 20;
                    converter.Options.MarginLeft = 20;
                    SelectPdf.PdfDocument pdfdoc = converter.ConvertHtmlString(htmlPDF);
                    pdfdoc.Save(folderPath + @"\" + fileName.Replace("\n", "") + ".pdf");
                    string pdfPath = "/"+ folder + "/" + fileName + ".pdf";
                    string domain = httpContext.Request.Scheme + "://" + httpContext.Request.Host.Value;
                    string fullPdfPath = domain + pdfPath;
                    //string pdfPath = Path.Combine(folderPath, $"{fileName}.pdf");
                    //pdfdoc.Save(pdfPath);

                    //pdfdoc.Save(folderPath + @"\" + fileName.Replace("\n", "") + ".pdf");
                    //string path = folder + "/" + fileName + ".pdf";
                    //DirectoryInfo folderToDelete = new DirectoryInfo(folderPath);
                    //if (folderToDelete.Exists)
                    //{
                    //    folderToDelete.Delete(true); // Tham số true để xóa thư mục con
                    //}
                    //foreach (FileInfo file in folderToDelete.GetFiles())
                    //{
                    //    if (file.CreationTime.Date < DateTime.Now.Date)
                    //    {
                    //        file.Delete();
                    //    }
                    //}
                    return fullPdfPath;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            return "";
        }
    }
}
