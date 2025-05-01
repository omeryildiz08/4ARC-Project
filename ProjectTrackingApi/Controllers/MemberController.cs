using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using ProjectTrackingApi.Models;

namespace ProjectTrackingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController:ControllerBase
    {
        private readonly IConfiguration _configuration;

        public MemberController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("{teamId}")]
        public IActionResult GetMembersByTeam(int teamId)
        {
            List <Member> members = new List<Member>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = "SELECT MemberId,Name,Role, TeamId FROM Members WHERE TeamId = @TeamId";
                SqlCommand command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@TeamId", teamId);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                   members.Add(new Member{
                    MemberId = Convert.ToInt32(reader["MemberId"]),
                    Name = reader["Name"].ToString(),
                    Role = reader["Role"].ToString(),
                    TeamId = Convert.ToInt32(reader["TeamId"])
                   });
                }
                reader.Close();
            }
            return Ok(members);
        }
    
        [HttpPost]
        public IActionResult AddMember([FromBody] Member member)
        {
            if(string.IsNullOrEmpty(member.Name))
            {
                return BadRequest("Name is required.");
            }

            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = "INSERT INTO Members (Name, Role, TeamId) VALUES (@Name, @Role, @TeamId); SELECT SCOPE_IDENTITY();";
                SqlCommand command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@Name", member.Name);
                command.Parameters.AddWithValue("@Role", member.Role);
                command.Parameters.AddWithValue("@TeamId", member.TeamId);

                connection.Open();
                object result = command.ExecuteScalar();

                if(result != null)
                {
                    member.MemberId = Convert.ToInt32(result);
                    return Ok(member);
                }
                else
                {
                    return StatusCode(500, "Error inserting member.");
                }
            }
        }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    }
}