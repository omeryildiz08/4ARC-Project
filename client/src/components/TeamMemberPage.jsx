import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import MemberForm from "../components/MemberForm";

const TeamMemberPage = () => {
  const { teamId } = useParams(); // URL'den takım ID'sini al
  const navigate = useNavigate();

  const handleFinishAll = () => {
    navigate(`/teams/${teamId}/gantt`);
  };

  return (
    <div>
      <MemberForm teamId={teamId} />
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={handleFinishAll}>Devam Et →</button>
      </div>
    </div>
  );
};

export default TeamMemberPage;