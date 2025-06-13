"use client";

import { useEffect, useState } from "react";
import { Card } from "@heroui/react";

export default function ProductivityReport() {
  const [report, setReport] = useState([]);
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});

  const fetchData = async () => {
    const params = new URLSearchParams();

    if (range.from) params.set("startDate", range.from.toISOString());
    if (range.to) params.set("endDate", range.to.toISOString());

    const res = await fetch(`/api/reports/productivity?${params.toString()}`);
    const data = await res.json();

    setReport(data);
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Relatório de Produtividade</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Filtrar por período</h2>
        {/* Você pode substituir isso por qualquer DateRangePicker */}
        <input
          type="date"
          onChange={(e) =>
            setRange((prev) => ({ ...prev, from: new Date(e.target.value) }))
          }
        />
        <input
          type="date"
          onChange={(e) =>
            setRange((prev) => ({ ...prev, to: new Date(e.target.value) }))
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {report.map((item: any) => (
          <Card key={item.staffId} className="p-4">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p>Tarefas concluídas: {item.completedTasks}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
