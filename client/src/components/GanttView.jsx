import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GanttChart from "../components/GanttChart"; 
import transformProjectToGanttData from './transformProjectToGanttData';
import { Spin, Alert } from 'antd';

function GanttView() {
  const { id } = useParams();
  const [ganttData, setGanttData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://localhost:7216/api/Teams/${id}/ProjectDetails`);
      console.log("Backend'den gelen ham veri:", response.data);
      
      if (!response.data || !response.data.project) {
        throw new Error("Proje verisi bulunamadı");
      }

      console.log("Proje ID:", response.data.project.projectId);

      if (!response.data.members) {
        console.warn("Üye verisi bulunamadı");
        response.data.members = [];
      }

      const formattedData = transformProjectToGanttData(response.data);
      console.log("Gantt için formatlanmış veri:", formattedData);
      setGanttData(formattedData);
    } catch (err) {
      console.error('Hata:', err);
      setError("Veri alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleTaskAdded = () => {
    fetchProjectDetails();
  };

  if (loading) return <Spin tip="Yükleniyor..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Proje Fazları</h2>
      <GanttChart data={ganttData} onTaskAdded={handleTaskAdded} />
    </div>
  );
}

export default GanttView;