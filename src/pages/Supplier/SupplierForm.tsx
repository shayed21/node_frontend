import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../api";

const schema = yup.object({
	name: yup.string().required("Supplier name is required"),
	address: yup.string().required("Address is required"),
	companyName: yup.string().required("Company name is required"),
	email: yup.string().required("Email is required"),
	mobile: yup.string().required("Mobile No is required"),
	balance: yup.string().required("Opening Balance is required"),
	status: yup.string().required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export const SupplierForm: React.FC = () => {
	const { company, user } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
		defaultValues: {
			name: "",
			balance: "",
			status: "",
			mobile: "",
			email: "",
			companyName: "",
			address: "",
		},
	});

	useEffect(() => {
		if (isEdit && id) {
			const fetchUnit = async () => {
				try {
					const response = await fetch(`${api.supplier}/${id}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
						},
					});

					const result = await response.json();
					if (result?.data) {
						reset({
							name: result?.data?.supplierName,
							companyName: result?.data?.compName,
							email: result?.data?.email,
							balance: result?.data?.balance,
							mobile: result?.data?.mobile,
							address: result?.data?.address,
							status: result?.data?.status?.toLowerCase(),
						});
					}
				} catch (error) {
					console.error("Failed to fetch supplier:", error);
				}
			};

			fetchUnit();
		}
	}, [isEdit, id, reset]);

	const onSubmit = async (data: FormData) => {
		try {
			const payload: any = {
				supplierName: data?.name,
				balance: data?.balance,
				mobile: data?.mobile,
				status: data?.status,
				compid: company?.id.toString(),
				compName: data?.companyName,
				email: data?.email,
				address: data?.address,
			};

			// Add regby if adding, upby if editing
			if (isEdit) {
				payload.upby = user?.id;
			} else {
				payload.regby = user?.id;
			}

			const url = isEdit ? `${api.supplier}/${id}` : api.supplier;
			const method = isEdit ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) throw new Error("Failed to save cash account");

			const result = await response.json();
			console.log("Response:", result);

			navigate("/system/supplier");
		} catch (error) {
			console.error("Error saving supplier:", error);
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
					onClick={() => navigate("/system/supplier")}
					className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
				</button>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{isEdit ? "Edit Supplier" : "Add Supplier"}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{isEdit
							? "Update supplier information"
							: "Enter supplier details to add"}
					</p>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Basic Information */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Basic Information
					</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Supplier Name *
							</label>
							<input
								{...register("name")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter supplier name"
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.name.message}
								</p>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Company Name *
							</label>
							<input
								{...register("companyName")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter account owner name"
							/>
							{errors.companyName && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.companyName.message}
								</p>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Mobile *
							</label>
							<input
								{...register("mobile")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter mobile no"
							/>
							{errors.mobile && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.mobile.message}
								</p>
							)}
						</div>

						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Email *
							</label>
							<input
								{...register("email")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter account owner name"
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.email.message}
								</p>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Address *
							</label>
							<input
								{...register("address")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter address"
							/>
							{errors.address && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.address.message}
								</p>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Balance *
							</label>
							<input
								{...register("balance")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter opening balance amount"
							/>
							{errors.balance && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.balance.message}
								</p>
							)}
						</div>

						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Status *
							</label>
							<select
								{...register("status")}
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
						onClick={() => navigate("/system/supplier")}
						className="px-6 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="flex items-center px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
					>
						{isSubmitting ? (
							<div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
						) : null}
						{isEdit ? "Update" : "Add"}
					</button>
				</motion.div>
			</form>
		</div>
	);
};
