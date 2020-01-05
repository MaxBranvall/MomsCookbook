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

namespace api
{
    public class Startup
    {

        private readonly string _connectionString;

        public Startup(IConfiguration configuration, IHostEnvironment env)
        {

            _connectionString = configuration.GetConnectionString("SQLServerConnection");

            //if (env.IsDevelopment())
            //{
            //    _connectionString = configuration.GetConnectionString("MYSQLConnection");
            //}

            //if (env.IsProduction() || env.IsStaging())
            //{
            //    _connectionString = configuration.GetConnectionString("SQLServerConnection");
            //}

        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDbContext<RecipeContext>(options => options.UseSqlServer(_connectionString));
            //services.AddDbContext<RecipeContext>(options => options.UseMySql(_connectionString));

            //if (env.IsDevelopment())
            //{
            //    services.AddDbContext<RecipeContext>(options => options.UseMySql(_connectionString));
            //}

            //if (env.IsProduction() || env.IsStaging())
            //{
            //    services.AddDbContext<RecipeContext>(options => options.UseSqlServer(_connectionString));
            //}

            services.AddTransient<IRecipeService, RecipeService>();

            services.AddControllers()
                .AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            app.UseCors(builder =>
            builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod()
            );

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
