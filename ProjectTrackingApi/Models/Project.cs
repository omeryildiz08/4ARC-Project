namespace ProjectTrackingApi.Models
{
    public class Project
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public int TeamId { get; set; }

     public DateTime DevDate { get; set; }
    public DateTime TestDate { get; set; }
    public DateTime UATDate { get; set; }
    public DateTime ProdDate { get; set; }
    }
}