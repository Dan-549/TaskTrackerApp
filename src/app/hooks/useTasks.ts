import { useEffect, useState } from 'react';
import { getTasks } from '../../api/tasks';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const data = await getTasks() as Task[];
        setTasks(data);
    };

    return { tasks, fetchTasks };
}; 