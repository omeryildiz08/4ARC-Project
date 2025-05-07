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
    // Üyeleri data'dan filtrele
    const memberTasks = data.filter(task => task.memberId);
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
        listCellWidth="300px"
        columnWidth={65}
        locale="tr"
        onDateChange={handleTaskClick}
        onProgressChange={handleProgressChange}
        TooltipContent={({ task }) => {
          return (
            <div className="p-2 bg-white rounded shadow">
              <h3 className="font-bold">{task.name}</h3>
              <p>Başlangıç: {task.start.toLocaleDateString('tr-TR')}</p>
              <p>Bitiş: {task.end.toLocaleDateString('tr-TR')}</p>
              {task.progress !== undefined && (
                <p>İlerleme: %{task.progress}</p>
              )}
            </div>
          );
        }}
        TaskListHeader={({ headerHeight }) => (
          <div className="flex items-center h-full">
            <div className="w-1/2 font-bold">Görev Adı</div>
            <div className="w-1/4 font-bold">Başlangıç</div>
            <div className="w-1/4 font-bold">Bitiş</div>
          </div>
        )}
        TaskListTable={({ rowHeight, rowWidth, tasks, fontFamily, fontSize }) => (
          <div className="flex flex-col">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center border-b"
                style={{
                  height: rowHeight,
                  fontFamily,
                  fontSize,
                  cursor: task.memberId ? 'pointer' : 'default',
                  backgroundColor: task.memberId ? '#f0f7ff' : 'transparent'
                }}
                onClick={() => task.memberId && handleTaskClick(task)}
              >
                <div className="w-1/2">{task.name}</div>
                <div className="w-1/4">{task.start.toLocaleDateString('tr-TR')}</div>
                <div className="w-1/4">{task.end.toLocaleDateString('tr-TR')}</div>
              </div>
            ))}
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