using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using ProjectTrackingApi.Models;
using ProjectTrackingApi.Models.Dtos;
using Dapper;

namespace ProjectTrackingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TeamsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetTeams() //tüm takımları getirir
        {
            List<Team> teams = new List<Team>();

            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {

                string query = "SELECT TeamId, TeamName FROM Teams";
                SqlCommand cmd = new SqlCommand(query, conn);

                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    teams.Add(new Team
                    {
                        TeamId = Convert.ToInt32(reader["TeamId"]),
                        TeamName = reader["TeamName"].ToString()
                    });
                }
                reader.Close();
            }

            return Ok(teams);
        }

        [HttpPost]
        public IActionResult AddTeam([FromBody] Team team)
        {
            if (string.IsNullOrWhiteSpace(team.TeamName))
            {
                return BadRequest("Team name is required.");
            }

            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "INSERT INTO Teams (TeamName) VALUES (@TeamName); SELECT SCOPE_IDENTITY();";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@TeamName", team.TeamName);

                conn.Open();
                object result = cmd.ExecuteScalar(); // ID'yi alır
                if (result != null)
                {
                    team.TeamId = Convert.ToInt32(result); // team nesnesine ID'yi yaz
                    return Ok(team);
                }
                else
                {
                    return StatusCode(500, "Failed to add team.");
                }
            }
        }

        [HttpGet("{id}/ProjectDetails")]
        public IActionResult GetTeamProjectDetails(int id)
        {
            TeamProjectDetailsDto dto = new TeamProjectDetailsDto();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                //takım bilgilerini al
                string teamQuery = "SELECT TeamName FROM Teams WHERE TeamId = @TeamId";
                using (SqlCommand cmd = new SqlCommand(teamQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@TeamId", id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            dto.TeamName = reader["TeamName"].ToString();
                        }
                        else
                        {
                            return NotFound("Team not found.");
                        }
                    }
                }


                //proje bilgilerini al
                string projectQuery = @"SELECT ProjectId, ProjectName, DevDate, TestDate, UATDate, ProdDate 
                                      FROM Projects 
                                      WHERE TeamId = @TeamId";

                using (SqlCommand cmd = new SqlCommand(projectQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@TeamId", id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            dto.Project = new TeamProjectDetailsDto.ProjectInfo
                            {
                                ProjectId = Convert.ToInt32(reader["ProjectId"]),
                                ProjectName = reader["ProjectName"].ToString(),
                                DevDate = Convert.ToDateTime(reader["DevDate"]),
                                TestDate = Convert.ToDateTime(reader["TestDate"]),
                                UATDate = Convert.ToDateTime(reader["UATDate"]),
                                ProdDate = Convert.ToDateTime(reader["ProdDate"])
                            };
                        }
                    }
                }


                //üye bilgilerini al
                string memberQuery = "SELECT MemberId, Name, Role FROM Members WHERE TeamId = @TeamId";
                using (SqlCommand cmd = new SqlCommand(memberQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@TeamId", id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        dto.Members = new List<TeamProjectDetailsDto.MemberInfo>();
                        while (reader.Read())
                        {
                            dto.Members.Add(new TeamProjectDetailsDto.MemberInfo
                            {
                                MemberId = Convert.ToInt32(reader["MemberId"]),
                                Name = reader["Name"].ToString(),
                                Role = reader["Role"].ToString()
                            });
                        }
                    }
                }

                // Task'ları al
                string tasksQuery = @"SELECT TaskId, ProjectId, MemberId, Title, Description, StartDate, EndDate 
                                    FROM Tasks 
                                    WHERE ProjectId = @ProjectId";
                using (SqlCommand cmd = new SqlCommand(tasksQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@ProjectId", dto.Project.ProjectId);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        dto.Tasks = new List<TeamProjectDetailsDto.TaskInfo>();
                        while (reader.Read())
                        {
                            dto.Tasks.Add(new TeamProjectDetailsDto.TaskInfo
                            {
                                TaskId = Convert.ToInt32(reader["TaskId"]),
                                ProjectId = Convert.ToInt32(reader["ProjectId"]),
                                MemberId = Convert.ToInt32(reader["MemberId"]),
                                Title = reader["Title"].ToString(),
                                Description = reader["Description"]?.ToString(),
                                StartDate = Convert.ToDateTime(reader["StartDate"]),
                                EndDate = Convert.ToDateTime(reader["EndDate"])
                            });
                        }
                    }
                }
            }
            return Ok(dto);
        }

        [HttpGet("WithProjects")]
        public IActionResult GetTeamWithProjects()
        {
            List<TeamWithProjectDto> teamWithProjects = new List<TeamWithProjectDto>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"
            SELECT t.TeamId, t.TeamName, p.ProjectName
            FROM Teams t
            INNER JOIN Projects p ON t.TeamId = p.TeamId
                ";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                
                using(SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        teamWithProjects.Add(new TeamWithProjectDto
                        {
                            TeamId = Convert.ToInt32(reader["TeamId"]),
                            TeamName = reader["TeamName"].ToString(),
                            ProjectName = reader["ProjectName"].ToString()
                        });
                    }
                }
            }

            return Ok(teamWithProjects);
        }

        [HttpDelete("{teamId}/Project")]
        public async Task<IActionResult> DeleteTeamProject(int teamId)
        {
            try
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();

                    // Önce projeyi bul
                    var project = await connection.QueryFirstOrDefaultAsync<Project>(
                        "SELECT * FROM Projects WHERE TeamId = @TeamId",
                        new { TeamId = teamId }
                    );

                    if (project == null)
                    {
                        return NotFound("Proje bulunamadı");
                    }

                    // Transaction başlat
                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            // Önce projeye ait task'ları sil
                            await connection.ExecuteAsync(
                                "DELETE FROM Tasks WHERE ProjectId = @ProjectId",
                                new { ProjectId = project.ProjectId },
                                transaction
                            );

                            // Sonra projeyi sil
                            await connection.ExecuteAsync(
                                "DELETE FROM Projects WHERE ProjectId = @ProjectId",
                                new { ProjectId = project.ProjectId },
                                transaction
                            );

                            // Transaction'ı onayla
                            transaction.Commit();
                            return Ok("Proje ve ilgili tüm veriler başarıyla silindi");
                        }
                        catch (Exception ex)
                        {
                            // Hata durumunda transaction'ı geri al
                            transaction.Rollback();
                            throw;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bir hata oluştu: {ex.Message}");
            }
        }
    }
}