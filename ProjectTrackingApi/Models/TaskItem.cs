namespace ProjectTrackingApi.Models
{
    public class TaskItem
    {
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public int MemberId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}