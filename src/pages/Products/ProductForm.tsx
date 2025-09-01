import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, Upload } from "lucide-react";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

const schema = yup.object({
  productName: yup
    .string()
    .max(50, "Product Name must be at most 50 characters")
    .required("Product Name is required"),

  productcode: yup
    .string()
    .max(30, "Product Code must be at most 30 characters")
    .nullable(),

  supplier: yup.string().required("Supplier is required"),
  categoryID: yup.string().nullable(),

  scid: yup.number().typeError("Subcategory ID must be a number").nullable(),

  unit: yup.string().nullable(),

  pprice: yup
    .number()
    .typeError("Purchase Price must be a number")
    .required("Purchase Price is required"),

  sprice: yup.number().typeError("Selling Price must be a number").nullable(),

  warranty: yup
    .string()
    .max(50, "Warranty must be at most 50 characters")
    .nullable(),

  status: yup
    .string()
    .max(10, "Status must be at most 10 characters")
    .required("Status is required"),

  image: yup
    .string()
    .max(500, "Image path must be at most 500 characters")
    .nullable(),

  regby: yup.string().nullable(),

  regdate: yup.date().default(() => new Date()),

  upby: yup.string().nullable(),

  update: yup.date().default(() => new Date()),
});

type FormData = yup.InferType<typeof schema>;

export const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { user } = useAuth();
  const [categories, setCategories] = useState<
    { _id: string; categoryName: string }[]
  >([]);
  const [suppliers, setSuppliers] = useState<
    { _id: number; sup_id: string; supplierName: string }[]
  >([]);
  const [units, setUnits] = useState<{ _id: string; unitName: string }[]>([]);

  console.log("cat in unts:", categories);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("category/all_category"); 
        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const { data } = await axiosInstance.get("supplier/all_supplier"); 
        setSuppliers(data.data || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    const fetchUnits = async () => {
      try {
        const { data } = await axiosInstance.get("unit/all_units"); 
        setUnits(data.data || []);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    fetchCategories();
    fetchSuppliers();
    fetchUnits();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: isEdit
      ? {
          productName: "iPhone 15 Pro",
          productcode: "IP15P-128",
          categoryID: "1", // string or null
          supplier: 101, // number
          scid: null, // optional subcategory
          unit: 1, // number
          pprice: 750.0, // number
          sprice: 999.99, // number or null
          warranty: "1 year", // string or null
          status: "active", // string, required
          image: "https://example.com/iphone15pro.jpg", // string or null
          regby: null, // string or null
          regdate: new Date(), // auto default
          upby: null,
          update: new Date(),
        }
      : {},
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (user?.compId) {
        formData.append("compid", user.compId.toString());
      }

      if (user?.id) {
        formData.append("regby", user.id);
      }
      if (user?.id) {
        formData.append("upby", user.id);
      }

      if (selectedImages.length > 0) {
        formData.append("image", selectedImages[0]);
      }

      const url = isEdit ? `product/product/${id}` : "product/product";
      const method = isEdit ? "put" : "post";

      const response = await axiosInstance({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response:", response.data);
      navigate("/products");
    } catch (error: any) {
      console.error("Submit error:", error.response?.data || error.message);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
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
          onClick={() => navigate("/products")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit
              ? "Update product information"
              : "Enter product details to add to inventory"}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
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
            {/* productName */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                {...register("productName")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
              {errors.productName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.productName.message}
                </p>
              )}
            </div>

            {/* productcode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Code
              </label>
              <input
                {...register("productcode")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product code"
              />
              {errors.productcode && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.productcode.message}
                </p>
              )}
            </div>

            {/* categoryID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                {...register("categoryID")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat?.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryID && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.categoryID.message}
                </p>
              )}
            </div>

            {/* supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supplier *
              </label>
              <select
                {...register("supplier")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup._id} value={sup.sup_id}>
                    {sup.supplierName}
                  </option>
                ))}
              </select>
              {errors.supplier && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.supplier.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Pricing & Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pricing & Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* sprice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selling Price
              </label>
              <input
                {...register("sprice")}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.sprice && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.sprice.message}
                </p>
              )}
            </div>

            {/* pprice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Purchase Price *
              </label>
              <input
                {...register("pprice")}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.pprice && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.pprice.message}
                </p>
              )}
            </div>

            {/* unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <select
                {...register("unit")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select unit</option>
                {units.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.unitName}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.unit.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Product Images
          </h2>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Drag and drop images here, or click to select
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className=""
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
            >
              Select Images
            </label>
          </div>
        </motion.div>

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {isEdit ? "Update Product" : "Submit Product"}
          </button>
        </motion.div>
      </form>
    </div>
  );
};
