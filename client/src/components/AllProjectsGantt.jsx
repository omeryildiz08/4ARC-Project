import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Alert } from 'antd';
import GanttChart from './GanttChart';

function AllProjectsGantt() {
    const [ganttData, setGanttData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllProjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://localhost:7216/api/Projects');
            console.log("Tüm projeler:", response.data);

            // Transform projects into Gantt data format
            const formattedData = response.data.map((project, index) => {
                const dev = new Date(project.devDate);
                const test = new Date(project.testDate);
                const uat = new Date(project.uatDate);
                const prod = new Date(project.prodDate);

                return {
                    id: `${project.projectId}`,
                    name: project.projectName,
                    start: dev,
                    end: prod,
                    progress: 100,
                    type: 'project',
                    hideChildren: false,
                    displayOrder: index + 1,
                    projectId: project.projectId,
                    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
                    children: [
                        {
                            id: `${project.projectId}-dev`,
                            name: 'Development',
                            start: dev,
                            end: test,
                            progress: 100,
                            type: 'task',
                            project: `${project.projectId}`,
                            projectId: project.projectId,
                            displayOrder: 1,
                            styles: { progressColor: '#4caf50', progressSelectedColor: '#388e3c' }
                        },
                        {
                            id: `${project.projectId}-test`,
                            name: 'Testing',
                            start: test,
                            end: uat,
                            progress: 100,
                            type: 'task',
                            project: `${project.projectId}`,
                            projectId: project.projectId,
                            displayOrder: 2,
                            styles: { progressColor: '#2196f3', progressSelectedColor: '#1976d2' }
                        },
                        {
                            id: `${project.projectId}-uat`,
                            name: 'UAT',
                            start: uat,
                            end: prod,
                            progress: 100,
                            type: 'task',
                            project: `${project.projectId}`,
                            projectId: project.projectId,
                            displayOrder: 3,
                            styles: { progressColor: '#ff9800', progressSelectedColor: '#fb8c00' }
                        },
                        {
                            id: `${project.projectId}-prod`,
                            name: 'Production',
                            start: prod,
                            end: prod,
                            progress: 100,
                            type: 'task',
                            project: `${project.projectId}`,
                            projectId: project.projectId,
                            displayOrder: 4,
                            styles: { progressColor: '#f44336', progressSelectedColor: '#d32f2f' }
                        }
                    ]
                };
            });

            setGanttData(formattedData);
        } catch (err) {
            console.error('Hata:', err);
            setError("Projeler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProjects();
    }, []);

    if (loading) return <Spin tip="Yükleniyor..." />;
    if (error) return <Alert type="error" message={error} />;

    return (
        <div style={{ padding: 24 }}>
            <h2>Tüm Projeler</h2>
            <GanttChart data={ganttData} />
        </div>
    );
}

export default AllProjectsGantt;
