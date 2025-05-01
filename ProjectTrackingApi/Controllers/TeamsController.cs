using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using ProjectTrackingApi.Models;
using ProjectTrackingApi.Models.Dtos;

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
                string projectQuery = @"SELECT ProjectName, DevDate, TestDate, UATDate,ProdDate FROM Projects WHERE TeamId = @TeamId";

                using (SqlCommand cmd = new SqlCommand(projectQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@TeamId", id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            dto.Project = new TeamProjectDetailsDto.ProjectInfo
                            {
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
                string memberQuery = "SELECT Name, Role FROM Members WHERE TeamId = @TeamId";
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
                                Name = reader["Name"].ToString(),
                                Role = reader["Role"].ToString()
                            });
                        }
                    }
                }
            }
            return Ok(dto);
        }







    }

}