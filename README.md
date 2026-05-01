# 4ARC Project Tracking

4ARC Project Tracking, ekiplerin proje, üye ve görev takibini yapabilmesi için geliştirilmiş full-stack bir proje yönetim uygulamasıdır. Uygulama; takımların oluşturulması, projelerin takımlara atanması, proje aşama tarihlerinin takip edilmesi ve görevlerin Gantt görünümü üzerinden izlenmesi gibi temel proje takip ihtiyaçlarını karşılar.

## Özellikler

- Takım listeleme ve takım oluşturma
- Takımlara proje atama
- Projeler için Dev, Test, UAT ve Prod tarihlerini takip etme
- Takım üyelerini görüntüleme ve yeni üye ekleme
- Projelere görev ekleme
- Takım bazlı proje detaylarını görüntüleme
- Tüm projeleri Gantt takvimi üzerinde izleme
- Proje ve ilişkili görev kayıtlarını silme
- Swagger üzerinden API dokümantasyonunu görüntüleme

## Teknoloji Yığını

**Frontend**

- React 18
- Vite
- React Router
- Ant Design
- Axios
- gantt-task-react

**Backend**

- .NET 6 Web API
- ASP.NET Core Controllers
- Dapper
- System.Data.SqlClient
- Swagger / Swashbuckle

**Veritabanı ve Dağıtım**

- Microsoft SQL Server
- Docker
- Docker Compose
- Nginx ile frontend servisleme

## Proje Yapısı

```text
4ARC-Project/
├── client/                  # React + Vite frontend uygulaması
│   ├── src/
│   │   ├── components/       # Dashboard, Gantt, takım ve form bileşenleri
│   │   └── assets/
│   ├── Dockerfile
│   └── package.json
├── ProjectTrackingApi/       # .NET 6 Web API
│   ├── Controllers/          # Teams, Projects, Members, Tasks API controller'ları
│   ├── Models/               # Entity ve DTO modelleri
│   ├── Dockerfile
│   ├── Program.cs
│   └── appsettings.json
├── docker-compose.yml
└── 4ARC-Project.sln
```

## Kurulum

### Gereksinimler

- Node.js 18+
- npm
- .NET 6 SDK
- SQL Server veya SQL Server LocalDB
- Docker ve Docker Compose (opsiyonel)

### Backend'i Çalıştırma

Backend varsayılan olarak `ProjectTrackingApi/appsettings.json` içinde bulunan aşağıdaki bağlantı bilgisiyle LocalDB kullanır:

```json
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=4arc_db;Trusted_Connection=True;"
```

API'yi çalıştırmak için:

```bash
cd ProjectTrackingApi
dotnet restore
dotnet run
```

Geliştirme ortamında API şu adreslerden çalışır:

- `https://localhost:7216`
- `http://localhost:5227`

Swagger arayüzü:

```text
https://localhost:7216/swagger
```

### Frontend'i Çalıştırma

```bash
cd client
npm install
npm run dev
```

Vite geliştirme sunucusu varsayılan olarak:

```text
http://localhost:5173
```

Not: Frontend içerisindeki API çağrıları şu an `https://localhost:7216/api/...` adresine göre yazılmıştır. Backend farklı bir portta çalıştırılırsa ilgili Axios URL'leri güncellenmelidir.

## Docker ile Çalıştırma

Proje kök dizininden:

```bash
docker compose up --build
```

Servisler:

- Frontend: `http://localhost:8080`
- API: `http://localhost:5000`
- SQL Server: `localhost:1433`

Docker Compose içinde SQL Server için örnek bağlantı:

```text
Server=db;Database=4arc_db;User Id=sa;Password=YourStrong!Passw0rd;
```

Not: SQL Server container'ı veritabanı motorunu ayağa kaldırır. Uygulamanın beklediği `Teams`, `Projects`, `Members` ve `Tasks` tablolarının ayrıca oluşturulması gerekir.

## Veritabanı Modeli

Uygulama aşağıdaki temel tablolarla çalışır:

```text
Teams
- TeamId
- TeamName

Members
- MemberId
- Name
- Role
- TeamId

Projects
- ProjectId
- ProjectName
- TeamId
- DevDate
- TestDate
- UATDate
- ProdDate

Tasks
- TaskId
- ProjectId
- MemberId
- Title
- Description
- StartDate
- EndDate
```

## API Uçları

### Teams

```http
GET    /api/Teams
POST   /api/Teams
GET    /api/Teams/WithProjects
GET    /api/Teams/{id}/ProjectDetails
DELETE /api/Teams/{teamId}/Project
```

### Projects

```http
GET  /api/Projects
POST /api/Projects
```

### Members

```http
GET  /api/Member/{teamId}
POST /api/Member
```

### Tasks

```http
GET  /api/Tasks/project/{projectId}
POST /api/Tasks
```

## Kullanım Akışı

1. Yeni bir takım oluşturulur.
2. Takıma bağlı proje bilgileri ve proje aşama tarihleri eklenir.
3. Takım üyeleri eklenir.
4. Proje görevleri oluşturulur ve ilgili üyeye atanır.
5. Takım veya tüm projeler Gantt görünümünde takip edilir.

## Geliştirme Komutları

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
dotnet restore
dotnet build
dotnet run
```

## Durum

Bu proje 4ARC Software Company için geliştirilen bir proje takip uygulamasıdır. Kod tabanı frontend, backend ve veritabanı servislerini ayrı katmanlar halinde tutar; geliştirme ortamında LocalDB, container ortamında SQL Server kullanılacak şekilde yapılandırılmıştır.
