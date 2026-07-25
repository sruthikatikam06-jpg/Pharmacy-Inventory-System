import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Medicine,
  MedicineBatch,
  Supplier,
  PurchaseOrder,
  Customer,
  SaleInvoice,
  StockMovement,
  ActivityLog,
  AppNotification
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SUPPLIERS,
  INITIAL_MEDICINES,
  INITIAL_CUSTOMERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_SALES_INVOICES,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User) => void;
  login: (email: string, role: User['role']) => void;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  medicines: Medicine[];
  addMedicine: (med: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMedicine: (id: string, med: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  addBatchToMedicine: (medicineId: string, batch: MedicineBatch) => void;
  removeExpiredBatch: (medicineId: string, batchNumber: string) => void;
  
  suppliers: Supplier[];
  addSupplier: (sup: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, sup: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  purchaseOrders: PurchaseOrder[];
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'orderDate'>) => void;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status']) => void;
  
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'totalVisits' | 'totalSpent' | 'createdAt'>) => void;
  
  salesInvoices: SaleInvoice[];
  processSale: (sale: Omit<SaleInvoice, 'id' | 'invoiceNumber' | 'createdAt'>) => SaleInvoice | null;
  
  stockMovements: StockMovement[];
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'createdAt'>) => void;
  
  activityLogs: ActivityLog[];
  logActivity: (action: string, category: ActivityLog['category'], details: string) => void;
  
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  toast: ToastState | null;
  showToast: (message: string, type?: ToastState['type']) => void;
  
  sendEmailAlertsSimulated: () => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('pharmix_theme') as 'light' | 'dark') || 'light';
  });

  // Current User
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pharmix_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default to Admin
  });

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === Date.now() ? null : current));
    }, 4000);
  };

  // State entities initialized from localStorage or mock data
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('pharmix_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('pharmix_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('pharmix_purchase_orders');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('pharmix_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [salesInvoices, setSalesInvoices] = useState<SaleInvoice[]>(() => {
    const saved = localStorage.getItem('pharmix_sales_invoices');
    return saved ? JSON.parse(saved) : INITIAL_SALES_INVOICES;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('pharmix_stock_movements');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('pharmix_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('pharmix_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('pharmix_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pharmix_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pharmix_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pharmix_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pharmix_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('pharmix_purchase_orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('pharmix_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('pharmix_sales_invoices', JSON.stringify(salesInvoices));
  }, [salesInvoices]);

  useEffect(() => {
    localStorage.setItem('pharmix_stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('pharmix_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('pharmix_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = (email: string, role: User['role']) => {
    const found = users.find((u) => u.email === email || u.role === role) || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(found);
    logActivity('User Login', 'auth', `Logged in as ${found.name} (${found.role})`);
    showToast(`Welcome back, ${found.name}!`, 'success');
  };

  const logout = () => {
    if (currentUser) {
      logActivity('User Logout', 'auth', `${currentUser.name} signed out`);
    }
    setCurrentUser(null);
    showToast('Signed out successfully.', 'info');
  };

  const logActivity = (action: string, category: ActivityLog['category'], details: string) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      category,
      details,
      ipAddress: '192.168.1.100'
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'createdAt'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: `sm_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setStockMovements((prev) => [newMovement, ...prev]);
  };

  // Medicine CRUD
  const addMedicine = (medData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMed: Medicine = {
      ...medData,
      id: `med_${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setMedicines((prev) => [newMed, ...prev]);
    logActivity('Added Medicine', 'inventory', `Added "${newMed.name}" to inventory`);
    showToast(`Added ${newMed.name} successfully`, 'success');
  };

  const updateMedicine = (id: string, medData: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...medData, updatedAt: new Date().toISOString() } : m))
    );
    logActivity('Updated Medicine', 'inventory', `Updated medicine ID: ${id}`);
    showToast('Medicine record updated', 'info');
  };

  const deleteMedicine = (id: string) => {
    const target = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    logActivity('Deleted Medicine', 'inventory', `Deleted ${target?.name || id}`);
    showToast('Medicine deleted', 'warning');
  };

  const addBatchToMedicine = (medicineId: string, batch: MedicineBatch) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          const updatedBatches = [...med.batches, batch];
          const newTotalStock = updatedBatches.reduce((acc, b) => acc + b.quantity, 0);
          return {
            ...med,
            batches: updatedBatches,
            totalStock: newTotalStock,
            updatedAt: new Date().toISOString()
          };
        }
        return med;
      })
    );

    const med = medicines.find((m) => m.id === medicineId);
    if (med) {
      addStockMovement({
        medicineId,
        medicineName: med.name,
        batchNumber: batch.batchNumber,
        type: 'stock_in',
        quantity: batch.quantity,
        previousStock: med.totalStock,
        newStock: med.totalStock + batch.quantity,
        reason: 'New Batch Added',
        performedBy: currentUser?.name || 'System'
      });
    }

    logActivity('Added Batch', 'inventory', `Added batch ${batch.batchNumber} to medicine ID ${medicineId}`);
    showToast(`Batch ${batch.batchNumber} added`, 'success');
  };

  const removeExpiredBatch = (medicineId: string, batchNumber: string) => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;

    const batchToRemove = med.batches.find((b) => b.batchNumber === batchNumber);
    if (!batchToRemove) return;

    const updatedBatches = med.batches.filter((b) => b.batchNumber !== batchNumber);
    const newTotalStock = updatedBatches.reduce((acc, b) => acc + b.quantity, 0);

    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, batches: updatedBatches, totalStock: newTotalStock } : m))
    );

    addStockMovement({
      medicineId,
      medicineName: med.name,
      batchNumber,
      type: 'expired_removal',
      quantity: -batchToRemove.quantity,
      previousStock: med.totalStock,
      newStock: newTotalStock,
      reason: 'Quarantine expired batch',
      performedBy: currentUser?.name || 'System'
    });

    logActivity('Removed Expired Batch', 'inventory', `Removed expired batch ${batchNumber} (${batchToRemove.quantity} units) from ${med.name}`);
    showToast(`Batch ${batchNumber} removed from inventory`, 'warning');
  };

  // Supplier CRUD
  const addSupplier = (supData: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...supData,
      id: `sup_${Date.now()}`
    };
    setSuppliers((prev) => [...prev, newSup]);
    logActivity('Added Supplier', 'inventory', `Added supplier ${newSup.name}`);
    showToast(`Supplier ${newSup.name} added`, 'success');
  };

  const updateSupplier = (id: string, supData: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...supData } : s)));
    showToast('Supplier updated', 'info');
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    showToast('Supplier removed', 'warning');
  };

  // Purchase Order
  const createPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'orderDate'>) => {
    const newPO: PurchaseOrder = {
      ...poData,
      id: `po_${Date.now()}`,
      poNumber: `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      orderDate: new Date().toISOString()
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    logActivity('Created Purchase Order', 'purchase', `Created ${newPO.poNumber} for $${newPO.totalAmount.toFixed(2)}`);
    showToast(`Purchase Order ${newPO.poNumber} created`, 'success');
  };

  const updatePurchaseOrderStatus = (id: string, status: PurchaseOrder['status']) => {
    const po = purchaseOrders.find((p) => p.id === id);
    if (!po) return;

    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );

    // If order is marked as 'received', automatically increment inventory stock
    if (status === 'received' && po.status !== 'received') {
      po.items.forEach((item) => {
        const med = medicines.find((m) => m.id === item.medicineId);
        if (med) {
          const newBatch: MedicineBatch = {
            batchNumber: `BT-PO-${po.poNumber.slice(-4)}`,
            barcode: `${med.barcode}-PO`,
            expiryDate: item.expectedExpiry || '2028-12-31',
            manufacturingDate: new Date().toISOString().split('T')[0],
            quantity: item.quantity,
            initialQuantity: item.quantity,
            purchasePrice: item.unitPrice,
            sellingPrice: med.sellingPrice,
            rackLocation: med.batches[0]?.rackLocation || 'Receiving Dock',
            supplierId: po.supplierId
          };

          addBatchToMedicine(med.id, newBatch);
        }
      });
      showToast(`Stock automatically updated for PO ${po.poNumber}`, 'success');
    }

    logActivity('Updated PO Status', 'purchase', `PO ${po.poNumber} status set to "${status}"`);
  };

  // Customer Management
  const addCustomer = (custData: Omit<Customer, 'id' | 'totalVisits' | 'totalSpent' | 'createdAt'>) => {
    const newCust: Customer = {
      ...custData,
      id: `cust_${Date.now()}`,
      totalVisits: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };
    setCustomers((prev) => [...prev, newCust]);
    showToast(`Customer ${newCust.name} created`, 'success');
  };

  // Process Sale Invoice (POS)
  const processSale = (saleData: Omit<SaleInvoice, 'id' | 'invoiceNumber' | 'createdAt'>): SaleInvoice | null => {
    const now = new Date().toISOString();
    const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Check stock availability for all items
    for (const item of saleData.items) {
      const med = medicines.find((m) => m.id === item.medicineId);
      if (!med) {
        showToast(`Medicine ${item.medicineName} not found`, 'error');
        return null;
      }
      if (med.totalStock < item.quantity) {
        showToast(`Insufficient stock for ${med.name}. Available: ${med.totalStock}`, 'error');
        return null;
      }
    }

    // Deduct stock from batches (FEFO: First Expired, First Out)
    const updatedMeds = [...medicines];
    saleData.items.forEach((item) => {
      const medIndex = updatedMeds.findIndex((m) => m.id === item.medicineId);
      if (medIndex !== -1) {
        const med = updatedMeds[medIndex];
        let remainingQtyToDeduct = item.quantity;

        // Sort batches by expiry date
        const sortedBatches = [...med.batches].sort(
          (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );

        const newBatches = sortedBatches.map((batch) => {
          if (remainingQtyToDeduct <= 0) return batch;
          if (batch.quantity >= remainingQtyToDeduct) {
            const updated = { ...batch, quantity: batch.quantity - remainingQtyToDeduct };
            remainingQtyToDeduct = 0;
            return updated;
          } else {
            remainingQtyToDeduct -= batch.quantity;
            return { ...batch, quantity: 0 };
          }
        });

        const newTotalStock = newBatches.reduce((acc, b) => acc + b.quantity, 0);

        updatedMeds[medIndex] = {
          ...med,
          batches: newBatches,
          totalStock: newTotalStock,
          updatedAt: now
        };

        // Record stock movement
        addStockMovement({
          medicineId: med.id,
          medicineName: med.name,
          batchNumber: item.batchNumber || 'FEFO-Auto',
          type: 'stock_out',
          quantity: -item.quantity,
          previousStock: med.totalStock,
          newStock: newTotalStock,
          reason: `POS Sale #${invNumber}`,
          referenceNumber: invNumber,
          performedBy: currentUser?.name || 'Staff'
        });
      }
    });

    setMedicines(updatedMeds);

    const newInvoice: SaleInvoice = {
      ...saleData,
      id: `inv_${Date.now()}`,
      invoiceNumber: invNumber,
      createdAt: now
    };

    setSalesInvoices((prev) => [newInvoice, ...prev]);

    // Update customer stats if applicable
    if (saleData.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === saleData.customerId
            ? {
                ...c,
                totalVisits: c.totalVisits + 1,
                totalSpent: c.totalSpent + saleData.totalAmount
              }
            : c
        )
      );
    }

    logActivity('Completed Sale', 'sales', `Invoice ${invNumber} for $${newInvoice.totalAmount.toFixed(2)}`);
    showToast(`Sale completed! Invoice #${invNumber}`, 'success');

    return newInvoice;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared', 'info');
  };

  const sendEmailAlertsSimulated = () => {
    logActivity('Email Alert System', 'system', 'Dispatched automated low stock & expiry notification digest to admin@pharmix.com');
    showToast('Email alert digest sent to pharmacy management!', 'success');
  };

  const resetToDefaultData = () => {
    setMedicines(INITIAL_MEDICINES);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setSalesInvoices(INITIAL_SALES_INVOICES);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Reset system to default sample dataset', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        login,
        logout,
        theme,
        toggleTheme,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addBatchToMedicine,
        removeExpiredBatch,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        purchaseOrders,
        createPurchaseOrder,
        updatePurchaseOrderStatus,
        customers,
        addCustomer,
        salesInvoices,
        processSale,
        stockMovements,
        addStockMovement,
        activityLogs,
        logActivity,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        toast,
        showToast,
        sendEmailAlertsSimulated,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
