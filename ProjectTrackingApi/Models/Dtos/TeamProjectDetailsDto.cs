namespace ProjectTrackingApi.Models.Dtos
{
    public class TeamProjectDetailsDto
    {
        public string TeamName { get; set; }
         public ProjectInfo Project { get; set; }
        public List<MemberInfo> Members { get; set; }
        public List<TaskInfo> Tasks { get; set; }

    public class ProjectInfo
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public DateTime DevDate { get; set; }
        public DateTime TestDate { get; set; }
        public DateTime UATDate { get; set; }
        public DateTime ProdDate { get; set; }
    }

      public class MemberInfo
    {
        public int MemberId { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
    }

    public class TaskInfo
    {
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public int MemberId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
    }
}