import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
      <Layout.Header>
        <Menu theme="dark" mode="horizontal" selectable={false}>
          <Menu.Item key="dashboard">
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="teams">
            <Link to="/teams">Takımlar</Link>
          </Menu.Item>
          <Menu.Item key="create">
            <Link to="/create">Yeni Oluştur</Link>
          </Menu.Item>
          <Menu.Item key="all-projects">
            <Link to="/all-projects">Tüm Projeler</Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
    );
  };
  
  export default Navbar;