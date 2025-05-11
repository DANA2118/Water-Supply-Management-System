import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #eeeeee',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orgName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orgAddress: {
    fontSize: 10,
    color: '#555555',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    borderBottomStyle: 'solid',
    paddingTop: 5,
    paddingBottom: 5,
  },
  column: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  label: {
    width: '40%',
    fontSize: 10,
    color: '#555555',
  },
  value: {
    width: '60%',
    fontSize: 10,
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    borderTopStyle: 'solid',
    paddingTop: 10,
    fontSize: 10,
    textAlign: 'center',
    color: '#555555',
  },
  thankYou: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    opacity: 0.1,
    transform: 'rotate(-45deg)',
    fontSize: 60,
    color: '#555555',
  },
});

const PaymentConfirmation = ({ paymentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.orgName}>Pahalagalathura Community-based Organization</Text>
          <Text style={styles.orgAddress}>Pahalagalathura, Kiriella</Text>
          <Text style={styles.orgAddress}>Contact: +94 74 052 8469 | Email: info@pahalagalathura.org</Text>
        </View>
      </View>

      <Text style={styles.title}>Payment Confirmation</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Customer Name:</Text>
          <Text style={styles.value}>{paymentData.customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Account Number:</Text>
          <Text style={styles.value}>{paymentData.accountNo}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice ID:</Text>
          <Text style={styles.value}>{paymentData.invoiceId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={styles.value}>Rs. {paymentData.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{paymentData.transactionId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Date:</Text>
          <Text style={styles.value}>{paymentData.paymentDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Time:</Text>
          <Text style={styles.value}>{paymentData.paymentTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.value}>Rs. {paymentData.amountPaid.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Balance Remaining:</Text>
          <Text style={styles.value}>Rs. {paymentData.balanceRemaining.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.thankYou}>Thank you for your payment!</Text>

      <Text style={styles.footer}>
        This is a computer-generated receipt and does not require a signature.
      </Text>
      
      <Text style={styles.watermark}>PAID</Text>
    </Page>
  </Document>
);

export default PaymentConfirmation;
