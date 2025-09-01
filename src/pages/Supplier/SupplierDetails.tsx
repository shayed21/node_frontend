import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import axiosInstance from "../../axiosInstance";

const SupplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(supplier);
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axiosInstance.get(`supplier/supplier/${id}`);
        setSupplier(res.data.data);
      } catch (err) {
        console.error("Error fetching supplier details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!supplier) {
    return (
      <div className="text-center py-12 text-red-500">Supplier not found.</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/supplier")}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Supplier Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Information about the selected supplier
            </p>
          </div>
        </div>
      </motion.div>

      {/* Supplier Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {supplier.supplierName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {supplier.compName}
        </p>

        <div className="space-y-4">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Mail className="w-5 h-5 mr-3" />
            <span>{supplier.email}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Phone className="w-5 h-5 mr-3" />
            <span>{supplier.mobile}</span>
          </div>
          <div className="flex items-start text-gray-700 dark:text-gray-300">
            <MapPin className="w-5 h-5 mr-3 mt-1" />
            <span>{supplier.address}</span>
          </div>
        </div>

        {/* Balance & Status */}
        <div className="mt-6 border-t pt-4 flex justify-between items-center">
          <div>
            <span className="text-gray-500 text-sm">Balance</span>
            <p
              className={`font-semibold ${
                supplier.balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${Math.abs(supplier.balance).toFixed(2)}{" "}
              {supplier.balance < 0 ? "(Due)" : ""}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Status</span>
            <p
              className={`font-semibold ${
                supplier.status === "active"
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {supplier.status}
            </p>
          </div>
        </div>

        {/* Registered Info */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Registered:{" "}
          {supplier.regdate
            ? new Date(supplier.regdate).toLocaleString()
            : "N/A"}
        </div>
      </motion.div>
    </div>
  );
};

export default SupplierDetails;
