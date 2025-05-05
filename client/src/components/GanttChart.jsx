import React from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

const GanttChart = ({ data }) => {
  const handleTaskClick = (task) => {
    console.log("Tıklanan görev:", task);
  };

  const handleProgressChange = async (task) => {
    console.log("İlerleme değişti:", task);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="text-xl font-semibold mb-4">Proje Gantt Şeması</h2>
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
                }}
              >
                <div className="w-1/2">{task.name}</div>
                <div className="w-1/4">{task.start.toLocaleDateString('tr-TR')}</div>
                <div className="w-1/4">{task.end.toLocaleDateString('tr-TR')}</div>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default GanttChart;