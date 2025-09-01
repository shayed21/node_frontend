const BASE_URL = 'https://demo.inflameltd.com/real_inv/api';
const BASE_URL2 = 'http://localhost:5000/api';


// https://demo.inflameltd.com/real_inv/api/auth/login

// https://demo.inflameltd.com/real_inv/api/product/products
export const api = {
  login: `${BASE_URL2}/auth/login`,
  logout: `${BASE_URL2}/auth/logout`,
  addRole:`${BASE_URL}/roles/add`,
  profile:`${BASE_URL2}/auth/profile`,
  allUnit:`${BASE_URL2}/unit/all_units`,
  unit: `${BASE_URL2}/unit/unit`,
  allExpense: `${BASE_URL2}/expense/all_expense`,
  expense: `${BASE_URL2}/expense/expense`,

  allProduct:`/product/products`,
  product:`/product/product`,
  productList:`${BASE_URL2}/product/products`,

  allParty:`${BASE_URL2}/party`,
  party:`${BASE_URL2}/party`,

  addSale:`${BASE_URL2}/sale/add`,
  allSale:`${BASE_URL2}/sale`,

  allCashAccount:`${BASE_URL2}/AccountSetting/cashAccounts`,
  cashAccount:`${BASE_URL2}/AccountSetting/cashAccount`,
  allMobileAccount:`${BASE_URL2}/AccountSetting/mobileAccounts`,
  mobileAccount:`${BASE_URL2}/AccountSetting/mobileAccount`,
  allBankAccount:`${BASE_URL2}/AccountSetting/bankAccounts`,
  bankAccount:`${BASE_URL2}/AccountSetting/bankAccount`,
  allCompany:`${BASE_URL2}/company/all_company`,
  company:`${BASE_URL2}/company/company`,
  allSupplier:`${BASE_URL2}/supplier/all_supplier`,
  supplier:`${BASE_URL2}/supplier/supplier`,
  
  allDepartment:`${BASE_URL2}/department/all_departments`,
  department:`${BASE_URL2}/department/department`,
  allCategory:`${BASE_URL2}/category/all_category`,
  category:`${BASE_URL2}/category/category`,
  allRole:`${BASE_URL2}/roles/all_role`,
  role:`${BASE_URL2}/roles/role`,
  allVoucher:`${BASE_URL2}/voucher/all_voucher`,
  voucher:`${BASE_URL2}/voucher/voucher`,
  allParticularVoucher:`${BASE_URL2}/particularVoucher/all_particularVoucher`,
  particularVoucher:`${BASE_URL2}/particularVoucher/particularVoucher`,
  allCustomer:`${BASE_URL2}/customer/all_customer`,
  customer:`${BASE_URL2}/customer/customer`,
  allPurchase:`${BASE_URL2}/purchase/all_purchase`,
  purchase:`${BASE_URL2}/purchase/purchase`,
  allPurchaseProduct:`${BASE_URL2}/purchase/product/all_purchaseProduct`,
  purchaseProduct:`${BASE_URL2}/purchase/product/purchaseProduct`,
  allPurchasePayment:`${BASE_URL2}/purchase/payment/all_purchasePayment`,
  purchasePayment:`${BASE_URL2}/purchase/payment/purchasePayment`,
  allQuotation:`${BASE_URL2}/quotation/all_quotation`,
  quotation:`${BASE_URL2}/quotation/quotation`,
  allQuotationProduct:`${BASE_URL2}/quotationProduct/all_quotationProduct`,
  quotationProduct:`${BASE_URL2}/quotationProduct/quotationProduct`,
  
  // add more endpoints here
};
