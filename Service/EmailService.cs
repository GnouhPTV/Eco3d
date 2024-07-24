using Data;
using Data.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Text;
using Web_Eco3d_2024.Data;

namespace Web_Eco3d_2024.Service
{

    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _db;
        public EmailService(IConfiguration configuration, ApplicationDbContext db)
        {
            _configuration = configuration;
            _db = db;
        }
        public async Task<int> SendEmail(string name, string phone, string email, string supportmail)
        {

            try
            {
                string subject = "Yêu cầu tư vấn của khách hàng: " + name + ", ngày: " + DateTime.Now.ToString("dd/MM/yyyy");
                string body = "Khách hàng: <b>" + name + "</b> <br /><br />";
                body += "Email: " + email + " <br /><br />";
                body += "Tel: " + phone + " <br /><br />";

                var emailSendTuVan = Lib.XML.SystemXML("Smtp_Email");
                var emailSendHost = Lib.XML.SystemXML("Smtp_Hosting");
                var passEmailSend = _db.GetRegSystem("Smtp_Password");
                var mailAdmin = Lib.XML.SystemXML("Email.Admin");
                var emailSendPort = Lib.XML.SystemXML("Smtp_Port");

                var mineEmail = new MimeMessage();
                mineEmail.Sender = MailboxAddress.Parse(emailSendTuVan);
                mineEmail.To.Add(MailboxAddress.Parse(email));
                mineEmail.To.Add(MailboxAddress.Parse(mailAdmin));
                mineEmail.To.Add(MailboxAddress.Parse(supportmail));
                mineEmail.Subject = subject;
                var builder = new BodyBuilder();

                builder.HtmlBody = body;
                mineEmail.Body = builder.ToMessageBody();

                using (var smtp = new SmtpClient())
                {
                    await smtp.ConnectAsync(emailSendHost, int.Parse(emailSendPort), SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(emailSendTuVan, passEmailSend);
                    await smtp.SendAsync(mineEmail);
                    await smtp.DisconnectAsync(true);
                    return 1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return 0;
            }
        }
        public async Task<int> SendEmailKH(string content, string name, string phone, string filepath, string email, string supportmail)
        {

            try
            {
                string subject = "Yêu cầu tư vấn của khách hàng: " + name + ", ngày: " + DateTime.Now.ToString("dd/MM/yyyy");
                string body = "Khách hàng: <b>" + name + "</b> <br /><br />";
                body += "Email: " + email + " <br /><br />";
                body += "Tel: " + phone + " <br /><br />";
                body += "File: " + filepath + " <br /><br />";
                body += "Nội dung: " + content + " <br />";

                var emailSendTuVan = Lib.XML.SystemXML("Smtp_Email");
                var emailSendHost = Lib.XML.SystemXML("Smtp_Hosting");
                var passEmailSend = _db.GetRegSystem("Smtp_Password");
                var mailAdmin = Lib.XML.SystemXML("Email.Admin");
                var emailSendPort = Lib.XML.SystemXML("Smtp_Port");

                var mineEmail = new MimeMessage();
                mineEmail.Sender = MailboxAddress.Parse(emailSendTuVan);
                mineEmail.To.Add(MailboxAddress.Parse(email));
                mineEmail.To.Add(MailboxAddress.Parse(mailAdmin));
                mineEmail.To.Add(MailboxAddress.Parse(supportmail));
                mineEmail.Subject = subject;
                var builder = new BodyBuilder();

                builder.HtmlBody = body;
                mineEmail.Body = builder.ToMessageBody();

                using (var smtp = new SmtpClient())
                {
                    await smtp.ConnectAsync(emailSendHost, int.Parse(emailSendPort), SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(emailSendTuVan, passEmailSend);
                    await smtp.SendAsync(mineEmail);
                    await smtp.DisconnectAsync(true);
                    return 1;
                }

                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return 0;
            }
        }
        public async Task<int> SendEmailBaogia(string content, string name, string phone, string email, string supportmail, string productDetails)
        {
            try
            {
                string domain = "https://eco3d.vn";

                var products = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ProductBaoGia>>(productDetails);

                var productHtml = new StringBuilder();
                int totalQuantity = 0;

                var body = new StringBuilder();
                body.Append("<div style='font-family: Arial, sans-serif; font-size: 16px;'>");
                body.AppendFormat("<    h2 font-size: 16px;>Thông Tin Sản Phẩm Yêu Cầu</h2>");
                body.AppendFormat("<p >Ngày: {0:dd/MM/yyyy}</p>", DateTime.Now);
                body.AppendFormat("<p>Kính gửi: <strong>{0}</strong>,<br>Email: {1}<br>Điện thoại: {2}</p>", name, email, phone);
                body.AppendFormat("<p>Ghi Chú: <strong>{0}</strong>,</p>", content);

                body.Append("<p>Chúng tôi xin gửi Quý khách hàng thông tin chi tiết về các sản phẩm mà Quý khách đã quan tâm. Dưới đây là bảng liệt kê sản phẩm và số lượng:</p>");

                productHtml.Append("<div style='overflow-x:auto; font-family: Arial, sans-serif;'><table style='width:100%; border-collapse: collapse;'>");
                productHtml.Append("<thead style='background-color: #f2f2f2;'><tr><th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Hình ảnh</th><th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Tên Hàng Hóa</th><th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Số Lượng</th></tr></thead><tbody>");

                foreach (var product in products)
                {
                    string fullImageUrl = product.Image.StartsWith("http") ? product.Image : $"{domain}{product.Image}";
                    productHtml.AppendFormat("<tr><td style='border: 1px solid #dddddd; text-align: left; padding: 8px; font-size: 16px;'><img src='{0}' style='width:50px;'></td><td style='border: 1px solid #dddddd; text-align: left; padding: 8px; font-size: 16px;'>{1}</td><td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>{2}</td></tr>", fullImageUrl, product.Name, product.Quantity);
                    totalQuantity += product.Quantity;
                }

                productHtml.Append("</tbody>");
                productHtml.AppendFormat("<tfoot><tr><th style='border: 1px solid #dddddd; text-align: left; padding: 8px;' colspan='1'>Tổng Số Lượng</th><td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>{0}</td><td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>{1}</td></tr></tfoot>", "", totalQuantity);
                productHtml.Append("</table></div>");

                body.Append(productHtml);
                body.Append("<p style='font-size: 16px;'>Chúng tôi hy vọng thông tin trên sẽ hữu ích cho Quý khách hàng trong việc lựa chọn sản phẩm phù hợp. Xin đừng ngần ngại liên hệ chúng tôi nếu Quý khách cần thêm thông tin hoặc có bất kỳ yêu cầu đặc biệt nào.</p>");
                body.Append("<p style='font-size: 16px;'>Chúng tôi rất mong được hợp tác và hỗ trợ Quý khách!</p>");
                body.Append("<p style='font-size: 16px;'><strong>Người liên hệ:</strong>ECO3D</p>");
                body.Append("<p style='font-size: 16px;'><strong>Email:</strong>admin@eco3d.vn</p>");
                body.Append("<p style='font-size: 16px;'><strong>Điện thoại:</strong>(024) 3260.6868</p>");
                body.Append("</div>");
                string subject = $"Thông Tin Sản Phẩm: {DateTime.Now:dd/MM/yyyy}";


                var emailSendTuVan = Lib.XML.SystemXML("Smtp_Email");
                var emailSendHost = Lib.XML.SystemXML("Smtp_Hosting");
                var passEmailSend = _db.GetRegSystem("Smtp_Password");
                var mailAdmin = Lib.XML.SystemXML("Email.Admin");
                var emailSendPort = Lib.XML.SystemXML("Smtp_Port");

                var mineEmail = new MimeMessage();
                mineEmail.Sender = MailboxAddress.Parse(emailSendTuVan);
                mineEmail.To.Add(MailboxAddress.Parse(email));
                mineEmail.To.Add(MailboxAddress.Parse(mailAdmin));
                mineEmail.To.Add(MailboxAddress.Parse(supportmail));
                mineEmail.Subject = subject;
                var builder = new BodyBuilder { HtmlBody = body.ToString() };
                mineEmail.Body = builder.ToMessageBody();

                using (var smtp = new SmtpClient())
                {
                    await smtp.ConnectAsync(emailSendHost, int.Parse(emailSendPort), SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(emailSendTuVan, passEmailSend);
                    await smtp.SendAsync(mineEmail);
                    await smtp.DisconnectAsync(true);
                    return 1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return 0;
            }
        }
        public async Task<int> SendEmailNopHoSo(string HoTen, string Email, string DiaChi, string ChucVu, string DienThoai, string NgaySinh, string GioiTinh, string HocVan, string LinkCV)
        {

            try
            {
                string subject = "Yêu cầu tư vấn của khách hàng: " + HoTen + ", ngày: " + DateTime.Now.ToString("dd/MM/yyyy");
                string body = "Khách hàng: <b>" + HoTen + "</b> <br /><br />";
                body += " " + ChucVu + " <br /><br />";
                body += " " + DiaChi + " <br /><br />";
                body += " " + DienThoai + " <br /><br />";
                body += " " + NgaySinh + " <br /><br />";
                body += " " + GioiTinh + " <br /><br />";
                body += " " + HocVan + " <br /><br />";
                body += " " + LinkCV + " <br /><br />";
                //body += "Email: " + email + " <br /><br />";
                //body += "Tel: " + phone + " <br /><br />";
                //body += "File: " + filepath + " <br /><br />";
                //body += "Nội dung: " + content + " <br />";
                //body += "Nội dung: " + content + " <br />";

                var emailSendTuVan = Lib.XML.SystemXML("Smtp_Email");
                var emailSendHost = Lib.XML.SystemXML("Smtp_Hosting");
                var passEmailSend = _db.GetRegSystem("Smtp_Password");
                var mailAdmin = Lib.XML.SystemXML("Email.Admin");
                var emailSendPort = Lib.XML.SystemXML("Smtp_Port");

                var mineEmail = new MimeMessage();
                mineEmail.Sender = MailboxAddress.Parse(emailSendTuVan);
                mineEmail.To.Add(MailboxAddress.Parse(Email));
                mineEmail.To.Add(MailboxAddress.Parse(mailAdmin));
                mineEmail.To.Add(MailboxAddress.Parse("phucuon2001@gmail.com"));
                mineEmail.Subject = subject;
                var builder = new BodyBuilder();

                builder.HtmlBody = body;
                mineEmail.Body = builder.ToMessageBody();

                using (var smtp = new SmtpClient())
                {
                    await smtp.ConnectAsync(emailSendHost, int.Parse(emailSendPort), SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(emailSendTuVan, passEmailSend);
                    await smtp.SendAsync(mineEmail);
                    await smtp.DisconnectAsync(true);
                    return 1;
                }

                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return 0;
            }
        }

    }
}
