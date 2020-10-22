using System;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using api.Interfaces;
using api.Services;
using api.Contexts;
using api.Models;
using api.Entities;
using api;
using api.Helpers;

namespace api
{
    public class Startup
    {

        private readonly string _connectionString;

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration, IHostEnvironment env)
        {
            Configuration = configuration;

            if (env.IsProduction())
            {
                _connectionString = configuration.GetConnectionString("SmarterASPConnection");
            }
            else if (env.IsDevelopment())
            {
                _connectionString = configuration.GetConnectionString("DevConnection");
            }
            else if (env.IsStaging())
            {
                _connectionString = configuration.GetConnectionString("StagingConnection");
            }

        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {        

            // configure strongly typed settings objects          
            var appSettingsSection = Configuration.GetSection("AppSettings");
            var jwtSection = Configuration.GetSection("JWT");
            var urlSection = Configuration.GetSection("URLs");
            var emailSettingsSection = Configuration.GetSection("EmailSettings");

            services.Configure<AppSettings>(appSettingsSection);
            services.Configure<JWT_Settings>(jwtSection);
            services.Configure<URLs>(urlSection);
            services.Configure<EmailSettings>(emailSettingsSection);

            // configure jwt authentication
            var jwtSettings = jwtSection.Get<JWT_Settings>();
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.ClaimsIssuer = jwtSettings.Issuer;
                x.Audience = jwtSettings.Audience;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("UserOnly", policy => policy.RequireClaim(ClaimTypes.Role, Role.Admin));
                options.AddPolicy("Verification", policy => policy.RequireClaim("Verified", Verified.False.ToString()));
                options.AddPolicy("ChangePassword", policy => policy.Requirements.Add(new ChangePasswordRequirement()));
            });

            services.AddTransient<IAuthorizationHandler, ChangePasswordRequirementHandler>();

            services.AddDbContext<RecipeContext>(options => options.UseMySql(_connectionString));

            services.AddTransient<IRecipeService, RecipeService>();
            services.AddTransient<ITokenBuilder, TokenBuilder>();
            services.AddTransient<IUserService, UserService>();

            services.AddControllers();

            services.AddControllers()
                .AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {

            app.UseCors(builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
