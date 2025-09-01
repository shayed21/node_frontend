import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDropdowns } from '../../contexts/DropDownContext';
import axios from 'axios';
import { api } from '../../api';



const itemSchema = yup.object({
  productId: yup.string().required('Product is required'),
  description: yup.string().required('Description is required'),
  quantity: yup.number().positive('Quantity must be positive').required('Quantity is required'),
  unitPrice: yup.number().positive('Unit price must be positive').required('Unit price is required'),
});

const schema = yup.object({
  customerId: yup.string().required('Customer is required'),
  invoiceNumber: yup.string().required('Invoice number is required'),
  date: yup.date().required('Date is required'),
  dueDate: yup.date().required('Due date is required'),
  items: yup.array().of(itemSchema).min(1, 'At least one item is required'),
  subtotal: yup.number().min(0, 'Subtotal cannot be negative'),
  taxRate: yup.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%').default(10),
  taxAmount: yup.number().min(0, 'Tax amount cannot be negative'),
  discountType: yup.string().oneOf(['percentage', 'fixed'], 'Invalid discount type').default('percentage'),
  discountValue: yup.number().min(0, 'Discount cannot be negative').default(0),
  discountAmount: yup.number().min(0, 'Discount amount cannot be negative'),
  total: yup.number().min(0, 'Total cannot be negative'),
  paymentMethod: yup.string().required('Payment method is required'),
  paymentStatus: yup.string().oneOf(['paid', 'pending', 'overdue'], 'Invalid payment status').required('Payment status is required'),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

// const mockProducts = [
//   { id: '1', name: 'iPhone 15 Pro', price: 999.99 },
//   { id: '2', name: 'Samsung Galaxy S24', price: 899.99 },
//   { id: '3', name: 'MacBook Air M3', price: 1299.99 },
// ];


export const SalesForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
    const { company, user } = useAuth();
    const {
      customers,
      mobileAccounts,
      bankAccounts,
      cashAccounts,
      expenseTypes,
      supplier,
      loading,
      party,
      product
    } = useDropdowns();

  const partyOptions = party.map(p => ({
  id: p._id,
  name: p.compname,
}));

  const productOptions = product.map(p => ({
  id: p._id,
  name: p.productName,
  price: p.sprice,
}));

const mockProducts = productOptions;


const mockCustomers = partyOptions

console.log(product);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: isEdit ? {
      customerId: '1',
      invoiceNumber: 'INV-2024-001',
      date: new Date('2024-01-15'),
      dueDate: new Date('2024-02-14'),
      items: [
        {
          productId: '1',
          description: 'iPhone 15 Pro - 128GB',
          quantity: 1,
          unitPrice: 999.99,
        },
        {
          productId: '2',
          description: 'Samsung Galaxy S24 - 256GB',
          quantity: 1,
          unitPrice: 899.99,
        },
      ],
      subtotal: 1899.98,
      taxRate: 10,
      taxAmount: 185.00,
      discountType: 'fixed',
      discountValue: 50,
      discountAmount: 50.00,
      total: 2034.98,
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      notes: 'Customer requested express delivery',
    } : {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      items: [{ productId: '', description: '', quantity: 1, unitPrice: 0, discount: 0 }],
      taxRate: 10,
      discountType: 'percentage',
      discountValue: 0,
      paymentStatus: 'pending',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate');
  const watchedDiscountType = watch('discountType');
  const watchedDiscountValue = watch('discountValue');

  // Calculate totals
  React.useEffect(() => {
    const subtotal = watchedItems.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      return sum + itemTotal;
    }, 0);


    const discountAmount = watchedDiscountType === 'percentage' 
      ? subtotal * ((watchedDiscountValue || 0) / 100)
      : (watchedDiscountValue || 0);

    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * ((watchedTaxRate || 0) / 100);
    const total = taxableAmount + taxAmount;

    setValue('subtotal', subtotal);
    setValue('discountAmount', discountAmount);
    setValue('taxAmount', taxAmount);
    setValue('total', total);
  }, [watchedItems, watchedTaxRate, watchedDiscountType, watchedDiscountValue, setValue]);

const onSubmit = async (data: FormData) => {
  try {

    const res = await axios.post(api.addSale, data);
    console.log("Sales data saved:", res.data);
    navigate("/sales");
  } catch (error) {
    console.error("Error saving sale:", error);
  }
};

const addItem = () => {
  append({ productId: '', description: '', quantity: 1, unitPrice: 0 });
};

  const handleProductChange = (index: number, productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, productId);
      setValue(`items.${index}.description`, product.name);
      setValue(`items.${index}.unitPrice`, product.price);
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
          onClick={() => navigate('/sales')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Sale' : 'New Sale'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update sale information' : 'Create a new sales invoice'}
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer *
              </label>
              <select
                {...register('customerId')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select customer</option>
                {mockCustomers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Invoice Number *
              </label>
              <input
                {...register('invoiceNumber')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter invoice number"
              />
              {errors.invoiceNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invoiceNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                {...register('date')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date *
              </label>
              <input
                {...register('dueDate')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate.message}</p>
              )}
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product *
                  </label>
                  <select
                    {...register(`items.${index}.productId`)}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select product</option>
                    {mockProducts.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <input
                    {...register(`items.${index}.description`)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Item description"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity *
                  </label>
                  <input
                    {...register(`items.${index}.quantity`)}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit Price *
                  </label>
                  <input
                    {...register(`items.${index}.unitPrice`)}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0.00"
                  />
                </div>


                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="w-full p-2 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Calculations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calculations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Type
                </label>
                <select
                  {...register('discountType')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Value
                </label>
                <input
                  {...register('discountValue')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  {...register('taxRate')}
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${watch('subtotal')?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  -${watch('discountAmount')?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tax:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${watch('taxAmount')?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${watch('total')?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method *
              </label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
                <option value="Digital Wallet">Digital Wallet</option>
              </select>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.paymentMethod.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Status *
              </label>
              <select
                {...register('paymentStatus')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
              {errors.paymentStatus && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.paymentStatus.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter any additional notes..."
              />
            </div>
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
            onClick={() => navigate('/sales')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            {isEdit ? 'Update Sale' : 'Create Sale'}
          </button>
        </motion.div>
      </form>
    </div>
  );
};