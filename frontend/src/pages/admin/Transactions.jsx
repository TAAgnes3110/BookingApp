import React, { useState } from 'react';
import { Search, Download, ArrowUpRight, ArrowDownLeft, FileText, X } from 'lucide-react';
import Modal from '../../components/common/Modal';

const Transactions = () => {
  // TODO: Backend Integration - Fetch transactions from API
  // useEffect(() => {
  //   fetchTransactions().then(data => setTransactions(data));
  // }, []);

  const [transactions] = useState([
    { id: 'TRX-001', user: 'Nguyen Van A', type: 'Payment', amount: '+500,000 ₫', status: 'Completed', date: '2023-12-09 10:30', method: 'Credit Card', note: 'Booking #101' },
    { id: 'TRX-002', user: 'Tran Thi B', type: 'Refund', amount: '-200,000 ₫', status: 'Pending', date: '2023-12-09 09:15', method: 'E-Wallet', note: 'Refund for Booking #098' },
    { id: 'TRX-003', user: 'Le Van C', type: 'Payment', amount: '+1,200,000 ₫', status: 'Completed', date: '2023-12-08 14:20', method: 'Bank Transfer', note: 'Booking #105' },
    { id: 'TRX-004', user: 'Pham Van D', type: 'Payment', amount: '+350,000 ₫', status: 'Failed', date: '2023-12-08 11:00', method: 'Credit Card', note: 'Booking #104 (Insufficient funds)' },
  ]);

  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrx, setSelectedTrx] = useState(null);

  const filteredTransactions = transactions.filter(trx => {
    const matchType = filterType === 'All' || trx.type === filterType;
    const matchSearch = trx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const handleExport = () => {
    // TODO: Backend Integration - Generate and download report from server if needed
    // or keep using client-side generation if data set is small
    const headers = ['Transaction ID', 'User', 'Type', 'Amount', 'Status', 'Date', 'Method', 'Note'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(trx => [
        trx.id,
        `"${trx.user}"`,
        trx.type,
        `"${trx.amount}"`,
        trx.status,
        trx.date,
        trx.method,
        `"${trx.note}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý giao dịch</h2>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={18} />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Mã giao dịch, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType('All')}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${filterType === 'All' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('Payment')}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${filterType === 'Payment' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Thanh toán
            </button>
            <button
              onClick={() => setFilterType('Refund')}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${filterType === 'Refund' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Hoàn tiền
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Mã GD</th>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Loại</th>
                <th className="px-6 py-4">Số tiền</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((trx, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedTrx(trx)}>
                  <td className="px-6 py-4 font-mono text-gray-500">{trx.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{trx.user}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center">
                      {trx.type === 'Payment' ? <ArrowDownLeft size={16} className="text-green-500 mr-2" /> : <ArrowUpRight size={16} className="text-red-500 mr-2" />}
                      {trx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-bold ${trx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {trx.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{trx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${trx.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      trx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                    <FileText size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={!!selectedTrx}
        onClose={() => setSelectedTrx(null)}
        title="Chi tiết giao dịch"
      >
        {selectedTrx && (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">Mã giao dịch</span>
              <span className="font-mono font-bold text-gray-800">{selectedTrx.id}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">Người thực hiện</span>
              <span className="font-medium text-gray-800">{selectedTrx.user}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">Loại giao dịch</span>
              <span className={`font-medium ${selectedTrx.type === 'Payment' ? 'text-green-600' : 'text-red-600'}`}>{selectedTrx.type}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">Số tiền</span>
              <span className={`font-bold text-lg ${selectedTrx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{selectedTrx.amount}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Phương thức</div>
                <div className="font-medium text-gray-800">{selectedTrx.method || 'N/A'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Thời gian</div>
                <div className="font-medium text-gray-800">{selectedTrx.date}</div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Ghi chú</div>
              <div className="text-sm text-gray-800">{selectedTrx.note || 'Không có ghi chú'}</div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setSelectedTrx(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Transactions;
