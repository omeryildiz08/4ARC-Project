namespace ProjectTrackingApi.Models
{
    public class Member 
    {
        public int MemberId { get; set; }
        public int TeamId { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
    }
}