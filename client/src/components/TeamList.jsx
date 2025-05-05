import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";


function TeamList() {

const [teams,setTeams] = useState([]);
const navigate = useNavigate();

useEffect(() =>
{
axios.get("https://localhost:7216/api/Teams/WithProjects")
.then((res) => setTeams(res.data))
.catch((err) => console.log(err));

},[]);



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
              ]}
            >
              <p>Proje: {team.projectName}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default TeamList