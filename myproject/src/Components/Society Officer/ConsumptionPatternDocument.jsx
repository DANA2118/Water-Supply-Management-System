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
  col30: { width: '30%' },
  col40: { width: '40%' },
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
  note: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#555555',
    marginTop: 10,
  },
});

const ConsumptionPatternDocument = ({ data, accountNo }) => {
  // Sort data by year and month
  const sortedData = [...data].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  // Calculate average consumption
  const averageConsumption = data.reduce((sum, item) => sum + item.consumption, 0) / data.length;

  // Get period range
  const startPeriod = `${data[0].month}/${data[0].year}`;
  const endPeriod = `${data[data.length-1].month}/${data[data.length-1].year}`;

  return (
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
          Household Consumption Pattern - Account #{accountNo}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Account Number:</Text>
            <Text style={styles.summaryValue}>{accountNo}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Data Period:</Text>
            <Text style={styles.summaryValue}>{startPeriod} - {endPeriod}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Average Consumption:</Text>
            <Text style={styles.summaryValue}>{averageConsumption.toFixed(2)} units</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Consumption Details</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.col30]}>Year</Text>
              <Text style={[styles.tableCell, styles.col40]}>Month</Text>
              <Text style={[styles.tableCell, styles.col30]}>Consumption (Units)</Text>
            </View>
            
            {sortedData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col30]}>{item.year}</Text>
                <Text style={[styles.tableCell, styles.col40]}>
                  {['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'][item.month - 1]}
                </Text>
                <Text style={[styles.tableCell, styles.col30]}>{item.consumption.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </Text>
      </Page>
    </Document>
  );
};

export default ConsumptionPatternDocument;
