import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { api } from "../../api";

// Yup schema based on Mongoose partySchema
const schema = yup.object({
  compid: yup
    .string()
    .max(20, "Company ID must be at most 20 characters")
    .required("Company ID is required"),

  compname: yup
    .string()
    .max(100, "Company name must be at most 100 characters")
    .nullable(),

  mobile: yup
    .string()
    .max(15, "Mobile number must be at most 15 characters")
    .nullable(),

  email: yup
    .string()
    .email("Invalid email")
    .max(100, "Email must be at most 100 characters")
    .nullable(),

  address: yup
    .string()
    .max(100, "Address must be at most 100 characters")
    .nullable(),

  balance: yup
    .number()
    .nullable(),

  notes: yup
    .string()
    .max(50, "Notes must be at most 50 characters")
    .nullable(),

  status: yup
    .string()
    .oneOf(["Active", "Inactive"], "Invalid status")
    .required("Status is required"),

  regby: yup
    .number()
    .nullable(),

  upby: yup
    .number()
    .nullable(),
});

type FormData = yup.InferType<typeof schema>;

export const PartyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      compid: "",
      compname: "",
      mobile: "",
      email: "",
      address: "",
      balance: 0,
      notes: "",
      status: "Active",
      regby: undefined,
      upby: undefined,
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      axios
        .get(`${api.party}/${id}`)
        .then((res) => {
          reset({
            ...res.data,
            balance: res.data.balance ?? 0,
            status: res.data.status ?? "Active",
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isEdit, id, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        await axios.put(`${api.party}/${id}`, data);
      } else {
        await axios.post(api.party, data);
      }
      console.log(data);
      navigate("/parties");
    } catch (err) {
      alert("Failed to save party. Please check your input and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4"
      >
        <button
          onClick={() => navigate("/parties")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Party" : "Add New Party"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit
              ? "Update party information"
              : "Enter party details to add to your contacts"}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Party Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company ID *
              </label>
              <input
                {...register("compid")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company ID"
              />
              {errors.compid && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.compid.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name
              </label>
              <input
                {...register("compname")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company name"
              />
              {errors.compname && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.compname.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile
              </label>
              <input
                {...register("mobile")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter mobile number"
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                {...register("address")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Balance
              </label>
              <input
                {...register("balance")}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <input
                {...register("notes")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter notes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate("/parties")}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center"
          >
            {isSubmitting || loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            {isEdit ? "Update Party" : "Add Party"}
          </button>
        </motion.div>
      </form>
    </div>
  );
};
