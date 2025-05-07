import React, { useState, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import { Button, Modal, Form, Input, DatePicker, message, Select } from "antd";
import "gantt-task-react/dist/index.css";
import axios from "axios";

const { Option } = Select;

const GanttChart = ({ data, onTaskAdded }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [form] = Form.useForm();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Sadece ana üye task'larını filtrele
    const memberTasks = data.filter(task => 
      task.memberId && 
      task.type === 'task' && 
      !task.name.includes('(')
    );
    console.log("Filtrelenmiş üyeler:", memberTasks);
    setMembers(memberTasks);
  }, [data]);

  const handleTaskClick = (task) => {
    console.log("Tıklanan task:", task);
    if (task.memberId) {
      setSelectedMember(task);
      setIsModalVisible(true);
    }
  };

  const handleProgressChange = async (task) => {
    console.log("İlerleme değişti:", task);
  };

  const handleAddTask = async (values) => {
    try {
      console.log("Mevcut data:", data); // Tüm data'yı kontrol et
      
      // Ana proje task'ını bul (id'si '1' olan)
      const mainProject = data.find(task => task.id === '1');
      console.log("Bulunan ana proje:", mainProject); // Bulunan projeyi kontrol et
      
      if (!mainProject) {
        message.error('Proje bilgisi bulunamadı!');
        return;
      }

      const taskData = {
        ProjectId: mainProject.projectId,
        MemberId: values.memberId,
        Title: values.title,
        Description: values.description,
        StartDate: values.dateRange[0].toISOString(),
        EndDate: values.dateRange[1].toISOString()
      };

      console.log("Gönderilen task verisi:", taskData);

      const response = await axios.post('https://localhost:7216/api/Tasks', taskData);
      console.log("Task ekleme yanıtı:", response.data);
      
      message.success('Task başarıyla eklendi!');
      setIsModalVisible(false);
      form.resetFields();
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (error) {
      console.error('Task eklenirken hata:', error);
      message.error('Task eklenirken bir hata oluştu!');
    }
  };

  const showAddTaskModal = () => {
    console.log("Mevcut üyeler:", members);
    if (members && members.length > 0) {
      setSelectedMember(members[0]);
      setIsModalVisible(true);
    } else {
      message.warning('Önce bir üye eklemelisiniz!');
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Proje Gantt Şeması</h2>
        <Button 
          type="primary" 
          onClick={showAddTaskModal}
        >
          Yeni Task Ekle
        </Button>
      </div>

      <Gantt
        tasks={data}
        viewMode={ViewMode.Day}
        listCellWidth="500px"
        columnWidth={65}
        locale="tr"
        onDateChange={handleTaskClick}
        onProgressChange={handleProgressChange}
        TaskListHeader={({ headerHeight }) => (
          <div className="flex items-center h-full bg-gray-100 px-4">
            <div className="w-2/5 font-bold text-gray-700">Görev Adı</div>
            <div className="w-3/10 font-bold text-gray-700 text-right pr-4">Başlangıç</div>
            <div className="w-3/10 font-bold text-gray-700 text-right pr-4">Bitiş</div>
          </div>
        )}
        TaskListTable={({ rowHeight, rowWidth, tasks, fontFamily, fontSize }) => (
          <div className="flex flex-col">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center border-b hover:bg-gray-50 transition-colors"
                style={{
                  height: rowHeight,
                  fontFamily,
                  fontSize,
                  cursor: task.memberId ? 'pointer' : 'default',
                  backgroundColor: task.memberId ? '#f0f7ff' : 'transparent',
                  padding: '0.5rem 1rem'
                }}
                onClick={() => task.memberId && handleTaskClick(task)}
              >
                <div className="w-2/5 truncate" title={task.name}>
                  {task.name}
                </div>
                <div className="w-3/10 text-gray-600 text-right pr-4">
                  {task.start.toLocaleDateString('tr-TR')}
                </div>
                <div className="w-3/10 text-gray-600 text-right pr-4">
                  {task.end.toLocaleDateString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        )}
        ganttHeight={600}
        barHeight={30}
        barCornerRadius={4}
        barBackgroundColor="#e1bee7"
        progressColor="#9c27b0"
        arrowColor="#666"
        rowHeight={44}
        todayColor="#fafafa"
        TooltipContent={({ task }) => (
          <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-2">{task.name}</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">
                <span className="font-semibold">Başlangıç:</span> {task.start.toLocaleDateString('tr-TR')}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Bitiş:</span> {task.end.toLocaleDateString('tr-TR')}
              </p>
              {task.progress !== undefined && (
                <p className="text-gray-600">
                  <span className="font-semibold">İlerleme:</span> %{task.progress}
                </p>
              )}
            </div>
          </div>
        )}
      />

      <Modal
        title="Yeni Task Ekle"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddTask} layout="vertical">
          <Form.Item
            name="memberId"
            label="Üye Seçin"
            rules={[{ required: true, message: 'Lütfen bir üye seçin' }]}
          >
            <Select 
              placeholder="Üye seçin"
              value={selectedMember?.memberId}
              onChange={(value) => {
                const member = members.find(m => m.memberId === value);
                setSelectedMember(member);
              }}
            >
              {members.map(member => (
                <Option key={member.memberId} value={member.memberId}>
                  {member.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="Task Başlığı"
            rules={[{ required: true, message: 'Lütfen task başlığını girin' }]}
          >
            <Input placeholder="Örn: Login API Tasarımı" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Açıklama"
          >
            <Input.TextArea placeholder="Task ile ilgili detaylı açıklama" />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Tarih Aralığı"
            rules={[{ required: true, message: 'Lütfen tarih aralığını seçin' }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Task Ekle
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GanttChart;