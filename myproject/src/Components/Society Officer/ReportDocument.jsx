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
  col10: { width: '10%' },
  col15: { width: '15%' },
  col20: { width: '20%' },
  col25: { width: '25%' },
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
});

const ReportDocument = ({ data, reportType, description }) => (
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
        {description ? `${description} - ` : ''}
        {reportType === 'monthly' ? 'Monthly' : 'Yearly'} Cost Report - {
          reportType === 'monthly'
            ? data.period.split('-')[0] + ' ' + new Date(data.period + '-01').toLocaleString('default', { month: 'long' })
            : data.period
        }
      </Text>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.col25]}>Total Cost:</Text>
          <Text style={[styles.tableCell, styles.col25]}>Rs. {data.totalCost.toFixed(2)}</Text>
          <Text style={[styles.tableCell, styles.col25]}>Number of Vouchers:</Text>
          <Text style={[styles.tableCell, styles.col25]}>{data.vouchers.length}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voucher Details</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.col10]}>ID</Text>
            <Text style={[styles.tableCell, styles.col20]}>Payee</Text>
            <Text style={[styles.tableCell, styles.col15]}>Date</Text>
            <Text style={[styles.tableCell, styles.col30]}>Description</Text>
            <Text style={[styles.tableCell, styles.col25]}>Amount (Rs.)</Text>
          </View>

          {data.vouchers.map((voucher) => (
            voucher.items.map((item, itemIndex) => (
              <View key={`${voucher.voucherId}-${item.id}`} style={styles.tableRow}>
                {itemIndex === 0 ? (
                  <>
                    <Text style={[styles.tableCell, styles.col10]}>{voucher.voucherId}</Text>
                    <Text style={[styles.tableCell, styles.col20]}>{voucher.payee}</Text>
                    <Text style={[styles.tableCell, styles.col15]}>{voucher.voucherDate}</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.tableCell, styles.col10]}></Text>
                    <Text style={[styles.tableCell, styles.col20]}></Text>
                    <Text style={[styles.tableCell, styles.col15]}></Text>
                  </>
                )}
                <Text style={[styles.tableCell, styles.col30]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.col25]}>{item.cost.toFixed(2)}</Text>
              </View>
            ))
          ))}

          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.col10]}></Text>
            <Text style={[styles.tableCell, styles.col20]}></Text>
            <Text style={[styles.tableCell, styles.col15]}></Text>
            <Text style={[styles.tableCell, styles.col30]}>Total:</Text>
            <Text style={[styles.tableCell, styles.col25]}>{data.totalCost.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
      </Text>
    </Page>
  </Document>
);
export default ReportDocument;
