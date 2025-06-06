import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTasks } from '../../app/hooks/useTasks';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export default function TaskListScreen() {
    const { tasks, fetchTasks } = useTasks();

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'completed':
                return '#34C759'; // Green
            case 'in-progress':
                return '#FF9500'; // Orange
            default:
                return '#007AFF'; // Blue
        }
    };

    const handleAddTask = () => {
        router.push('/screens/TaskEditScreen');
    };

    const handleEditTask = (taskId: string) => {
        router.push({
            pathname: '/screens/TaskEditScreen',
            params: { taskId }
        });
    };

    if (!tasks) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Tasks</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddTask}
                >
                    <Text style={styles.addButtonText}>+ Add Task</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.taskList}>
                {tasks.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            No tasks yet. Tap the "+" button to create one!
                        </Text>
                    </View>
                ) : (
                    tasks.map((task) => (
                        <TouchableOpacity
                            key={task.id}
                            style={styles.taskItem}
                            onPress={() => handleEditTask(task.id)}
                        >
                            <View style={styles.taskContent}>
                                <View style={styles.taskHeader}>
                                    <Text style={styles.taskTitle}>
                                        {task.title}
                                    </Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: getStatusColor(task.status) },
                                        ]}
                                    >
                                        <Text style={styles.statusText}>
                                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                        </Text>
                                    </View>
                                </View>
                                {task.description && (
                                    <Text style={styles.taskDescription} numberOfLines={2}>
                                        {task.description}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskList: {
        flex: 1,
        padding: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    taskItem: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    taskContent: {
        gap: 8,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
