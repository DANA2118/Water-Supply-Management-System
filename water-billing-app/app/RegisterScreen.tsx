import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { registerUser } from '../services/api';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      // Registration successful, navigate to login
      router.replace('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        
        <TextInput
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
          mode="outlined"
          style={styles.input}
        />
        
        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
        
        <TextInput
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Button 
          mode="contained" 
          onPress={handleRegister} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Register
        </Button>
        
        <View style={styles.loginContainer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0066cc',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 6,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
});
