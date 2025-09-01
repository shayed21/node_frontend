import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Calendar, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDropdowns } from "../../../contexts/DropDownContext";

const salesData = [
	{ month: "Jan", sales: 12000, purchases: 8000, profit: 4000 },
	{ month: "Feb", sales: 15000, purchases: 9500, profit: 5500 },
	{ month: "Mar", sales: 18000, purchases: 11000, profit: 7000 },
	{ month: "Apr", sales: 22000, purchases: 13000, profit: 9000 },
	{ month: "May", sales: 25000, purchases: 15000, profit: 10000 },
	{ month: "Jun", sales: 28000, purchases: 16500, profit: 11500 },
];
const months = [
	{ id: 1, month: "January" },
	{ id: 2, month: "February" },
	{ id: 3, month: "March" },
	{ id: 4, month: "April" },
	{ id: 5, month: "May" },
	{ id: 6, month: "June" },
	{ id: 7, month: "July" },
	{ id: 8, month: "August" },
	{ id: 9, month: "September" },
	{ id: 10, month: "October" },
	{ id: 11, month: "November" },
	{ id: 12, month: "December" },
];

const years = [
	{ id: 1, year: 2020 },
	{ id: 2, year: 2021 },
	{ id: 3, year: 2022 },
	{ id: 4, year: 2023 },
	{ id: 5, year: 2024 },
	{ id: 6, year: 2025 },
	{ id: 7, year: 2026 },
	{ id: 8, year: 2027 },
	{ id: 9, year: 2028 },
	{ id: 10, year: 2029 },
	{ id: 11, year: 2030 },
];

const schema = yup.object({
	reportType: yup.string().required("Report type is required"),
	month: yup.string().required("Month type is required"),
	year: yup.string().required("Year type is required"),
	startDate: yup
		.date()
		.transform((value, originalValue) => (originalValue === "" ? null : value))
		.typeError("Date must be a valid date")
		.required("Date is required"),
	endDate: yup
		.date()
		.transform((value, originalValue) => (originalValue === "" ? null : value))
		.typeError("Date must be a valid date")
		.required("Date is required"),
	supplierName: yup.string(),
	accountId: yup.string().required("Account No is required"),
	customerName: yup.string(),
	expenseType: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export const SalesReport: React.FC = () => {
	const [dateRange, setDateRange] = useState("6months");
	const navigate = useNavigate();
	const { customers, expenseTypes, supplier, loading } = useDropdowns();

	const {
		register,
		handleSubmit,
		watch,
		reset,
		control,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
		defaultValues: {
			reportType: "",
			startDate: new Date().toISOString().split("T")[0],
			endDate: new Date().toISOString().split("T")[0],
			supplierName: "",
			expenseType: "",
			customerName: "",
		},
	});

	const reportType = watch("reportType");

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
						Reports & Analytics
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Comprehensive business insights and performance metrics
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<button className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
						<Calendar className="w-4 h-4 mr-2" />
						Date Range
					</button>
					<button className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
						<Download className="w-4 h-4 mr-2" />
						Export Report
					</button>
				</div>
			</motion.div>

			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
			>
				<div className="flex flex-col gap-4 md:flex-row">
					<div className="flex-1">
						<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
							Report Type
						</label>
						<select
							{...register("reportType")}
							className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
						>
							<option value="">Select Report Type</option>
							<option value="daily">Daily Report</option>
							<option value="monthly">Monthly Report</option>
							<option value="yearly">Yearly Report</option>
						</select>
						{errors.reportType && (
							<p className="mt-1 text-sm text-red-600">
								{errors.reportType.message}
							</p>
						)}
					</div>
					<div className="flex-1">
						<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
							Time Period
						</label>
						<select
							value={dateRange}
							onChange={(e) => setDateRange(e.target.value)}
							className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="7days">Last 7 Days</option>
							<option value="30days">Last 30 Days</option>
							<option value="3months">Last 3 Months</option>
							<option value="6months">Last 6 Months</option>
							<option value="1year">Last Year</option>
						</select>
					</div>
					<div className="flex items-end">
						<button className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
							<Filter className="w-4 h-4 mr-2" />
							More Filters
						</button>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-3">
					{reportType === "daily" && (
						<>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
									Start Date *
								</label>
								<input
									{...register("startDate")}
									type="date"
									className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
								/>
								{errors.startDate && (
									<p className="mt-1 text-sm text-red-600">
										{errors.startDate.message}
									</p>
								)}
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
									End Date *
								</label>
								<input
									{...register("endDate")}
									type="date"
									className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
								/>
								{errors.endDate && (
									<p className="mt-1 text-sm text-red-600">
										{errors.endDate.message}
									</p>
								)}
							</div>
						</>
					)}
					{reportType === "monthly" && (
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Month *
							</label>
							<select
								{...register("month")}
								className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
							>
								<option value="">Select expense type</option>
								{months?.map((month) => (
									<option key={month?.id} value={month?.id}>
										{month?.month}
									</option>
								))}
							</select>
							{errors.month && (
								<p className="mt-1 text-sm text-red-600">
									{errors.month.message}
								</p>
							)}
						</div>
					)}
					{(reportType === "monthly" || reportType === "yearly") && (
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Year*
							</label>
							<select
								{...register("year")}
								className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
							>
								<option value="">Select expense type</option>
								{years?.map((year) => (
									<option key={year?.id} value={year?.id}>
										{year?.year}
									</option>
								))}
							</select>
							{errors.year && (
								<p className="mt-1 text-sm text-red-600">
									{errors.year.message}
								</p>
							)}
						</div>
					)}

					<div>
						<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
							Expense *
						</label>
						<select
							{...register("expenseType")}
							className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
						>
							<option value="">Select expense type</option>
							{expenseTypes?.map((expense) => (
								<option key={expense._id} value={expense._id}>
									{expense.displayName}
								</option>
							))}
						</select>
						{errors.expenseType && (
							<p className="mt-1 text-sm text-red-600">
								{errors.expenseType.message}
							</p>
						)}
					</div>

					<div>
						<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
							Customer Name *
						</label>
						<select
							{...register("customerName")}
							className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
						>
							<option value="">Select customer</option>
							{customers?.map((customer) => (
								<option key={customer._id} value={customer._id}>
									{customer.displayName}
								</option>
							))}
						</select>
						{errors.customerName && (
							<p className="mt-1 text-sm text-red-600">
								{errors.customerName.message}
							</p>
						)}
					</div>

					<div>
						<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
							Supplier *
						</label>
						<select
							{...register("supplierName")}
							className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
						>
							<option value="">Select Supplier</option>
							{supplier?.map((supplier) => (
								<option key={supplier._id} value={supplier._id}>
									{supplier.displayName}
								</option>
							))}
						</select>
						{errors.supplierName && (
							<p className="mt-1 text-sm text-red-600">
								{errors.supplierName.message}
							</p>
						)}
					</div>
				</div>
			</motion.div>

			{/* Summary Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 1.0 }}
				className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
			>
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Monthly Summary
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Detailed breakdown by month
						</p>
					</div>
					<div className="flex gap-4">
						<div className="relative">
							<Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
							<input
								type="text"
								placeholder="Search purchases..."
								//value={searchTerm}
								//onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<button className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
							<Download className="w-4 h-4 mr-2" />
							Export CSV
						</button>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Month
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Sales
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Purchases
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Profit
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Margin
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{salesData.map((data, index) => (
								<tr
									key={data.month}
									className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
										{data.month} 2024
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
										${data.sales.toLocaleString()}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
										${data.purchases.toLocaleString()}
									</td>
									<td className="px-6 py-4 text-sm font-medium text-green-600 whitespace-nowrap dark:text-green-400">
										${data.profit.toLocaleString()}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
										{((data.profit / data.sales) * 100).toFixed(1)}%
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</motion.div>
		</div>
	);
};
