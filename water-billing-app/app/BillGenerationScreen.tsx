import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { getCustomerByAccount, calculateBill, generateInvoice } from '../services/api';

export default function BillGenerationScreen() {
  const [formData, setFormData] = useState({
    accountNo: '',
    name: '',
    previousReading: 0,
    presentReading: '',
    fixedAmount: '',
    additionalCharges: 0,
    otherCharges: 0,
    totalamount: 0,
    balanceforpay: 0,
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPreviousReadingEditable, setIsPreviousReadingEditable] = useState(false);

  const handleAccountLookup = async () => {
    if (!formData.accountNo) {
      setError('Please enter an account number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await getCustomerByAccount(formData.accountNo);
      setFormData(prev => ({
        ...prev,
        name: response.data.name,
        previousReading: response.data.previousReading,
        fixedAmount: response.data.FixedCharge
      }));
      
      setIsPreviousReadingEditable(
        response.data.previousReading === 0 ||
        response.data.previousReading === null ||
        response.data.previousReading === ''
      );
    } catch (error) {
      setError('Error fetching customer details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.previousReading === null) return;
    
    if (formData.presentReading === '') {
      setError('');
    } else if (parseInt(formData.presentReading, 10) < parseInt(formData.previousReading.toString(), 10)) {
      setError(`Present reading should be greater than ${formData.previousReading}`);
    } else {
      setError('');
    }
  }, [formData.presentReading, formData.previousReading]);

  const handleCalculate = async () => {
    if (!formData.presentReading || !formData.previousReading) {
      setError('Please enter both readings');
      return;
    }
    
    if (parseInt(formData.presentReading, 10) < parseInt(formData.previousReading.toString(), 10)) {
      setError(`Present reading should be greater than ${formData.previousReading}`);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        accountNo: parseInt(formData.accountNo),
        presentReading: parseInt(formData.presentReading),
        previousReading: parseInt(formData.previousReading.toString()),
        additionalcharge: parseFloat(formData.additionalCharges.toString()),
        othercharges: parseFloat(formData.otherCharges.toString())
      };
      
      const response = await calculateBill(payload);
      setFormData(prev => ({
        ...prev,
        totalamount: response.data.totalamount,
        balanceforpay: response.data.balanceforpay
      }));
    } catch (error) {
      setError('Error calculating bill');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!formData.totalamount) {
      setError('Please calculate the bill first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const invoiceDTO = {
        accountNo: parseInt(formData.accountNo),
        presentReading: parseInt(formData.presentReading),
        previousReading: parseInt(formData.previousReading.toString()),
        additionalcharge: parseFloat(formData.additionalCharges.toString()),
        othercharges: parseFloat(formData.otherCharges.toString()),
      };
      
      await generateInvoice(invoiceDTO);
      
      Alert.alert(
        'Success',
        'Invoice generated successfully!',
        [{ text: 'OK', onPress: () => router.replace('/HomeScreen') }]
      );
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError(error.response.data?.data || 'Validation error');
      } else {
        setError('Error generating invoice');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.formContainer}>
        <Text style={styles.title}>Generate Water Bill</Text>
        
        <View style={styles.row}>
          <TextInput
            label="Account No"
            value={formData.accountNo}
            onChangeText={(value) => setFormData({...formData, accountNo: value})}
            style={[styles.input, styles.flex1]}
            keyboardType="numeric"
          />
          <Button 
            mode="contained" 
            onPress={handleAccountLookup}
            style={styles.lookupButton}
            disabled={loading}
          >
            Lookup
          </Button>
        </View>
        
        <TextInput
          label="Customer Name"
          value={formData.name}
          style={styles.input}
          disabled
        />
        
        <View style={styles.row}>
          <TextInput
            label="Previous Reading"
            value={formData.previousReading.toString()}
            onChangeText={(value) => setFormData({...formData, previousReading: parseInt(value) || 0})}
            style={[styles.input, styles.flex1]}
            keyboardType="numeric"
            disabled={!isPreviousReadingEditable}
          />
          <TextInput
            label="Present Reading"
            value={formData.presentReading}
            onChangeText={(value) => setFormData({...formData, presentReading: value})}
            style={[styles.input, styles.flex1]}
            keyboardType="numeric"
          />
        </View>
        
        {isPreviousReadingEditable && (
          <Text style={styles.helperText}>No previous reading found. Please enter manually.</Text>
        )}
        
        <TextInput
          label="Fixed Amount"
          value={formData.fixedAmount.toString()}
          style={styles.input}
          disabled
        />
        
        <View style={styles.row}>
          <TextInput
            label="Additional Charges"
            value={formData.additionalCharges.toString()}
            onChangeText={(value) => setFormData({...formData, additionalCharges: parseFloat(value) || 0})}
            style={[styles.input, styles.flex1]}
            keyboardType="numeric"
          />
          <TextInput
            label="Other Charges"
            value={formData.otherCharges.toString()}
            onChangeText={(value) => setFormData({...formData, otherCharges: parseFloat(value) || 0})}
            style={[styles.input, styles.flex1]}
            keyboardType="numeric"
          />
        </View>
        
        <Button 
          mode="contained" 
          onPress={handleCalculate}
          style={styles.button}
          disabled={loading || !formData.accountNo || !formData.presentReading}
        >
          Calculate Bill
        </Button>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Bill Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={styles.summaryValue}>Rs. {formData.totalamount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Balance to Pay:</Text>
            <Text style={styles.summaryValue}>Rs. {formData.balanceforpay.toFixed(2)}</Text>
          </View>
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        {loading && <ActivityIndicator style={styles.loader} />}
        
        <Button 
          mode="contained" 
          onPress={handleGenerateInvoice}
          style={[styles.button, styles.generateButton]}
          disabled={loading || !formData.totalamount}
        >
          Generate Invoice
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={() => router.back()}
          style={styles.button}
        >
          Cancel
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0066cc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  input: {
    marginBottom: 15,
  },
  lookupButton: {
    alignSelf: 'center',
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  generateButton: {
    backgroundColor: '#10b981',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  helperText: {
    color: 'orange',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 10,
  },
  summaryContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0066cc',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontWeight: '500',
  },
  summaryValue: {
    fontWeight: 'bold',
  },
});
