import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message ?? 'An unknown error occurred.');
      } else {
        router.replace('/HomeScreen');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.formContainer}>
        <Text style={styles.title}>Water Billing System</Text>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Login
        </Button>
        
        <View style={styles.registerContainer}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/RegisterScreen')}>
            <Text style={styles.registerText}>Register</Text>
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
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
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  registerText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
});
