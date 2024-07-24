using Microsoft.AspNetCore.Http.Extensions;

namespace Web_Eco3d_2024.Service
{
    public interface ICurrentUrlService
    {
        string GetCurrentUrl();
    }
    public class CurrentUrlService : ICurrentUrlService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUrlService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentUrl()
        {
            var url = _httpContextAccessor.HttpContext.Request.GetDisplayUrl();
            return url;
        }
    }
}
