import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

interface Sale {
  _id: string;
  saleID: number;
  invoice_no: string;
  saleDate: string;
  customerID: number;
  totalAmount: number;
  paidAmount: number;
  dueamount: number;
  discount: string;
  discountType: string;
  discountAmount: number;
  note: string;
  sstatus: string;
  accountType?: string;
  accountNo?: string;
  vType?: string;
  vAmount?: number;
}

const SaleView = () => {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/sale/${id}`)
      .then(res => setSale(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!sale) return <div>Sale not found</div>;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
<div className="space-y-6">
  {/* Back Button */}
  <button
    onClick={() => navigate('/sales')}
    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4"
  >
    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
  </button>

  {/* Card */}
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 space-y-6">
    
    {/* Title */}
    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {sale.invoice_no}
      </h1>
    </div>

    {/* Status */}
    <div className="flex justify-end">
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sale.sstatus)}`}
      >
        {sale.sstatus}
      </span>
    </div>

    {/* Sale Details Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Date:</span> {new Date(sale.saleDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Total Amount:</span> ${sale.totalAmount.toLocaleString()}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Paid Amount:</span> ${sale.paidAmount.toLocaleString()}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Due Amount:</span> ${sale.dueamount.toLocaleString()}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Discount:</span> {sale.discount} ({sale.discountType})
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Payment Method:</span> {sale.accountType || '-'} ({sale.accountNo || '-'})
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Delivery Type:</span> {sale.vType || '-'} (${sale.vAmount?.toLocaleString() || '0'})
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Note:</span> {sale.note || '-'}
        </p>
      </div>
    </div>
  </div>
</div>

  );
};

export default SaleView;
