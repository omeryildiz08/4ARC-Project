import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Button, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from '@ant-design/icons';

function TeamList() {
  const [teams, setTeams] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get("https://localhost:7216/api/Teams/WithProjects");
      setTeams(response.data);
    } catch (err) {
      console.error("Takımlar yüklenirken hata:", err);
      message.error("Takımlar yüklenirken bir hata oluştu");
    }
  };

  const handleDeleteClick = (team) => {
    setSelectedTeam(team);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://localhost:7216/api/Teams/${selectedTeam.teamId}/Project`);
      message.success("Proje başarıyla silindi");
      setIsModalVisible(false);
      fetchTeams(); // Listeyi yenile
    } catch (err) {
      console.error("Proje silinirken hata:", err);
      message.error("Proje silinirken bir hata oluştu");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Projeleri Olan Takımlar</h2>
      <Row gutter={[16, 16]}>
        {teams.map((team) => (
          <Col xs={24} sm={12} md={8} lg={6} key={team.id}>
            <Card
              title={team.teamName}
              bordered={false}
              hoverable
              style={{ textAlign: "center" }}
              actions={[
                <Button type="primary" onClick={() => navigate(`/teams/${team.teamId}`)}>
                  Gantt Şemasını Gör
                </Button>,
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteClick(team)}
                >
                  Sil
                </Button>
              ]}
            >
              <p>Proje: {team.projectName}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Projeyi Sil"
        open={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText="Evet"
        cancelText="İptal"
        okButtonProps={{ danger: true }}
      >
        <p>
          <strong>{selectedTeam?.teamName}</strong> takımının projesini silmek istediğinizden emin misiniz?
          Bu işlem geri alınamaz ve projeye ait tüm veriler silinecektir.
        </p>
      </Modal>
    </div>
  );
}

export default TeamList;