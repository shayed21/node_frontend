import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockCustomers = [
  { id: "c1", name: "Alice Johnson" },
  { id: "c2", name: "Bob Smith" },
];

const mockProducts = [
  { id: "p1", name: "Laptop", price: 1200 },
  { id: "p2", name: "Headphones", price: 150 },
  { id: "p3", name: "Keyboard", price: 80 },
];

export default function SaleReturnForm() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerId: "",
      invoiceNumber: "",
      date: new Date().toISOString().split("T")[0],
      items: [{ productId: "", qty: 1, price: 0, total: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const handleProductChange = (index: number, productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.price`, product.price);
      setValue(`items.${index}.total`, (items[index].qty || 1) * product.price);
    }
  };

  const handleQtyChange = (index: number, qty: number) => {
    const price = items[index].price || 0;
    setValue(`items.${index}.total`, qty * price);
  };

  const onSubmit = (data: any) => {
    console.log("Return submitted:", data);
    alert("Return saved (dummy submit)!");
  };

  const grandTotal = items.reduce((sum, i) => sum + (i.total || 0), 0);

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
          onClick={() => navigate("/sales-return")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Return Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a return invoice for customer
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Invoice Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Return Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer *
              </label>
              <select
                {...register("customerId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select customer</option>
                {mockCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Invoice Number *
              </label>
              <input
                {...register("invoiceNumber")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter original invoice"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                {...register("date")}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Products to Return
            </h2>
            <button
              type="button"
              onClick={() =>
                append({ productId: "", qty: 1, price: 0, total: 0 })
              }
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Product
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product *
                  </label>
                  <select
                    {...register(`items.${index}.productId`)}
                    onChange={(e) =>
                      handleProductChange(index, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select product</option>
                    {mockProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Qty *
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.qty`)}
                    defaultValue={1}
                    onChange={(e) =>
                      handleQtyChange(index, Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.price`)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.total`)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Grand Total:
          </h3>
          <span className="text-xl font-bold ">
            ${grandTotal}
          </span>
        </motion.div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Save Return
          </button>
        </div>
      </form>
    </div>
  );
}
