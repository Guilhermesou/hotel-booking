'use client'

import { useEffect, useState } from 'react';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [form, setForm] = useState({
        staffId: '',
        description: '',
        dueDate: '',
        status: 'PENDING',
    });

    useEffect(() => {
        fetch('/api/staff').then(res => res.json()).then(setStaffList);
        fetch('/api/staff/tasks').then(res => res.json()).then(setTasks);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/staff/tasks', {
            method: 'POST',
            body: JSON.stringify(form),
        });
        const data = await res.json();
        setTasks(prev => [...prev, data]);
    };

    const updateStatus = async (id: number, status: string) => {
        const res = await fetch(`/api/staff/tasks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });

        if (res.ok) {
            const updatedTask = await res.json();
            setTasks(tasks.map(t => (t.id === id ? updatedTask : t)));
        }
    };


    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Tarefas da Equipe</h2>

            <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                <select
                    value={form.staffId}
                    onChange={e => setForm({ ...form, staffId: e.target.value })}
                    className="border p-2 w-full"
                >
                    <option value="">Selecione o funcionário</option>
                    {staffList.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Descrição da tarefa"
                    className="border p-2 w-full"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />

                <input
                    type="date"
                    className="border p-2 w-full"
                    value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                />

                <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="border p-2 w-full"
                >
                    <option value="PENDING">Pendente</option>
                    <option value="IN_PROGRESS">Em andamento</option>
                    <option value="COMPLETED">Concluída</option>
                </select>

                <button className="bg-green-600 text-white px-4 py-2 rounded">Cadastrar Tarefa</button>
            </form>

            <h3 className="text-lg font-semibold mb-2">Tarefas Registradas</h3>
            <ul className="space-y-2">
                {tasks.map((task: any) => (
                    <li key={task.id} className="border p-3 rounded shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <strong>{task.staff.name}</strong> – {task.description}<br />
                                <small className="text-gray-600">
                                    Status: {task.status} – {new Date(task.dueDate).toLocaleDateString()}
                                </small>
                            </div>

                            <div className="space-x-1">
                                {task.status !== 'IN_PROGRESS' && (
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => updateStatus(task.id, 'IN_PROGRESS')}
                                    >
                                        Em andamento
                                    </button>
                                )}
                                {task.status !== 'COMPLETED' && (
                                    <button
                                        className="text-green-600 hover:underline"
                                        onClick={() => updateStatus(task.id, 'COMPLETED')}
                                    >
                                        Concluir
                                    </button>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
}
