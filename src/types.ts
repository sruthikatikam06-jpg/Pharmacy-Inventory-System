export type UserRole = 'admin' | 'pharmacist' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type MedicineCategory =
  | 'Antibiotics'
  | 'Pain Relievers'
  | 'Cardiovascular'
  | 'Diabetes'
  | 'Respiratory'
  | 'Vitamins & Supplements'
  | 'Gastrointestinal'
  | 'Dermatology'
  | 'First Aid'
  | 'Pediatric';

export type StorageCondition =
  | 'Room Temperature'
  | 'Refrigerated (2-8°C)'
  | 'Cool & Dry'
  | 'Controlled Substance Safe';

export interface MedicineBatch {
  batchNumber: string;
  barcode: string;
  expiryDate: string;
  manufacturingDate: string;
  quantity: number;
  initialQuantity: number;
  purchasePrice: number;
  sellingPrice: number;
  rackLocation: string;
  supplierId: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandName: string;
  category: MedicineCategory;
  sku: string;
  barcode: string;
  description: string;
  manufacturer: string;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Inhaler' | 'Drops' | 'Powder';
  unit: 'Box' | 'Strip' | 'Bottle' | 'Vial' | 'Tube';
  totalStock: number;
  minStockAlert: number;
  maxStockCapacity: number;
  reorderPoint: number;
  costPrice: number;
  sellingPrice: number;
  prescriptionRequired: boolean;
  storageCondition: StorageCondition;
  batches: MedicineBatch[];
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  categoriesSupplied: string[];
  rating: number;
  paymentTerms: string;
  status: 'active' | 'inactive';
}

export interface PurchaseOrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  expectedExpiry?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'shipped' | 'received' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  notes?: string;
  createdBy: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  medicalNotes?: string;
  totalVisits: number;
  totalSpent: number;
  createdAt: string;
}

export interface SaleItem {
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  totalPrice: number;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'insurance';
  paymentStatus: 'paid' | 'pending';
  soldBy: string;
  createdAt: string;
  notes?: string;
}

export interface StockMovement {
  id: string;
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  type: 'stock_in' | 'stock_out' | 'adjustment' | 'expired_removal' | 'return';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  referenceNumber?: string;
  performedBy: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  category: 'inventory' | 'sales' | 'purchase' | 'auth' | 'system';
  details: string;
  ipAddress?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'info' | 'success';
  category: 'low_stock' | 'expiring' | 'order' | 'system';
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
}

export interface AIInsight {
  type: 'demand_prediction' | 'reorder_suggestion' | 'expiry_risk' | 'sales_trend';
  title: string;
  summary: string;
  detailsMarkdown?: string;
  items?: Array<{
    medicineId?: string;
    medicineName?: string;
    suggestedQuantity?: number;
    urgency?: 'high' | 'medium' | 'low';
    confidenceScore?: number;
    reasoning?: string;
    daysUntilExpiry?: number;
    recommendedDiscount?: number;
  }>;
  timestamp: string;
  confidenceScore?: number;
}
