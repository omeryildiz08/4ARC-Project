namespace ProjectTrackingApi.Models.Dtos
{
    public class TeamProjectDetailsDto
    {
        public string TeamName { get; set; }
         public ProjectInfo Project { get; set; }
        public List<MemberInfo> Members { get; set; }

    public class ProjectInfo
    {
        public string ProjectName { get; set; }
        public DateTime DevDate { get; set; }
        public DateTime TestDate { get; set; }
        public DateTime UATDate { get; set; }
        public DateTime ProdDate { get; set; }
    }

      public class MemberInfo
    {
        public string Name { get; set; }
        public string Role { get; set; }
    }
    }
}