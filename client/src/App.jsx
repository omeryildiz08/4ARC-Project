import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/navbar';
import Dashboard from './components/Dashboard';
import GanttView from './components/GanttView';
import TeamList from './components/TeamList';
import TeamMemberPage from './components/TeamMemberPage';
import AllProjectsGantt from './components/AllProjectsGantt';
import TeamProjectCreateForm from './components/TeamProjectCreateForm';

function App() {
  

  return (
    <>
      <Layout>
      <Navbar />
      <Layout.Content style={{ padding: '24px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<TeamList />} />
          <Route path="/teams/:id" element={<GanttView />} />
          <Route path="/create" element={<TeamProjectCreateForm />} />
          <Route path="/teams/:teamId/members" element={<TeamMemberPage />} />
          <Route path="/all-projects" element={<AllProjectsGantt />} />
        </Routes>
      </Layout.Content>
    </Layout>
    </>
  )
}

export default App
