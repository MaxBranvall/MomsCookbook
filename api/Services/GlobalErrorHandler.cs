using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using api.Models;

namespace api.Services
{
    public class GlobalErrorHandler : IGlobalErrorHandler
    {
        public ErrorModel ThrowError(string message, int statusCode = -1)
        {
            ErrorModel errorModel = new ErrorModel();
            errorModel.message = message;
            errorModel.statusCode = statusCode;
            return errorModel;
        }
    }
}
