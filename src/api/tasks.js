import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const getUserTasksCollection = () => collection(db, 'users', auth.currentUser.uid, 'tasks');

export const createTask = async (task) => {
await addDoc(getUserTasksCollection(), task);
};

export const getTasks = async () => {
const snapshot = await getDocs(getUserTasksCollection());
return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTask = async (taskId, updates) => {
const taskRef = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
await updateDoc(taskRef, updates);
};

export const deleteTask = async (taskId) => {
const taskRef = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
await deleteDoc(taskRef);
};