import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Plus, Trash2, Calculator } from 'lucide-react';

const allowanceSchema = yup.object({
  type: yup.string().required('Allowance type is required'),
  amount: yup.number().min(0, 'Amount cannot be negative').required('Amount is required'),
});

const deductionSchema = yup.object({
  type: yup.string().required('Deduction type is required'),
  amount: yup.number().min(0, 'Amount cannot be negative').required('Amount is required'),
});

const schema = yup.object({
  employeeId: yup.string().required('Employee is required'),
  month: yup.string().required('Month is required'),
  basicSalary: yup.number().positive('Basic salary must be positive').required('Basic salary is required'),
  workingDays: yup.number().positive('Working days must be positive').required('Working days is required'),
  presentDays: yup.number().min(0, 'Present days cannot be negative').required('Present days is required'),
  overtimeHours: yup.number().min(0, 'Overtime hours cannot be negative').default(0),
  overtimeRate: yup.number().min(0, 'Overtime rate cannot be negative').default(0),
  allowances: yup.array().of(allowanceSchema).default([]),
  deductions: yup.array().of(deductionSchema).default([]),
  grossSalary: yup.number().min(0, 'Gross salary cannot be negative'),
  totalDeductions: yup.number().min(0, 'Total deductions cannot be negative'),
  netSalary: yup.number().min(0, 'Net salary cannot be negative'),
  paymentMethod: yup.string().required('Payment method is required'),
  bankAccount: yup.string(),
  status: yup.string().oneOf(['pending', 'processing', 'paid'], 'Invalid status').required('Status is required'),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const mockEmployees = [
  { id: '1', name: 'John Doe', position: 'Sales Manager', basicSalary: 5000 },
  { id: '2', name: 'Jane Smith', position: 'Accountant', basicSalary: 4500 },
  { id: '3', name: 'Mike Johnson', position: 'Warehouse Supervisor', basicSalary: 4000 },
];

const allowanceTypes = [
  'House Rent Allowance',
  'Transport Allowance',
  'Medical Allowance',
  'Food Allowance',
  'Performance Bonus',
  'Special Allowance',
];

const deductionTypes = [
  'Income Tax',
  'Provident Fund',
  'Insurance Premium',
  'Loan Deduction',
  'Late Coming Fine',
  'Other Deductions',
];

export const SalaryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

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
      employeeId: '1',
      month: '2024-01',
      basicSalary: 5000.00,
      workingDays: 22,
      presentDays: 22,
      overtimeHours: 10,
      overtimeRate: 25.00,
      allowances: [
        { type: 'House Rent Allowance', amount: 800.00 },
        { type: 'Transport Allowance', amount: 200.00 },
      ],
      deductions: [
        { type: 'Income Tax', amount: 150.00 },
        { type: 'Provident Fund', amount: 50.00 },
      ],
      grossSalary: 6250.00,
      totalDeductions: 200.00,
      netSalary: 6050.00,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'XXXX-XXXX-1234',
      status: 'paid',
      notes: 'Regular monthly salary payment',
    } : {
      month: new Date().toISOString().slice(0, 7), // Current month
      workingDays: 22,
      presentDays: 22,
      overtimeHours: 0,
      overtimeRate: 0,
      allowances: [],
      deductions: [],
      status: 'pending',
    },
  });

  const { fields: allowanceFields, append: appendAllowance, remove: removeAllowance } = useFieldArray({
    control,
    name: 'allowances',
  });

  const { fields: deductionFields, append: appendDeduction, remove: removeDeduction } = useFieldArray({
    control,
    name: 'deductions',
  });

  const watchedEmployeeId = watch('employeeId');
  const watchedBasicSalary = watch('basicSalary');
  const watchedWorkingDays = watch('workingDays');
  const watchedPresentDays = watch('presentDays');
  const watchedOvertimeHours = watch('overtimeHours');
  const watchedOvertimeRate = watch('overtimeRate');
  const watchedAllowances = watch('allowances');
  const watchedDeductions = watch('deductions');

  // Auto-fill basic salary when employee is selected
  React.useEffect(() => {
    if (watchedEmployeeId) {
      const employee = mockEmployees.find(emp => emp.id === watchedEmployeeId);
      if (employee) {
        setValue('basicSalary', employee.basicSalary);
      }
    }
  }, [watchedEmployeeId, setValue]);

  // Calculate totals
  React.useEffect(() => {
    const dailySalary = (watchedBasicSalary || 0) / (watchedWorkingDays || 1);
    const earnedSalary = dailySalary * (watchedPresentDays || 0);
    const overtimeAmount = (watchedOvertimeHours || 0) * (watchedOvertimeRate || 0);
    const totalAllowances = (watchedAllowances || []).reduce((sum, allowance) => sum + (allowance.amount || 0), 0);
    const totalDeductions = (watchedDeductions || []).reduce((sum, deduction) => sum + (deduction.amount || 0), 0);
    
    const grossSalary = earnedSalary + overtimeAmount + totalAllowances;
    const netSalary = grossSalary - totalDeductions;

    setValue('grossSalary', grossSalary);
    setValue('totalDeductions', totalDeductions);
    setValue('netSalary', netSalary);
  }, [watchedBasicSalary, watchedWorkingDays, watchedPresentDays, watchedOvertimeHours, watchedOvertimeRate, watchedAllowances, watchedDeductions, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Salary data:', data);
      navigate('/salary');
    } catch (error) {
      console.error('Error saving salary:', error);
    }
  };

  const addAllowance = () => {
    appendAllowance({ type: '', amount: 0 });
  };

  const addDeduction = () => {
    appendDeduction({ type: '', amount: 0 });
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
          onClick={() => navigate('/salary')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Salary' : 'Process Salary'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update salary information' : 'Process monthly salary for employee'}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Employee & Period */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee & Period</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employee *
              </label>
              <select
                {...register('employeeId')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select employee</option>
                {mockEmployees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employeeId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Month *
              </label>
              <input
                {...register('month')}
                type="month"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.month && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.month.message}</p>
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
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Basic Salary & Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Salary & Attendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Basic Salary *
              </label>
              <input
                {...register('basicSalary')}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.basicSalary && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.basicSalary.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Working Days *
              </label>
              <input
                {...register('workingDays')}
                type="number"
                min="1"
                max="31"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="22"
              />
              {errors.workingDays && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.workingDays.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Present Days *
              </label>
              <input
                {...register('presentDays')}
                type="number"
                min="0"
                max="31"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="22"
              />
              {errors.presentDays && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.presentDays.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Overtime Hours
              </label>
              <input
                {...register('overtimeHours')}
                type="number"
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Overtime Rate
              </label>
              <input
                {...register('overtimeRate')}
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
        </motion.div>

        {/* Allowances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Allowances</h2>
            <button
              type="button"
              onClick={addAllowance}
              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Allowance
            </button>
          </div>

          <div className="space-y-4">
            {allowanceFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Allowance Type *
                  </label>
                  <select
                    {...register(`allowances.${index}.type`)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select allowance type</option>
                    {allowanceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount *
                    </label>
                    <input
                      {...register(`allowances.${index}.amount`)}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeAllowance(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {allowanceFields.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No allowances added</p>
            )}
          </div>
        </motion.div>

        {/* Deductions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Deductions</h2>
            <button
              type="button"
              onClick={addDeduction}
              className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Deduction
            </button>
          </div>

          <div className="space-y-4">
            {deductionFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deduction Type *
                  </label>
                  <select
                    {...register(`deductions.${index}.type`)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select deduction type</option>
                    {deductionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount *
                    </label>
                    <input
                      {...register(`deductions.${index}.amount`)}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeDeduction(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {deductionFields.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No deductions added</p>
            )}
          </div>
        </motion.div>

        {/* Salary Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Salary Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method *
                </label>
                <select
                  {...register('paymentMethod')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select payment method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.paymentMethod.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bank Account
                </label>
                <input
                  {...register('bankAccount')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter bank account details"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Earned Salary:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${((watch('basicSalary') || 0) / (watch('workingDays') || 1) * (watch('presentDays') || 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overtime:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${((watch('overtimeHours') || 0) * (watch('overtimeRate') || 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Allowances:</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  +${(watchedAllowances || []).reduce((sum, allowance) => sum + (allowance.amount || 0), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Deductions:</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  -${watch('totalDeductions')?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Net Salary:</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${watch('netSalary')?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
            onClick={() => navigate('/salary')}
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
            {isEdit ? 'Update Salary' : 'Process Salary'}
          </button>
        </motion.div>
      </form>
    </div>
  );
};