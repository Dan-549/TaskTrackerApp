import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createTask, deleteTask, getTasks, updateTask } from '../../api/tasks';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}

interface TaskData {
    title: string;
    description: string;
    status: Task['status'];
    createdAt?: string;
    updatedAt: string;
}

export default function TaskEditScreen() {
    const { taskId } = useLocalSearchParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<Task['status']>('todo');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (taskId) {
            loadTask();
        }
    }, [taskId]);

    const loadTask = async () => {
        try {
            setIsLoading(true);
            const tasks = await getTasks() as Task[];
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                setTitle(task.title);
                setDescription(task.description || '');
                setStatus(task.status || 'todo');
            }
        } catch (error) {
            console.log('Error: Failed to load task');
            console.error('Load task error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            console.log('Error: Title is required');
            return;
        }

        try {
            setIsLoading(true);
            const taskData: TaskData = {
                title: title.trim(),
                description: description.trim(),
                status,
                updatedAt: new Date().toISOString(),
            };

            if (taskId) {
                // Update existing task
                await updateTask(taskId, taskData);
                console.log('Success: Task updated successfully');
            } else {
                // Create new task
                taskData.createdAt = new Date().toISOString();
                await createTask(taskData);
                console.log('Success: Task created successfully');
            }
            router.push('/screens/TaskListScreen');
        } catch (error) {
            console.log('Error: Failed to save task');
            console.error('Save task error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!taskId) return;

        const confirmDelete = () => {
            try {
                setIsLoading(true);
                deleteTask(taskId);
                console.log('Success: Task deleted successfully');
                router.push('/screens/TaskListScreen');
            } catch (error) {
                console.log('Error: Failed to delete task');
                console.error('Delete task error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        console.log('Confirm Delete: Are you sure you want to delete this task?');
        confirmDelete();
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Task title"
                maxLength={100}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Task description"
                multiline
                numberOfLines={4}
                maxLength={500}
            />

            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
                {['todo', 'in-progress', 'completed'].map((statusOption) => (
                    <TouchableOpacity
                        key={statusOption}
                        style={[
                            styles.statusButton,
                            status === statusOption && styles.statusButtonActive,
                        ]}
                        onPress={() => setStatus(statusOption as Task['status'])}
                    >
                        <Text
                            style={[
                                styles.statusButtonText,
                                status === statusOption && styles.statusButtonTextActive,
                            ]}
                        >
                            {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>
                        {taskId ? 'Update Task' : 'Create Task'}
                    </Text>
                </TouchableOpacity>

                {taskId && (
                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={handleDelete}
                    >
                        <Text style={[styles.buttonText, styles.deleteButtonText]}>
                            Delete Task
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    statusContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    statusButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    statusButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    statusButtonText: {
        color: '#333',
    },
    statusButtonTextActive: {
        color: '#fff',
    },
    buttonContainer: {
        gap: 10,
    },
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ff3b30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: '#ff3b30',
    },
}); 