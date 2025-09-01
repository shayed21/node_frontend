import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import axios from "axios";
import { api } from "../../api"; // Adjust the import path as necessary
export const PartyList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [parties, setParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(api.allParty)
      .then((res) => {
        setParties(res.data);
      })
      .catch(() => setParties([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredParties = parties.filter((party) => {
    const name = party.customerName || "";
    const email = party.email || "";
    const type = party.status || "Inactive";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" ||
      type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  const handleDeleteParty = async (partyId: string) => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      setLoading(true);
      try {
        await axios.delete(`${api.allParty}/${partyId}`);
        setParties(parties.filter((p) => p._id !== partyId));
      } catch (err) {
        alert("Failed to delete party.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Parties
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customers
          </p>
        </div>
        <button
          onClick={() => navigate("/parties/new")}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Party
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search parties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Parties Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParties.map((party, index) => {
            const name =
              party.supplierName || party.compname || party.customerName || "";
            const status = party.status || "Inactive";
            return (
              <motion.div
                key={party._id || party.supplierID || party.customerID}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Party Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {name}
                    </h3>
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
                  <div className="flex items-center space-x-2">
                    <button onClick={() => navigate(`/parties/${party._id}`)}
                       className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/parties/${
                            party._id || party.supplierID || party.customerID
                          }/edit`
                        )
                      }
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteParty(party._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{party.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{party.mobile}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{party.address}</span>
                  </div>
                </div>

                {/* Balance */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Balance:
                    </span>
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
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Transaction:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {party.update
                        ? new Date(party.update).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredParties.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No parties found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedType !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first customer or supplier."}
          </p>
          {!searchTerm && selectedType === "all" && (
            <button
              onClick={() => navigate("/parties/new")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Party
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};
