using System.Data.SqlClient;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using ProjectTrackingApi.Models;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace ProjectTrackingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController:ControllerBase
    {
        private readonly IConfiguration _configuration;
        public TasksController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("project/{projectId}")]
        public IActionResult GetTaskByProject(int projectId)
        {
            List<TaskItem> tasks = new List<TaskItem>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using(SqlConnection connection = new SqlConnection(connectionString)){
                string query = "SELECT * FROM Tasks WHERE ProjectId = @ProjectId";
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@ProjectId", projectId);
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();
                while(reader.Read()){
                    tasks.Add(new TaskItem{
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
            return Ok(tasks);
        }


        [HttpPost]
        public IActionResult AddTask([FromBody] TaskItem task)
        {
            if(string.IsNullOrEmpty(task.Title))
            {
                return BadRequest("Title is required.");
            }

            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = "INSERT INTO Tasks (ProjectId, MemberId, Title, Description, StartDate, EndDate) VALUES (@ProjectId, @MemberId, @Title, @Description, @StartDate, @EndDate); SELECT SCOPE_IDENTITY();";
                SqlCommand command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@ProjectId", task.ProjectId);
                command.Parameters.AddWithValue("@MemberId", task.MemberId);
                command.Parameters.AddWithValue("@Title", task.Title);
                command.Parameters.AddWithValue("@Description", task.Description ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@StartDate", task.StartDate);
                command.Parameters.AddWithValue("@EndDate", task.EndDate);

                connection.Open();
                int result = command.ExecuteNonQuery();
                return result > 0 ? Ok("Task added successfully.") : BadRequest("Failed to add task.");
            }
        }
    }
}