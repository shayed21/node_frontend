import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, } from "lucide-react";
import axios from "axios";

export const ViewParty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [party, setParty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/party/${id}`)
      .then((res) => setParty(res.data))
      .catch(() => setParty(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!party) {
    return (
      <div className="text-center py-12 text-gray-500">
        Party not found.
      </div>
    );
  }

  const name =
    party.supplierName || party.compname || party.customerName || "";
  const status = party.status || "Inactive";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {name}
            </h1>
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                status.toLowerCase() === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Party Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4"
      >
        {/* Contact */}
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Mail className="w-5 h-5 mr-3" />
          {party.email || "N/A"}
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Phone className="w-5 h-5 mr-3" />
          {party.mobile || "N/A"}
        </div>
        <div className="flex items-start text-gray-600 dark:text-gray-400">
          <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          {party.address || "N/A"}
        </div>

        {/* Financial Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Balance:</span>
            <span
              className={`font-semibold ${
                party.balance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              ${Math.abs(party.balance).toFixed(2)}{" "}
              {party.balance < 0 ? "(Due)" : ""}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Last Transaction:</span>
            <span className="text-gray-900 dark:text-white">
              {party.update
                ? new Date(party.update).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
