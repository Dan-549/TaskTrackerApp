import { useEffect, useState } from 'react';
import { getTasks } from '../../api/tasks';

export const useTasks = () => {
const [tasks, setTasks] = useState([]);

useEffect(() => {
fetchTasks();
}, []);

const fetchTasks = async () => {
const data = await getTasks();
setTasks(data);
};

return { tasks, fetchTasks };
};