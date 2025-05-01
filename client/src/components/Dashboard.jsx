import { Typography, Button } from 'antd';
import { useNavigate,Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <Typography.Title level={2}>4arc Proje Takip Paneline Hoş Geldiniz</Typography.Title>
      <Button type="primary" size="large" onClick={() => navigate('/create')}>
    
        <Link to="/create">Yeni Takım/Proje Oluştur</Link>
      </Button>
    </div>
  );
};

export default Dashboard;