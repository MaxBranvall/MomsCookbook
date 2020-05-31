using api.Models;

namespace api.Interfaces
{
    interface IGlobalErrorHandler
    {
        public ErrorModel ThrowError(string message, int statusCode = -1);
    }
}
