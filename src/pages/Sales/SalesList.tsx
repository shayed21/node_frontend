import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye, Calendar, Download } from "lucide-react";
import axios from "axios";
import { api } from "../../api";

export const SalesList: React.FC = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all"); 
  const [loading, setLoading] = useState(true);

  const fetchSales = () => {
    setLoading(true);
    axios
      .get(api.allSale)
      .then((res) => setSales(res.data))
      .catch((err) => {
        console.error(err);
        setSales([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/sale/${id}`);
      setSales((prev) => prev.filter((sale) => sale._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete sale.");
    }
  };

  const handleDownload = (id: string) => {
    console.log("Download invoice for sale:", id);
  };

  const filteredSales = sales.filter((sale) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      sale.invoice_no?.toLowerCase().includes(term) ||
      sale.customerName?.toLowerCase().includes(term);
    const matchesStatus =
      selectedStatus === "all" ||
      sale.sstatus?.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const stats = useMemo(() => {
    const currency = (n: number) =>
      (n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });

    const total = sales.reduce((a, s) => a + (Number(s.totalAmount) || 0), 0);

    const pendingList = sales.filter(
      (s) => (s.sstatus || "").toLowerCase() === "pending"
    );
    const pendingTotal = pendingList.reduce(
      (a, s) => a + (Number(s.totalAmount) || 0),
      0
    );

    const paidList = sales.filter(
      (s) => (s.sstatus || "").toLowerCase() === "paid"
    );
    const paidTotal = paidList.reduce(
      (a, s) => a + (Number(s.totalAmount) || 0),
      0
    );

    const now = new Date();
    const thisMonthList = sales.filter((s) => {
      const d = new Date(s.saleDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisMonthTotal = thisMonthList.reduce(
      (a, s) => a + (Number(s.totalAmount) || 0),
      0
    );

    return [
      { label: "Total Sales", value: currency(total), change: `${sales.length} invoices`, color: "text-blue-600" },
      { label: "Pending Invoices", value: currency(pendingTotal), change: `${pendingList.length} invoice${pendingList.length !== 1 ? "s" : ""}`, color: "text-yellow-600" },
      { label: "Paid", value: currency(paidTotal), change: `${paidList.length} invoices`, color: "text-green-600" },
      { label: "This Month", value: currency(thisMonthTotal), change: `${thisMonthList.length} invoices`, color: "text-green-600" },
    ];
  }, [sales]);

  return (
    <div className="space-y-6">
      {/* Header) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage sales invoices and orders</p>
        </div>
        <button
          onClick={() => navigate("/sales/new")}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Sale
        </button>
      </motion.div>

      {/* Stats Cards  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            <p className={`text-sm ${stat.color} mt-1`}>{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters  */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sales Table  */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No sales found.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Invoice No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Due
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSales.map((sale, index) => (
                  <motion.tr
                    key={sale._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {sale.invoice_no}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sale.customerName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${Number(sale.totalAmount || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ${Number(sale.dueamount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sale.sstatus)}`}>
                        {sale.sstatus || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/sales/${sale._id}`)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(sale._id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/sales/${sale._id}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sale._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};
