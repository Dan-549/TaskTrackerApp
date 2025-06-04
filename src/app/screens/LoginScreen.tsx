import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../services/firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        console.log('Login button pressed');
        console.log('Email:', email);
        console.log('Password:', password);

        if (!email || !password) {
            console.log('Missing email or password');
            setError('Please fill in all fields');
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            console.log('Attempting login...');
            setIsLoading(true);
            setError('');
            
            // Attempt to sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('Login successful');
            console.log('User:', user.email);
            Alert.alert('Success', 'Logged in successfully!');
            
            router.push('./TaskListScreen');
        } catch (error: any) {
            // Handle specific Firebase auth errors
            let errorMessage = 'Failed to login. Please try again.';
            
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            }
            
            console.error('Login error:', error.code, error.message);
            setError(errorMessage);
            Alert.alert('Login Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setError('');
                        console.log('Email changed:', text);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setError('');
                        console.log('Password changed:', text);
                    }}
                    secureTextEntry
                    editable={!isLoading}
                />
                
                <TouchableOpacity 
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>


                <TouchableOpacity 
                    style={styles.signUpLink}
                    onPress={() => {
                        console.log('Navigate to signup');
                        router.push('./SignupScreen');
                    }}
                    disabled={isLoading}
                >
                    <Text style={styles.signUpLinkText}>
                        Don't have an account? Sign Up
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
    loginButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonDisabled: {
        backgroundColor: '#007AFF80',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff3b30',
        marginBottom: 15,
        textAlign: 'center',
    },
    signUpLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    signUpLinkText: {
        color: '#007AFF',
        fontSize: 16,
    },
    testButton: {
        backgroundColor: '#34C759',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    testButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 