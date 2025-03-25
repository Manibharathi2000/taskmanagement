import { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Title, TextInput, Button, Card, Text, Group, Select, Modal, ActionIcon, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconCalendar } from '@tabler/icons-react';
import { useAppContext } from '../ApiService/AppProvider';

interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
}

function TaskApp() {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [filter, setFilter] = useState<string>('All');
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState<string>('Pending');
    const [quote, setQuote] = useState<any>(null);

    const { PostApi, GetApi } = useAppContext();

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const url = "quotes";
        GetApi('GET', url, "")
            .then((response) => {
                console.log(response, "Quotes");
                if (response?.data?.quotes?.length) {
                    setQuote(response.data.quotes[0].quote);
                }
            })
            .catch((error) => {
                console.error("Error fetching quote:", error);
            });
    }, []);

    const resetForm = useCallback(() => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('Pending');
        setEditTask(null);
        setIsModalOpen(false);
    }, []);

    const handleSaveTask = useCallback(() => {
        if (editTask) {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === editTask.id ? { ...editTask, title, description, dueDate, completed: status === 'Completed' } : task
                )
            );
            setEditTask(null);
        } else {
            const newTask: Task = {
                id: Date.now(),
                title,
                description,
                dueDate,
                completed: status === 'Completed',
            };
            setTasks((prevTasks) => [...prevTasks, newTask]);
        }
        resetForm();
    }, [editTask, title, description, dueDate, status, resetForm]);

    const deleteTask = useCallback((id: number) => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
    }, []);

    const editExistingTask = useCallback((task: Task) => {
        setEditTask(task);
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.dueDate);
        setStatus(task.completed ? 'Completed' : 'Pending');
        setIsModalOpen(true);
    }, []);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (filter === 'Completed') return task.completed;
            if (filter === 'Pending') return !task.completed;
            return true;
        });
    }, [tasks, filter]);

    return (
        <Container size="md" px="sm">
            <Title mt={20} order={4}>Today Quote: {quote}</Title>

            <Button mt={10} fullWidth onClick={() => { resetForm(); setIsModalOpen(true); }}>Add Task</Button>

            <Select mt={20} data={['All', 'Completed', 'Pending']} value={filter} onChange={(value) => setFilter(value || 'All')} />

            {filteredTasks.map((task) => (
                <Card key={task.id} mt={10} shadow="xl" padding="lg" radius="md" withBorder>
                    <Group mb={10} wrap="wrap">
                        <Text w={700} size="lg">{task.title}</Text>
                    </Group>
                    <Text size="sm" color="gray">{task.description}</Text>
                    <Group mt={10}>
                        <Badge color={task.completed ? 'green' : 'yellow'}>{task.completed ? 'Completed' : 'Pending'}</Badge>
                        <Group gap={5} wrap="wrap">
                            <IconCalendar size={16} />
                            <Text size="xs" color="dimmed">{task.dueDate}</Text>
                        </Group>
                        <Group>
                            <ActionIcon color="blue" variant="light" onClick={() => editExistingTask(task)}>
                                <IconEdit size={20} />
                            </ActionIcon>
                            <ActionIcon color="red" variant="light" onClick={() => deleteTask(task.id)}>
                                <IconTrash size={20} />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Card>
            ))}

            <Modal opened={isModalOpen} onClose={() => setIsModalOpen(false)} title={editTask ? "Edit Task" : "Add Task"} size="sm">
                <TextInput placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} mt={10} />
                <TextInput placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} mt={10} />
                <TextInput type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} mt={10} />
                <Select mt={10} data={['Pending', 'Completed']} value={status} onChange={(value) => setStatus(value || 'Pending')} />
                <Button mt={10} fullWidth onClick={handleSaveTask}>{editTask ? "Update Task" : "Add Task"}</Button>
            </Modal>
        </Container>
    );
}

export default TaskApp;
