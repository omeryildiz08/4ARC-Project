function transformProjectToGanttData(data) {
    if (!data || !data.project) return [];
    
    const { project, members } = data;
    
    // Tarihleri JavaScript Date nesnesine çevir
    const dev = new Date(project.devDate);
    const test = new Date(project.testDate);
    const uat = new Date(project.uatDate);
    const prod = new Date(project.prodDate);
    
    // Ana proje görevi
    const mainProject = {
        id: '1',
        name: project.projectName,
        start: dev,
        end: prod,
        progress: 100,
        type: 'project',
        hideChildren: false,
        displayOrder: 1,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
    };
    
    // Alt görevler
    const tasks = [
        {
            id: '2',
            name: 'Development',
            start: dev,
            end: test,
            progress: 100,
            type: 'task',
            project: '1',
            displayOrder: 2,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
        },
        {
            id: '3',
            name: 'Testing',
            start: test,
            end: uat,
            progress: 100,
            type: 'task',
            project: '1',
            displayOrder: 3,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
        },
        {
            id: '4',
            name: 'UAT',
            start: uat,
            end: prod,
            progress: 100,
            type: 'task',
            project: '1',
            displayOrder: 4,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
        },
        {
            id: '5',
            name: 'Production',
            start: prod,
            end: prod,
            progress: 100,
            type: 'task',
            project: '1',
            displayOrder: 5,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
        }
    ];
    
    return [mainProject, ...tasks];
}

export default transformProjectToGanttData;