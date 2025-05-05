import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GanttChart from "../components/GanttChart"; 
import transformProjectToGanttData from './transformProjectToGanttData';
import { Spin, Alert } from 'antd';

function GanttView() {
  const { id } = useParams(); // URL'deki teamId'yi alır
  const [ganttData, setGanttData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7216/api/Teams/${id}/ProjectDetails`);
        const formattedData = transformProjectToGanttData(response.data);
        setGanttData(formattedData);
      } catch (err) {
        console.error('Hata:', err);
        setError("Veri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) return <Spin tip="Yükleniyor..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Proje Aşamaları (Gantt)</h2>
      <GanttChart data={ganttData} />
    </div>
  );
}

export default GanttView;