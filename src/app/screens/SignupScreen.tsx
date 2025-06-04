import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db, firebaseApp, googleProvider } from '../../services/firebase';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [age, setAge] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    // Verify Firebase initialization
    useEffect(() => {
        const checkFirebase = async () => {
            try {
                console.log('Checking Firebase initialization status...');
                
                if (!firebaseApp || !auth) {
                    throw new Error('Firebase not initialized');
                }

                // Test auth state
                const unsubscribe = auth.onAuthStateChanged(
                    (user: User | null) => {
                        console.log('Auth state initialized:', user ? 'user logged in' : 'no user');
                        setIsInitialized(true);
                    },
                    (error: Error) => {
                        console.error('Auth state error:', error);
                        Alert.alert('Error', 'Failed to initialize authentication. Please try again later.');
                        setIsInitialized(false);
                    }
                );

                return () => unsubscribe();
            } catch (error) {
                console.error('Firebase initialization check failed:', error);
                Alert.alert('Error', 'Failed to initialize Firebase. Please try again later.');
                setIsInitialized(false);
            }
        };

        checkFirebase();
    }, []);

    const handleSignUp = async () => {
        if (!isInitialized) {
            Alert.alert('Error', 'Please wait for authentication to initialize');
            return;
        }

        console.log('Starting signup process...');
        
        if (!name || !email || !password || !confirmPassword || !age) {
            setError('Please fill in all fields');
            return;
        }

        const ageNumber = parseInt(age);
        if (isNaN(ageNumber) || ageNumber < 13 || ageNumber > 120) {
            setError('Please enter a valid age between 13 and 120');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            console.log('Attempting to create user with email:', email);
            setIsLoading(true);
            setError('');
            
            // Create user with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User created successfully:', user.email);

            // Update user profile with name
            console.log('Updating user profile...');
            await updateProfile(user, {
                displayName: name
            });
            
            // Store user data in Firestore
            console.log('Storing user data in Firestore...');
            await setDoc(doc(db, 'User', user.uid), {
                uid: user.uid,
                name: name,
                email: user.email,
                age: ageNumber,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            console.log('Profile and Firestore data updated successfully');
            Alert.alert('Success', 'Account created successfully!');
            router.push('./TaskListScreen');
        } catch (error: any) {
            console.error('Signup error details:', {
                code: error.code,
                message: error.message,
                fullError: error,
                authConfig: auth?.config
            });

            // Handle specific Firebase auth errors
            let errorMessage = 'Failed to create account. Please try again.';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.code === 'auth/configuration-not-found') {
                errorMessage = 'Authentication service not properly configured. Please check Firebase Console settings.';
            }
            
            setError(errorMessage);
            Alert.alert('Signup Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!isInitialized) {
            Alert.alert('Error', 'Please wait for authentication to initialize');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            // Sign in with Google
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Check if user document already exists
            const userDoc = await getDoc(doc(db, 'User', user.uid));
            
            if (!userDoc.exists()) {
                // Create new user document if it doesn't exist
                await setDoc(doc(db, 'User', user.uid), {
                    uid: user.uid,
                    name: user.displayName || '',
                    email: user.email || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
            
            console.log('Google sign-in successful');
            Alert.alert('Success', 'Signed in with Google successfully!');
            router.push('./TaskListScreen');
        } catch (error: any) {
            console.error('Google sign-in error:', error);
            let errorMessage = 'Failed to sign in with Google. Please try again.';
            
            if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Please allow popups for this website.';
            } else if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in was cancelled.';
            }
            
            setError(errorMessage);
            Alert.alert('Sign-in Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        setError('');
                    }}
                    editable={!isLoading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setError('');
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Age"
                    value={age}
                    onChangeText={(text) => {
                        setAge(text);
                        setError('');
                    }}
                    keyboardType="numeric"
                    editable={!isLoading}
                    maxLength={3}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setError('');
                    }}
                    secureTextEntry
                    editable={!isLoading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        setError('');
                    }}
                    secureTextEntry
                    editable={!isLoading}
                />
                
                <TouchableOpacity 
                    style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                    onPress={handleSignUp}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
                    onPress={handleGoogleSignIn}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.googleButtonText}>Sign in with Google</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.loginLink}
                    onPress={() => router.push('./LoginScreen')}
                    disabled={isLoading}
                >
                    <Text style={styles.loginLinkText}>
                        Already have an account? Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    signUpButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    signUpButtonDisabled: {
        backgroundColor: '#007AFF80',
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff3b30',
        marginBottom: 15,
        textAlign: 'center',
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginLinkText: {
        color: '#007AFF',
        fontSize: 16,
    },
    googleButton: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    googleButtonDisabled: {
        backgroundColor: '#4285F480',
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 