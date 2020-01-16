using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using api.Interfaces;
using api.Services;
using api.Contexts;
using api;

namespace api
{
    public class Startup
    {

        private readonly string _connectionString;

        public Startup(IConfiguration configuration, IHostEnvironment env)
        {
            if (env.IsProduction())
            {
                _connectionString = configuration.GetConnectionString("SmarterASPConnection");
            }
            else if (env.IsDevelopment())
            {
                _connectionString = configuration.GetConnectionString("MySQLConnection");
            }

        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(options =>
           options.AddPolicy("AllowCors",
           builder =>
           {
               builder
               .AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
           }
           ));

            services.AddDbContext<RecipeContext>(options => options.UseMySql(_connectionString));

            services.AddTransient<IRecipeService, RecipeService>();

            services.AddControllers();

            services.AddControllers()
                .AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {

            app.UseCors("AllowCors");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
