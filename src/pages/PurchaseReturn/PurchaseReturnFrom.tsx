import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Plus, Trash2, Calculator } from "lucide-react";

// ✅ Dummy supplier and product data (replace with API later)
const suppliers = [
  { _id: "sup1", compid: "INFLAME01", compname: "ABC Traders" },
  { _id: "sup2", compid: "INFLAME02", compname: "Eco Supplies" },
];

const products = [
  { _id: "p1", productName: "Laptop", productcode: "LAP-101", sprice: 50000 },
  { _id: "p2", productName: "Phone", productcode: "PHN-202", sprice: 20000 },
  { _id: "p3", productName: "Headphone", productcode: "HDP-303", sprice: 3000 },
];

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  compid: yup.string().required("Supplier is required"),
  invoice_no: yup.string().required("Invoice No is required"),
  returnDate: yup.date().required("Return date is required"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        productID: yup.string().required("Select product"),
        quantity: yup
          .number()
          .positive("Must be positive")
          .required("Quantity required"),
      })
    )
    .min(1, "At least one product must be added"),
  paidAmount: yup.number().min(0, "Paid amount cannot be negative"),
});

export const PurchaseReturnForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      compid: "",
      invoice_no: "",
      returnDate: "",
      items: [{ productID: "", quantity: 1, unitPrice: 0, subtotal: 0 }],
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");
  const watchPaid = watch("paidAmount");

  // ✅ Auto-update unitPrice + subtotal when product changes
  useEffect(() => {
    watchItems.forEach((item, index) => {
      const product = products.find((p) => p._id === item.productID);
      if (product) {
        setValue(`items.${index}.unitPrice`, product.sprice);
        setValue(
          `items.${index}.subtotal`,
          item.quantity * product.sprice || 0
        );
      }
    });

    // ✅ Recalculate totals
    const total = watchItems.reduce(
      (sum, item) => sum + (item.subtotal || 0),
      0
    );
    setValue("totalAmount", total);
    setValue("dueAmount", total - (watchPaid || 0));
  }, [watchItems, watchPaid, setValue]);

  const onSubmit = (data: any) => {
    console.log("Purchase Return Data:", data);
    alert("Purchase Return Submitted! Check console.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-2xl shadow-md space-y-6"
    >
      <h2 className="text-xl font-bold">Purchase Return Form</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Supplier Selection */}
        <div>
          <label className="block text-sm font-medium">Supplier</label>
          <select {...register("compid")} className="w-full border p-2 rounded">
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s.compid}>
                {s.compname}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm">{errors.compid?.message}</p>
        </div>

        {/* Invoice No */}
        <div>
          <label className="block text-sm font-medium">Invoice No</label>
          <input
            {...register("invoice_no")}
            className="w-full border p-2 rounded"
            placeholder="INV-2025-002"
          />
          <p className="text-red-500 text-sm">{errors.invoice_no?.message}</p>
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-sm font-medium">Return Date</label>
          <input
            type="date"
            {...register("returnDate")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.returnDate?.message}</p>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="font-semibold mb-2">Return Items</h3>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-5 gap-2 items-center mb-2"
            >
              {/* Product */}
              <select
                {...register(`items.${index}.productID`)}
                className="border p-2 rounded"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.productName}
                  </option>
                ))}
              </select>

              {/* Unit Price */}
              <input
                type="number"
                {...register(`items.${index}.unitPrice`)}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />

              {/* Quantity */}
              <input
                type="number"
                {...register(`items.${index}.quantity`)}
                className="border p-2 rounded"
              />

              {/* Subtotal */}
              <input
                type="number"
                {...register(`items.${index}.subtotal`)}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                <Trash2 size={16} className="mr-1" /> Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({ productID: "", quantity: 1, unitPrice: 0, subtotal: 0 })
            }
            className="flex items-center bg-green-500 text-white px-3 py-1 rounded"
          >
            <Plus size={16} className="mr-1" /> Add Product
          </button>
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Total:</span>
            <span>{watch("totalAmount")}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid:</span>
            <input
              type="number"
              {...register("paidAmount")}
              className="border p-1 rounded w-32"
            />
          </div>
          <div className="flex justify-between">
            <span>Due:</span>
            <span>{watch("dueAmount")}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center"
        >
          <Calculator className="mr-2" /> Submit Purchase Return
        </button>
      </form>
    </motion.div>
  );
};
