import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    borderBottomStyle: 'solid',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
    borderRightStyle: 'solid',
  },
  col50: { width: '50%' },
  col70: { width: '70%' },
  col30: { width: '30%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#555555',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  summaryLabel: {
    width: '50%',
    fontSize: 10,
    fontWeight: 'bold',
  },
  summaryValue: {
    width: '50%',
    fontSize: 10,
    textAlign: 'right',
  },
  profitValue: {
    color: '#10b981',
  },
  lossValue: {
    color: '#ef4444',
  },
  expenseHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 5,
    fontSize: 10,
  },
});

const IncomeStatementDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.orgName}>Pahalagalathura Community-based Organization</Text>
          <Text style={styles.orgAddress}>Pahalagalathura, Kiriella</Text>
          <Text style={styles.orgAddress}>Contact: +94 74 052 8469</Text>
        </View>
      </View>

      <Text style={styles.title}>
        Income Statement - {data.year}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Revenue:</Text>
          <Text style={styles.summaryValue}>Rs. {data.totalRevenue.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Expenses:</Text>
          <Text style={styles.summaryValue}>Rs. {data.totalCost.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{data.profitLoss < 0 ? 'Net Loss:' : 'Net Profit:'}</Text>
          <Text style={[styles.summaryValue, data.profitLoss < 0 ? styles.lossValue : styles.profitValue]}>
            Rs. {Math.abs(data.profitLoss).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Income Statement</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.col70]}>Item</Text>
            <Text style={[styles.tableCell, styles.col30]}>Amount (Rs.)</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col70, { fontWeight: 'bold' }]}>Revenue</Text>
            <Text style={[styles.tableCell, styles.col30]}>{data.totalRevenue.toFixed(2)}</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col70, { fontWeight: 'bold' }]}>Expenses</Text>
            <Text style={[styles.tableCell, styles.col30]}></Text>
          </View>
          
          {data.costBreakdown.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col70]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.col30]}>{item.cost.toFixed(2)}</Text>
            </View>
          ))}
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col70, { fontWeight: 'bold' }]}>Total Expenses</Text>
            <Text style={[styles.tableCell, styles.col30]}>{data.totalCost.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.col70]}>{data.profitLoss < 0 ? 'Net Loss' : 'Net Profit'}</Text>
            <Text style={[styles.tableCell, styles.col30]}>{Math.abs(data.profitLoss).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
      </Text>
    </Page>
  </Document>
);

export default IncomeStatementDocument;
