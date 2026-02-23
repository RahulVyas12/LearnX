using System.ComponentModel.DataAnnotations;

namespace LearnX.Models
{
    public class AccountModel
    {
        public string name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public string email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string password { get; set; }

    }
}
