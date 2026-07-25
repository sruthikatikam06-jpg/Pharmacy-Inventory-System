import {
  Medicine,
  Supplier,
  PurchaseOrder,
  Customer,
  SaleInvoice,
  StockMovement,
  ActivityLog,
  AppNotification,
  User
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_1',
    name: 'Dr. Sarah Vance',
    email: 'admin@pharmix.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-01-10T08:00:00.000Z'
  },
  {
    id: 'usr_pharm_1',
    name: 'Marcus Brody, PharmD',
    email: 'pharmacist@pharmix.com',
    role: 'pharmacist',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-02-01T09:30:00.000Z'
  },
  {
    id: 'usr_staff_1',
    name: 'Elena Rostova',
    email: 'staff@pharmix.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1594824813566-82823d293f7f?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-03-15T11:15:00.000Z'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_1',
    name: 'Astra Pharma Global',
    contactPerson: 'David Miller',
    email: 'orders@astrapharma.com',
    phone: '+1 (800) 555-0199',
    address: '100 BioMed Way, Cambridge, MA 02142',
    taxId: 'TX-9988210',
    categoriesSupplied: ['Antibiotics', 'Respiratory', 'Cardiovascular'],
    rating: 4.8,
    paymentTerms: 'Net 30',
    status: 'active'
  },
  {
    id: 'sup_2',
    name: 'MediHealth Logistics Ltd',
    contactPerson: 'Rachel Green',
    email: 'supply@medihealth.org',
    phone: '+1 (888) 443-8822',
    address: '450 Distribution Pkwy, Chicago, IL 60607',
    taxId: 'TX-3341092',
    categoriesSupplied: ['Pain Relievers', 'Vitamins & Supplements', 'First Aid'],
    rating: 4.6,
    paymentTerms: 'Net 15',
    status: 'active'
  },
  {
    id: 'sup_3',
    name: 'Apex Bio-Tech Inc',
    contactPerson: 'Carlos Mendez',
    email: 'sales@apexbio.com',
    phone: '+1 (800) 720-1144',
    address: '78 Research Blvd, San Diego, CA 92121',
    taxId: 'TX-7712304',
    categoriesSupplied: ['Diabetes', 'Gastrointestinal', 'Dermatology'],
    rating: 4.9,
    paymentTerms: 'Net 45',
    status: 'active'
  },
  {
    id: 'sup_4',
    name: 'Pediatric Care Wholesale',
    contactPerson: 'Samantha Vance',
    email: 'info@pedia-care.com',
    phone: '+1 (800) 911-2020',
    address: '12 Medical Drive, Atlanta, GA 30301',
    taxId: 'TX-4401928',
    categoriesSupplied: ['Pediatric', 'Vitamins & Supplements'],
    rating: 4.5,
    paymentTerms: 'Net 30',
    status: 'active'
  }
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med_1',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    brandName: 'Amoxil',
    category: 'Antibiotics',
    sku: 'MED-AMX-500',
    barcode: '8901234567890',
    description: 'Broad-spectrum aminopenicillin antibiotic for bacterial infections.',
    manufacturer: 'Astra Pharma Global',
    dosageForm: 'Capsule',
    unit: 'Box',
    totalStock: 85,
    minStockAlert: 30,
    maxStockCapacity: 300,
    reorderPoint: 40,
    costPrice: 8.50,
    sellingPrice: 16.00,
    prescriptionRequired: true,
    storageCondition: 'Room Temperature',
    batches: [
      {
        batchNumber: 'BT-2025-A1',
        barcode: '8901234567890-B1',
        expiryDate: '2027-08-15',
        manufacturingDate: '2025-08-15',
        quantity: 50,
        initialQuantity: 100,
        purchasePrice: 8.50,
        sellingPrice: 16.00,
        rackLocation: 'Aisle 2 - Shelf B',
        supplierId: 'sup_1'
      },
      {
        batchNumber: 'BT-2026-A2',
        barcode: '8901234567890-B2',
        expiryDate: '2026-08-30', // Expiring in ~1 month!
        manufacturingDate: '2024-08-30',
        quantity: 35,
        initialQuantity: 100,
        purchasePrice: 8.50,
        sellingPrice: 16.00,
        rackLocation: 'Aisle 2 - Shelf B',
        supplierId: 'sup_1'
      }
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-07-20T10:00:00.000Z'
  },
  {
    id: 'med_2',
    name: 'Metformin 850mg',
    genericName: 'Metformin Hydrochloride',
    brandName: 'Glucophage',
    category: 'Diabetes',
    sku: 'MED-MET-850',
    barcode: '8902345678901',
    description: 'First-line medication for the treatment of type 2 diabetes.',
    manufacturer: 'Apex Bio-Tech Inc',
    dosageForm: 'Tablet',
    unit: 'Strip',
    totalStock: 12, // LOW STOCK ALERT!
    minStockAlert: 25,
    maxStockCapacity: 250,
    reorderPoint: 35,
    costPrice: 4.20,
    sellingPrice: 9.50,
    prescriptionRequired: true,
    storageCondition: 'Room Temperature',
    batches: [
      {
        batchNumber: 'BT-2025-M1',
        barcode: '8902345678901-B1',
        expiryDate: '2027-11-20',
        manufacturingDate: '2025-11-20',
        quantity: 12,
        initialQuantity: 100,
        purchasePrice: 4.20,
        sellingPrice: 9.50,
        rackLocation: 'Aisle 4 - Shelf A',
        supplierId: 'sup_3'
      }
    ],
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-07-22T08:30:00.000Z'
  },
  {
    id: 'med_3',
    name: 'Atorvastatin 20mg',
    genericName: 'Atorvastatin Calcium',
    brandName: 'Lipitor',
    category: 'Cardiovascular',
    sku: 'MED-ATO-020',
    barcode: '8903456789012',
    description: 'Statin medication used to prevent cardiovascular disease and lower cholesterol.',
    manufacturer: 'Astra Pharma Global',
    dosageForm: 'Tablet',
    unit: 'Box',
    totalStock: 140,
    minStockAlert: 40,
    maxStockCapacity: 400,
    reorderPoint: 50,
    costPrice: 12.00,
    sellingPrice: 24.50,
    prescriptionRequired: true,
    storageCondition: 'Room Temperature',
    batches: [
      {
        batchNumber: 'BT-2025-AT1',
        barcode: '8903456789012-B1',
        expiryDate: '2028-03-10',
        manufacturingDate: '2025-03-10',
        quantity: 140,
        initialQuantity: 150,
        purchasePrice: 12.00,
        sellingPrice: 24.50,
        rackLocation: 'Aisle 1 - Shelf D',
        supplierId: 'sup_1'
      }
    ],
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2026-07-18T14:20:00.000Z'
  },
  {
    id: 'med_4',
    name: 'Paracetamol 650mg Extra Strength',
    genericName: 'Acetaminophen / Paracetamol',
    brandName: 'Dolo 650',
    category: 'Pain Relievers',
    sku: 'MED-PCM-650',
    barcode: '8904567890123',
    description: 'Analgesic and antipyretic drug for fever relief and pain management.',
    manufacturer: 'MediHealth Logistics Ltd',
    dosageForm: 'Tablet',
    unit: 'Strip',
    totalStock: 320,
    minStockAlert: 50,
    maxStockCapacity: 600,
    reorderPoint: 80,
    costPrice: 1.50,
    sellingPrice: 3.80,
    prescriptionRequired: false,
    storageCondition: 'Room Temperature',
    batches: [
      {
        batchNumber: 'BT-2026-P1',
        barcode: '8904567890123-B1',
        expiryDate: '2028-06-30',
        manufacturingDate: '2026-01-10',
        quantity: 200,
        initialQuantity: 250,
        purchasePrice: 1.50,
        sellingPrice: 3.80,
        rackLocation: 'OTC Shelf 1',
        supplierId: 'sup_2'
      },
      {
        batchNumber: 'BT-2024-P2',
        barcode: '8904567890123-B2',
        expiryDate: '2026-06-15', // EXPIRED ITEM!
        manufacturingDate: '2024-06-15',
        quantity: 120,
        initialQuantity: 200,
        purchasePrice: 1.50,
        sellingPrice: 3.80,
        rackLocation: 'OTC Shelf 1',
        supplierId: 'sup_2'
      }
    ],
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2026-07-22T16:00:00.000Z'
  },
  {
    id: 'med_5',
    name: 'Omeprazole 20mg Delayed Release',
    genericName: 'Omeprazole Magnesium',
    brandName: 'Prilosec',
    category: 'Gastrointestinal',
    sku: 'MED-OMP-020',
    barcode: '8905678901234',
    description: 'Proton pump inhibitor used to treat GERD, heartburn, and stomach ulcers.',
    manufacturer: 'Apex Bio-Tech Inc',
    dosageForm: 'Capsule',
    unit: 'Box',
    totalStock: 6, // CRITICAL LOW STOCK
    minStockAlert: 20,
    maxStockCapacity: 200,
    reorderPoint: 30,
    costPrice: 6.80,
    sellingPrice: 14.20,
    prescriptionRequired: true,
    storageCondition: 'Cool & Dry',
    batches: [
      {
        batchNumber: 'BT-2025-O1',
        barcode: '8905678901234-B1',
        expiryDate: '2027-05-12',
        manufacturingDate: '2025-05-12',
        quantity: 6,
        initialQuantity: 80,
        purchasePrice: 6.80,
        sellingPrice: 14.20,
        rackLocation: 'Aisle 3 - Shelf C',
        supplierId: 'sup_3'
      }
    ],
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2026-07-23T07:15:00.000Z'
  },
  {
    id: 'med_6',
    name: 'Salbutamol Inhaler 100mcg',
    genericName: 'Albuterol / Salbutamol',
    brandName: 'Ventolin HFA',
    category: 'Respiratory',
    sku: 'MED-SLB-100',
    barcode: '8906789012345',
    description: 'Bronchodilator for rapid relief of asthma symptoms and wheezing.',
    manufacturer: 'Astra Pharma Global',
    dosageForm: 'Inhaler',
    unit: 'Bottle',
    totalStock: 45,
    minStockAlert: 15,
    maxStockCapacity: 150,
    reorderPoint: 25,
    costPrice: 18.00,
    sellingPrice: 32.00,
    prescriptionRequired: true,
    storageCondition: 'Room Temperature',
    batches: [
      {
        batchNumber: 'BT-2025-S1',
        barcode: '8906789012345-B1',
        expiryDate: '2027-09-30',
        manufacturingDate: '2025-09-30',
        quantity: 45,
        initialQuantity: 60,
        purchasePrice: 18.00,
        sellingPrice: 32.00,
        rackLocation: 'Aisle 2 - Shelf D',
        supplierId: 'sup_1'
      }
    ],
    createdAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2026-07-19T11:40:00.000Z'
  },
  {
    id: 'med_7',
    name: 'Human Insulin Glargine 100IU/ml',
    genericName: 'Insulin Glargine Recombinant',
    brandName: 'Lantus SoloStar',
    category: 'Diabetes',
    sku: 'MED-INS-100',
    barcode: '8907890123456',
    description: 'Long-acting basal insulin analog for blood glucose regulation.',
    manufacturer: 'Apex Bio-Tech Inc',
    dosageForm: 'Injection',
    unit: 'Vial',
    totalStock: 28,
    minStockAlert: 10,
    maxStockCapacity: 100,
    reorderPoint: 15,
    costPrice: 45.00,
    sellingPrice: 78.00,
    prescriptionRequired: true,
    storageCondition: 'Refrigerated (2-8°C)',
    batches: [
      {
        batchNumber: 'BT-2026-I1',
        barcode: '8907890123456-B1',
        expiryDate: '2026-09-15', // Expiring in ~2 months!
        manufacturingDate: '2025-03-15',
        quantity: 28,
        initialQuantity: 50,
        purchasePrice: 45.00,
        sellingPrice: 78.00,
        rackLocation: 'Cold Fridge 1 - Shelf 2',
        supplierId: 'sup_3'
      }
    ],
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2026-07-21T09:00:00.000Z'
  },
  {
    id: 'med_8',
    name: 'Pediatric Vitamin C Drops 100mg/ml',
    genericName: 'Ascorbic Acid Liquid',
    brandName: 'Ceelin Junior',
    category: 'Pediatric',
    sku: 'MED-VTC-PED',
    barcode: '8908901234567',
    description: 'Immune support drops for infants and toddlers.',
    manufacturer: 'Pediatric Care Wholesale',
    dosageForm: 'Drops',
    unit: 'Bottle',
    totalStock: 95,
    minStockAlert: 20,
    maxStockCapacity: 200,
    reorderPoint: 30,
    costPrice: 3.20,
    sellingPrice: 7.50,
    prescriptionRequired: false,
    storageCondition: 'Cool & Dry',
    batches: [
      {
        batchNumber: 'BT-2025-PED1',
        barcode: '8908901234567-B1',
        expiryDate: '2027-12-01',
        manufacturingDate: '2025-12-01',
        quantity: 95,
        initialQuantity: 120,
        purchasePrice: 3.20,
        sellingPrice: 7.50,
        rackLocation: 'Pediatric Section A',
        supplierId: 'sup_4'
      }
    ],
    createdAt: '2025-03-15T00:00:00.000Z',
    updatedAt: '2026-07-15T15:10:00.000Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    name: 'Robert Jenkins',
    phone: '+1 (555) 234-5678',
    email: 'rjenkins@example.com',
    address: '742 Evergreen Terrace, Springfield',
    medicalNotes: 'Type-2 Diabetic, allergic to Penicillin.',
    totalVisits: 14,
    totalSpent: 420.50,
    createdAt: '2025-02-10T00:00:00.000Z'
  },
  {
    id: 'cust_2',
    name: 'Maria Garcia',
    phone: '+1 (555) 876-5432',
    email: 'mgarcia@example.com',
    address: '1088 Ocean Drive, Miami, FL',
    medicalNotes: 'Hypertension patient. Regular Atorvastatin refill.',
    totalVisits: 8,
    totalSpent: 285.00,
    createdAt: '2025-03-01T00:00:00.000Z'
  },
  {
    id: 'cust_3',
    name: 'Jonathan Sterling',
    phone: '+1 (555) 345-6789',
    email: 'jsterling@techcorp.io',
    address: '55 Park Ave, New York, NY',
    medicalNotes: 'Asthmatic. Uses Ventolin Inhaler.',
    totalVisits: 5,
    totalSpent: 198.00,
    createdAt: '2025-04-12T00:00:00.000Z'
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po_1001',
    poNumber: 'PO-2026-081',
    supplierId: 'sup_3',
    supplierName: 'Apex Bio-Tech Inc',
    items: [
      {
        medicineId: 'med_2',
        medicineName: 'Metformin 850mg',
        quantity: 150,
        unitPrice: 4.20,
        totalPrice: 630.00,
        expectedExpiry: '2028-06-01'
      },
      {
        medicineId: 'med_5',
        medicineName: 'Omeprazole 20mg Delayed Release',
        quantity: 100,
        unitPrice: 6.80,
        totalPrice: 680.00,
        expectedExpiry: '2028-05-15'
      }
    ],
    totalAmount: 1310.00,
    status: 'approved',
    orderDate: '2026-07-21T10:00:00.000Z',
    expectedDeliveryDate: '2026-07-26T00:00:00.000Z',
    notes: 'Urgent reorder due to low stock levels triggered by AI forecast.',
    createdBy: 'Marcus Brody, PharmD'
  },
  {
    id: 'po_1002',
    poNumber: 'PO-2026-082',
    supplierId: 'sup_1',
    supplierName: 'Astra Pharma Global',
    items: [
      {
        medicineId: 'med_1',
        medicineName: 'Amoxicillin 500mg',
        quantity: 100,
        unitPrice: 8.50,
        totalPrice: 850.00,
        expectedExpiry: '2028-08-01'
      }
    ],
    totalAmount: 850.00,
    status: 'pending',
    orderDate: '2026-07-22T14:30:00.000Z',
    expectedDeliveryDate: '2026-07-28T00:00:00.000Z',
    notes: 'Routine antibiotic stock replenishment.',
    createdBy: 'Dr. Sarah Vance'
  }
];

export const INITIAL_SALES_INVOICES: SaleInvoice[] = [
  {
    id: 'inv_2001',
    invoiceNumber: 'INV-2026-0045',
    customerId: 'cust_1',
    customerName: 'Robert Jenkins',
    customerPhone: '+1 (555) 234-5678',
    items: [
      {
        medicineId: 'med_2',
        medicineName: 'Metformin 850mg',
        batchNumber: 'BT-2025-M1',
        quantity: 2,
        unitPrice: 9.50,
        discount: 0,
        taxRate: 5,
        totalPrice: 19.95
      },
      {
        medicineId: 'med_7',
        medicineName: 'Human Insulin Glargine 100IU/ml',
        batchNumber: 'BT-2026-I1',
        quantity: 1,
        unitPrice: 78.00,
        discount: 5.00,
        taxRate: 5,
        totalPrice: 76.65
      }
    ],
    subtotal: 97.00,
    taxAmount: 4.60,
    discountAmount: 5.00,
    totalAmount: 96.60,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    soldBy: 'Marcus Brody, PharmD',
    createdAt: '2026-07-23T08:30:00.000Z',
    notes: 'Prescription verified by PharmD.'
  },
  {
    id: 'inv_2002',
    invoiceNumber: 'INV-2026-0044',
    customerId: 'cust_2',
    customerName: 'Maria Garcia',
    customerPhone: '+1 (555) 876-5432',
    items: [
      {
        medicineId: 'med_3',
        medicineName: 'Atorvastatin 20mg',
        batchNumber: 'BT-2025-AT1',
        quantity: 1,
        unitPrice: 24.50,
        discount: 0,
        taxRate: 5,
        totalPrice: 25.725
      }
    ],
    subtotal: 24.50,
    taxAmount: 1.23,
    discountAmount: 0,
    totalAmount: 25.73,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    soldBy: 'Elena Rostova',
    createdAt: '2026-07-22T16:15:00.000Z'
  },
  {
    id: 'inv_2003',
    invoiceNumber: 'INV-2026-0043',
    customerName: 'Walk-in Customer',
    items: [
      {
        medicineId: 'med_4',
        medicineName: 'Paracetamol 650mg Extra Strength',
        batchNumber: 'BT-2026-P1',
        quantity: 3,
        unitPrice: 3.80,
        discount: 0,
        taxRate: 0,
        totalPrice: 11.40
      }
    ],
    subtotal: 11.40,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 11.40,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    soldBy: 'Elena Rostova',
    createdAt: '2026-07-22T11:20:00.000Z'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'sm_1',
    medicineId: 'med_2',
    medicineName: 'Metformin 850mg',
    batchNumber: 'BT-2025-M1',
    type: 'stock_out',
    quantity: 2,
    previousStock: 14,
    newStock: 12,
    reason: 'POS Sale #INV-2026-0045',
    referenceNumber: 'INV-2026-0045',
    performedBy: 'Marcus Brody, PharmD',
    createdAt: '2026-07-23T08:30:00.000Z'
  },
  {
    id: 'sm_2',
    medicineId: 'med_5',
    medicineName: 'Omeprazole 20mg Delayed Release',
    batchNumber: 'BT-2025-O1',
    type: 'adjustment',
    quantity: -4,
    previousStock: 10,
    newStock: 6,
    reason: 'Damaged packaging during inventory audit',
    performedBy: 'Dr. Sarah Vance',
    createdAt: '2026-07-22T17:00:00.000Z'
  },
  {
    id: 'sm_3',
    medicineId: 'med_4',
    medicineName: 'Paracetamol 650mg Extra Strength',
    batchNumber: 'BT-2026-P1',
    type: 'stock_in',
    quantity: 200,
    previousStock: 120,
    newStock: 320,
    reason: 'Received PO-2026-078 shipment',
    referenceNumber: 'PO-2026-078',
    performedBy: 'Elena Rostova',
    createdAt: '2026-07-20T09:15:00.000Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_1',
    timestamp: '2026-07-23T08:30:00.000Z',
    userId: 'usr_pharm_1',
    userName: 'Marcus Brody, PharmD',
    userRole: 'pharmacist',
    action: 'Completed POS Sale',
    category: 'sales',
    details: 'Generated invoice INV-2026-0045 for $96.60 (Robert Jenkins)',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'act_2',
    timestamp: '2026-07-22T17:05:00.000Z',
    userId: 'usr_admin_1',
    userName: 'Dr. Sarah Vance',
    userRole: 'admin',
    action: 'Stock Adjustment',
    category: 'inventory',
    details: 'Decreased Omeprazole 20mg stock by 4 units due to damaged packaging',
    ipAddress: '192.168.1.101'
  },
  {
    id: 'act_3',
    timestamp: '2026-07-21T10:00:00.000Z',
    userId: 'usr_pharm_1',
    userName: 'Marcus Brody, PharmD',
    userRole: 'pharmacist',
    action: 'Approved Purchase Order',
    category: 'purchase',
    details: 'Approved PO-2026-081 ($1,310.00) to Apex Bio-Tech Inc',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'act_4',
    timestamp: '2026-07-23T08:00:00.000Z',
    userId: 'usr_admin_1',
    userName: 'Dr. Sarah Vance',
    userRole: 'admin',
    action: 'User Login',
    category: 'auth',
    details: 'Admin authentication successful',
    ipAddress: '192.168.1.101'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Critical Low Stock Alert',
    message: 'Omeprazole 20mg has reached 6 units (Min threshold: 20). Reorder suggested.',
    type: 'error',
    category: 'low_stock',
    timestamp: '2026-07-23T07:15:00.000Z',
    isRead: false
  },
  {
    id: 'notif_2',
    title: 'Low Stock Warning',
    message: 'Metformin 850mg stock is down to 12 units (Min threshold: 25).',
    type: 'warning',
    category: 'low_stock',
    timestamp: '2026-07-22T08:30:00.000Z',
    isRead: false
  },
  {
    id: 'notif_3',
    title: 'Medicine Expiry Alert',
    message: 'Amoxicillin 500mg Batch BT-2026-A2 (35 units) expires in 38 days.',
    type: 'warning',
    category: 'expiring',
    timestamp: '2026-07-20T10:00:00.000Z',
    isRead: false
  },
  {
    id: 'notif_4',
    title: 'Expired Item Detected',
    message: 'Paracetamol 650mg Batch BT-2024-P2 (120 units) expired on 2026-06-15.',
    type: 'error',
    category: 'expiring',
    timestamp: '2026-07-16T09:00:00.000Z',
    isRead: true
  }
];
