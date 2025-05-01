using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using ProjectTrackingApi.Models;

namespace ProjectTrackingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ProjectsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        //GET:api/projects
        [HttpGet]
        public IActionResult GetProjects()
        {
            List<Project> projects = new List<Project>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM Projects";
                SqlCommand cmd = new SqlCommand(query, conn);

                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    projects.Add(new Project
                    {
                        ProjectId = Convert.ToInt32(reader["ProjectId"]),
                        ProjectName = reader["ProjectName"].ToString(),
                        TeamId = Convert.ToInt32(reader["TeamId"]),
                        DevDate = Convert.ToDateTime(reader["DevDate"]),
                        TestDate = Convert.ToDateTime(reader["TestDate"]),
                        UATDate = Convert.ToDateTime(reader["UATDate"]),
                        ProdDate = Convert.ToDateTime(reader["ProdDate"]),
                    });
            }
            reader.Close();
            }
            return Ok(projects);

        }

        //POST:api/projects
        [HttpPost]
        public IActionResult AddProject([FromBody] Project project)
        {
            if (string.IsNullOrWhiteSpace(project.ProjectName) || project.TeamId == 0)
                return BadRequest("Project name and team ID are required.");

            string connectionString = _configuration.GetConnectionString("DefaultConnection");
             using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"
                    INSERT INTO Projects (ProjectName, TeamId, DevDate, TestDate, UATDate, ProdDate)
                    VALUES (@ProjectName, @TeamId, @DevDate, @TestDate, @UATDate, @ProdDate)";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@ProjectName", project.ProjectName);
                cmd.Parameters.AddWithValue("@TeamId", project.TeamId);
                cmd.Parameters.AddWithValue("@DevDate", project.DevDate );
                cmd.Parameters.AddWithValue("@TestDate", project.TestDate);
                cmd.Parameters.AddWithValue("@UATDate", project.UATDate );
                cmd.Parameters.AddWithValue("@ProdDate", project.ProdDate);

                conn.Open();
                int result = cmd.ExecuteNonQuery();

                if (result > 0)
                    return Ok(project);
                else
                    return StatusCode(500, "Failed to add project.");
            }
        }


    }
}