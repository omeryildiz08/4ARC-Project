var builder = WebApplication.CreateBuilder(args);

// Add services to the container.var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()  // Tüm originlere izin verir (geliştirme ortamında kullanmak uygun)
              .AllowAnyMethod()  // Tüm HTTP metodlarına (GET, POST, vb.) izin verir
              .AllowAnyHeader(); // Tüm başlıklara izin verir
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowAllOrigins"); // CORS politikasını uygula
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
