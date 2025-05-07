function transformProjectToGanttData(data) {
    if (!data || !data.project) return [];

    const { project, members } = data;
    console.log("Gelen veri:", data);

    const dev = new Date(project.devDate);
    const test = new Date(project.testDate);
    const uat = new Date(project.uatDate);
    const prod = new Date(project.prodDate);

    const mainProject = {
        id: '1',
        name: project.projectName,
        start: dev,
        end: prod,
        progress: 100,
        type: 'project',
        hideChildren: false,
        displayOrder: 1,
        projectId: project.projectId,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
    };

    const ganttTasks = [
        {
            id: '2',
            name: 'Development',
            start: dev,
            end: test,
            progress: 100,
            type: 'task',
            project: '1',
            projectId: project.projectId,
            displayOrder: 2,
            styles: { progressColor: '#4caf50', progressSelectedColor: '#388e3c' }
        },
        {
            id: '3',
            name: 'Testing',
            start: test,
            end: uat,
            progress: 100,
            type: 'task',
            project: '1',
            projectId: project.projectId,
            displayOrder: 3,
            styles: { progressColor: '#2196f3', progressSelectedColor: '#1976d2' }
        },
        {
            id: '4',
            name: 'UAT',
            start: uat,
            end: prod,
            progress: 100,
            type: 'task',
            project: '1',
            projectId: project.projectId,
            displayOrder: 4,
            styles: { progressColor: '#ff9800', progressSelectedColor: '#fb8c00' }
        },
        {
            id: '5',
            name: 'Production',
            start: prod,
            end: prod,
            progress: 100,
            type: 'task',
            project: '1',
            projectId: project.projectId,
            displayOrder: 5,
            styles: { progressColor: '#f44336', progressSelectedColor: '#d32f2f' }
        }
    ];

    // Üyeleri ekle
    let taskIdCounter = 6;
    const memberTasks = new Map(); // Üye ID'lerine göre task'ları saklamak için

    if (members && members.length > 0) {
        members.forEach((member) => {
            console.log("İşlenen üye:", member);
            const memberTask = {
                id: `${taskIdCounter++}`,
                name: `${member.name} (${member.role})`,
                start: dev,
                end: prod,
                progress: 0,
                type: 'task',
                project: '1',
                projectId: project.projectId,
                memberId: member.memberId,
                styles: { progressColor: '#90caf9', progressSelectedColor: '#64b5f6' }
            };
            ganttTasks.push(memberTask);
            memberTasks.set(member.memberId, memberTask.id); // Üye ID'sini ve task ID'sini eşleştir
        });
    }

    // Mevcut task'ları ekle
    if (data.tasks && data.tasks.length > 0) {
        data.tasks.forEach((task) => {
            const memberTaskId = memberTasks.get(task.memberId); // Task'ın üyesinin ID'sini bul
            const member = members.find(m => m.memberId === task.memberId); // Üye bilgisini bul
            
            ganttTasks.push({
                id: `${taskIdCounter++}`,
                name: `${task.title} (${member ? member.name : 'Bilinmeyen Üye'})`,
                start: new Date(task.startDate),
                end: new Date(task.endDate),
                progress: 0,
                type: 'task',
                project: memberTaskId || '1', // Eğer üye bulunduysa onun altında göster
                projectId: task.projectId,
                memberId: task.memberId,
                styles: { 
                    progressColor: '#9c27b0', 
                    progressSelectedColor: '#7b1fa2',
                    backgroundColor: '#e1bee7',
                    backgroundSelectedColor: '#ce93d8'
                }
            });
        });
    }

    console.log("Dönüştürülen veri:", [mainProject, ...ganttTasks]);
    return [mainProject, ...ganttTasks];
}

export default transformProjectToGanttData;
