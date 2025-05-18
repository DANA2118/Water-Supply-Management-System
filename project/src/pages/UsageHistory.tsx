import axios from 'axios';
import { format } from 'date-fns';
import { BarChart, Download, Calendar } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';


interface UsageRecord {
  invoiceId: number;
  period: string;
  consumption: number;
  amount: number;
  duedate: string;
  status: string;
}

function UsageHistory() {
  const [history, setHistory] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsageHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<UsageRecord[]>('http://localhost:8082/api/v1/customer/invoices', 
          {
            headers: {Authorization: `Bearer ${token}`},
          }
        )
        setHistory(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch usage history');
      } finally {
        setLoading(false);
      }
    }
    fetchUsageHistory();
  }, []);

  const averageUsage = useMemo(() => {
    if (history.length === 0) return 0;
    const totalUsage = history.reduce((sum, record) => sum + record.consumption, 0);
    return totalUsage / history.length;
  }, [history]);

  const lastBill = useMemo<UsageRecord | null>(() => {
    if (history.length === 0) return null;
    return history.reduce((prev, curr) => 
      curr.invoiceId > prev.invoiceId ? curr : prev
      , history[0]);
  }, [history]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Water Usage History</h1>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">Average Usage</h3>
            </div>
            <p className="text-3xl font-bold">{averageUsage.toFixed(1)} units</p>
            <p className="text-sm text-gray-600">per month</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold">Last Bill</h3>
            </div>{lastBill ?(
              <>
                <p className="text-3xl font-bold">{lastBill.amount} LKR</p>
                <p className="text-sm text-gray-600">{format(new Date(`${lastBill.period}-01`), 'MMMM yyyy')}</p>
              </>
            ) : (
              <p className="text-sm text-gray-600">No bills available</p>
            )}
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold">YTD Usage</h3>
            </div>
            <p className="text-3xl font-bold">{history
                .filter(r => r.period.startsWith(new Date().getFullYear().toString()))
                .reduce((sum, r) => sum + r.consumption, 0)
              } units</p>
            <p className="text-sm text-gray-600">{new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Billing Period', 'Usage(units)', 'Amount (LKR)', 'Due Date', 'Status'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map(record => (
                <tr key={record.invoiceId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(`${record.period}-01`), 'MMMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.consumption}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.amount.toFixed(2)}LKR
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(record.duedate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={record.status === 'PAID' ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                      : record.status === 'UNPAID' ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800" : ""}> {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsageHistory;