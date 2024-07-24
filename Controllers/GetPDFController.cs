using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using System.Text.Json;
using Web_Eco3d_2024.Data;
using Web_Eco3d_2024.Service;

namespace Web_Eco3d_2024.Controllers
{
    public class Pdf
    {
        public string? HtmlPDF { get; set; }
        public string? Masp { get; set; }
    }

    public class GetPDFController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly PdfGenerator _pdfGenerator;
        public GetPDFController(ApplicationDbContext db, PdfGenerator pdfGenerator)
        {
            _db = db;
            _pdfGenerator = pdfGenerator;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public string GetDetailPDF([FromBody] JsonElement requestData)
        {
            try
            {
                var htmlPDF = requestData.GetProperty("htmlPDF").GetString();
                var masp = requestData.GetProperty("masp").GetString();
                string path = _pdfGenerator.SaveDetailPDF(htmlPDF, masp);
                dynamic obj = new ExpandoObject();
                obj.file = path;
                string json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                return json;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}
