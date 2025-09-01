import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, ArrowRightLeft, Upload, X } from 'lucide-react';

const schema = yup.object({
  transferNumber: yup.string().required('Transfer number is required'),
  date: yup.date().required('Date is required'),
  fromAccountId: yup.string().required('From account is required'),
  toAccountId: yup.string().required('To account is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  description: yup.string().required('Description is required'),
  reference: yup.string(),
  transferType: yup.string().oneOf(['internal', 'external'], 'Invalid transfer type').required('Transfer type is required'),
  status: yup.string().oneOf(['pending', 'completed', 'cancelled'], 'Invalid status').required('Status is required'),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const mockAccounts = [
  { id: '1', name: 'Cash Account', code: '1001', balance: 15000.00 },
  { id: '2', name: 'Bank Account - Main', code: '1002', balance: 45000.00 },
  { id: '3', name: 'Petty Cash', code: '1003', balance: 500.00 },
  { id: '4', name: 'Savings Account', code: '1004', balance: 25000.00 },
  { id: '5', name: 'Investment Account', code: '1005', balance: 100000.00 },
];

export const BalanceTransferForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [selectedAttachments, setSelectedAttachments] = React.useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: isEdit ? {
      transferNumber: 'BT-2024-001',
      date: new Date('2024-01-15'),
      fromAccountId: '1',
      toAccountId: '2',
      amount: 5000.00,
      description: 'Cash deposit to bank',
      reference: 'DEP001',
      transferType: 'internal',
      status: 'completed',
      notes: 'Regular cash deposit for daily operations',
    } : {
      transferNumber: `BT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      date: new Date(),
      transferType: 'internal',
      status: 'pending',
    },
  });

  const fromAccountId = watch('fromAccountId');
  const toAccountId = watch('toAccountId');

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Transfer data:', data);
      console.log('Attachments:', selectedAttachments);
      navigate('/balance-transfer');
    } catch (error) {
      console.error('Error saving transfer:', error);
    }
  };

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setSelectedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFromAccount = () => mockAccounts.find(acc => acc.id === fromAccountId);
  const getToAccount = () => mockAccounts.find(acc => acc.id === toAccountId);

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
          onClick={() => navigate('/balance-transfer')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Balance Transfer' : 'New Balance Transfer'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update transfer information' : 'Transfer funds between accounts'}
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transfer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transfer Number *
              </label>
              <input
                {...register('transferNumber')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transfer number"
              />
              {errors.transferNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transferNumber.message}</p>
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
                Transfer Type *
              </label>
              <select
                {...register('transferType')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="internal">Internal Transfer</option>
                <option value="external">External Transfer</option>
              </select>
              {errors.transferType && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transferType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Account Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Account *
              </label>
              <select
                {...register('fromAccountId')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select from account</option>
                {mockAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.code}) - ${account.balance.toFixed(2)}
                  </option>
                ))}
              </select>
              {errors.fromAccountId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fromAccountId.message}</p>
              )}
              {getFromAccount() && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Available: ${getFromAccount()?.balance.toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <ArrowRightLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Account *
              </label>
              <select
                {...register('toAccountId')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select to account</option>
                {mockAccounts.filter(acc => acc.id !== fromAccountId).map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.code}) - ${account.balance.toFixed(2)}
                  </option>
                ))}
              </select>
              {errors.toAccountId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.toAccountId.message}</p>
              )}
              {getToAccount() && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Current: ${getToAccount()?.balance.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Amount & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transfer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <input
                {...register('amount')}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reference Number
              </label>
              <input
                {...register('reference')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter reference number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transfer description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Transfer Summary */}
        {fromAccountId && toAccountId && watch('amount') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transfer Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">From:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getFromAccount()?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Balance:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${getFromAccount()?.balance.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">After Transfer:</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    ${((getFromAccount()?.balance || 0) - (watch('amount') || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">To:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getToAccount()?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Balance:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${getToAccount()?.balance.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">After Transfer:</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    ${((getToAccount()?.balance || 0) + (watch('amount') || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Transfer Amount:</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ${(watch('amount') || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Attachments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supporting Documents</h2>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Upload receipts, authorization forms, or other supporting documents
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleAttachmentUpload}
              className="hidden"
              id="attachment-upload"
            />
            <label
              htmlFor="attachment-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
            >
              Select Files
            </label>
          </div>

          {selectedAttachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedAttachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-900 dark:text-white truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Notes</h2>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any additional notes or comments..."
          />
        </motion.div>

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate('/balance-transfer')}
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
            {isEdit ? 'Update Transfer' : 'Create Transfer'}
          </button>
        </motion.div>
      </form>
    </div>
  );
};