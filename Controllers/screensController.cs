using Microsoft.AspNetCore.Mvc;

namespace LearnX.Controllers
{
    public class screensController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult LoginPage()
        {
            return View();
        }
        public IActionResult RegisterPage()
        {
            return View();
        }
    }
}
