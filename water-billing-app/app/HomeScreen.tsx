import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

interface AuthContextType {
  user: { name?: string } | null;
  logout: () => Promise<void>;
}

export default function HomeScreen() {
  const { user, logout } = useContext(AuthContext) as AuthContextType;

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Water Billing System</Text>
        <Button mode="text" onPress={handleLogout}>Logout</Button>
      </Surface>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, {user?.name || 'User'}</Text>
        
        <Surface style={styles.card}>
          <Text style={styles.cardTitle}>Generate Water Bill</Text>
          <Text style={styles.cardDescription}>
            Create new water bills by entering meter readings and customer details
          </Text>
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => router.push('/BillGenerationScreen')}
          >
            Generate Bill
          </Button>
        </Surface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    color: '#666',
    marginBottom: 15,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
});
