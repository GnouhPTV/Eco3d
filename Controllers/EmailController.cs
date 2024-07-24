using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Web_Eco3d_2024.Service;

namespace Web_Eco3d_2024.Controllers
{
    public class EmailController : Controller
    {
        private readonly EmailService _emailService;
        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendEmailTuVan([FromBody] EmailRequestModel model)
        {
            var result = await _emailService.SendEmail(model.Name, model.Phone, model.Email, model.SupportMail);
            if (result == 1)
            {
                return Content("1");
            }
            return Content("Failed to send email");
        }
        public async Task<IActionResult> SendEmailKH([FromBody] EmailRequestModel model)
        {
            var result = await _emailService.SendEmailKH(model.Content, model.Name, model.Phone, model.Filepath, model.Email, model.SupportMail);

            if (result == 1)
            {
                return Content("1");
            }
            return Content("Failed to send email");
        }
        public async Task<IActionResult> SendEmailBaogia([FromBody] BaoGiaDetail model)
        {
            var result = await _emailService.SendEmailBaogia(model.Content, model.Name, model.Phone, model.Email, model.SupportMail, model.ProductDetails);

            if (result == 1)
            {
                return Content("1");
            }
            return Content("Failed to send email");
        }
    }
}
