"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins } from "next/font/google";
import {
  Utensils,
  Thermometer,
  Apple,
  Salad,
  Drumstick,
  Wheat,
  Bell,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Snowflake,
  X,
  ChevronUp,
  ChevronDown,
  Check,
  BarChart3,
  Leaf,
  Sun,
  Moon,
} from "lucide-react";

// Types
interface FoodItem {
  id: string;
  name: string;
  category: string;
  macronutrient: string;
  expirationDate: string;
  quantity: number;
  unit: string;
  storage?: string;
}

interface CategoryConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  lightColor: string;
  secondaryColor: string;
  textColor: string;
  gradient: string;
}

interface MacroConfig {
  name: string;
  color: string;
  lightColor: string;
  secondaryColor: string;
  textColor: string;
  gradient: string;
}

interface AppNotification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

// dark and light theme context
type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

// ThemeProvider Component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const themeClasses = {
  light: {
    bg: "bg-gray-50",
    cardBg: "bg-white",
    headerBg: "bg-white",
    text: "text-gray-900",
    textSecondary: "text-gray-700",
    textMuted: "text-gray-500",
    border: "border-gray-200",
    shadow: "shadow-sm",
    shadowHover: "shadow-md",
    input:
      "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500",
    button: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
    buttonPrimary: "bg-blue-600 text-white hover:bg-blue-700",
  },
  dark: {
    bg: "bg-gray-900",
    cardBg: "bg-gray-800",
    headerBg: "bg-gray-800",
    text: "text-gray-100",
    textSecondary: "text-gray-300",
    textMuted: "text-gray-400",
    border: "border-gray-700",
    shadow: "shadow-xl shadow-black/10",
    shadowHover: "shadow-2xl shadow-black/20",
    input:
      "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400",
    button: "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600",
    buttonPrimary: "bg-blue-600 text-white hover:bg-blue-500",
  },
};

// Helper functions
const calculateDaysLeft = (expirationDate: string): number => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const getCategoryIcon = (category: string): React.ReactNode => {
  switch (category) {
    case "Produce":
      return <Salad className="w-5 h-5" />;
    case "Meat":
      return <Drumstick className="w-5 h-5" />;
    case "Grains":
      return <Wheat className="w-5 h-5" />;
    case "Dairy":
      return <Snowflake className="w-5 h-5" />;
    default:
      return <Apple className="w-5 h-5" />;
  }
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// FridgeStats Component
interface FridgeStatsProps {
  foodItems: FoodItem[];
  notifications: AppNotification[];
  onAddNewItem: () => void;
  onUpdateInventory: () => void;
  onReviewExpiring: () => void;
}

const FridgeStats: React.FC<FridgeStatsProps> = ({
  foodItems,
  notifications,
  onAddNewItem,
  onUpdateInventory,
  onReviewExpiring,
}) => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = themeClasses[theme];
  const totalItems = foodItems.length;
  const expiringItems = foodItems.filter(
    (item) => calculateDaysLeft(item.expirationDate) <= 3
  ).length;
  const expiredItems = foodItems.filter(
    (item) => calculateDaysLeft(item.expirationDate) < 0
  ).length;
  const urgentNotifications = notifications.filter(
    (n) => n.type === "error" || n.type === "warning"
  ).length;

  return (
    <div
      className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden`}
    >
      <div
        className={`${currentTheme.bg} absolute top-0 left-0 w-full h-full opacity-100`}
      >
        <div className="w-full h-full bg-[url('/grid.svg')]"></div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-30"></div>

      <div className="relative z-10">
        <h2
          className={`${currentTheme.text} text-2xl font-bold mb-6 flex items-center tracking-tight`}
        >
          <BarChart3 className="mr-2 text-emerald-400" /> Fridge Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          <motion.div
            className={`${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} rounded-xl p-4 transition-shadow duration-300`}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className={`${currentTheme.text} text-sm`}>Total Items</p>
                <p className={`${currentTheme.text} text-2xl font-bold`}>
                  {totalItems}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center">
                <Utensils className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} rounded-xl p-4 transition-shadow duration-300`}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-400">Expiring Soon</p>
                <p className="text-2xl font-bold text-amber-400">
                  {expiringItems}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-900/50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} rounded-xl p-4 transition-shadow duration-300`}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-400">Expired</p>
                <p className="text-2xl font-bold text-rose-400">
                  {expiredItems}
                </p>
              </div>
              <div className="w-12 h-12 bg-rose-900/50 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-rose-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} rounded-xl p-4 transition-shadow duration-300`}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-400">Notifications</p>
                <p className="text-2xl font-bold text-blue-400">
                  {urgentNotifications}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>
        </div>

        <div
          className={`${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} rounded-xl p-4 transition-shadow duration-300`}
        >
          <h3 className={`${currentTheme.text} text-lg font-semibold mb-4`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddNewItem}
            >
              <Plus className="w-5 h-5" />
              <span>Add New Item</span>
            </motion.button>
            <motion.button
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUpdateInventory}
            >
              <Edit2 className="w-5 h-5" />
              <span>Update Inventory</span>
            </motion.button>
            <motion.button
              className="w-full flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReviewExpiring}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Review Expiring</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

// FoodItemCard Component
interface FoodItemCardProps {
  item: FoodItem;
  onEdit: () => void;
  onDelete: () => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = themeClasses[theme];
  const daysLeft = calculateDaysLeft(item.expirationDate);
  const [isHovered, setIsHovered] = useState(false);

  const getDaysLeftColor = (days: number): string => {
    if (days < 0) return "text-rose-400 border-rose-400/30";
    if (days <= 3) return "text-amber-400 border-amber-400/30";
    if (days <= 7) return "text-emerald-400 border-emerald-400/30";
    return "text-slate-400 border-slate-400/30";
  };

  return (
    <motion.div
      className={`${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border hover:border-slate-600/50 transition-colors duration-300`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center relative"
            whileHover={{
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 },
            }}
          >
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                categoryConfigs[item.category].gradient
              } opacity-80 absolute`}
            ></div>
            <div className="w-10 h-10 rounded-full border border-white/20 absolute"></div>
            <div className="relative z-10 text-white">
              {getCategoryIcon(item.category)}
            </div>
          </motion.div>
          <div>
            <h3 className="font-medium text-white line-clamp-1">{item.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${
                  categoryConfigs[item.category].lightColor
                } text-${categoryConfigs[item.category].textColor}`}
              >
                {item.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${
                  macroConfigs[item.macronutrient].lightColor
                } text-${macroConfigs[item.macronutrient].textColor}`}
              >
                {item.macronutrient}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-600/80 hover:text-white transition-colors duration-200"
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-rose-900/80 hover:text-rose-300 transition-colors duration-200"
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <motion.div
          className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50"
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
        >
          <div className="text-xs text-slate-400 mb-1">Quantity</div>
          <div className="font-medium text-white">
            {item.quantity} {item.unit}
          </div>
        </motion.div>
        <motion.div
          className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50"
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
        >
          <div className="text-xs text-slate-400 mb-1">Expires</div>
          <div className="font-medium text-white">
            {formatDate(item.expirationDate)}
          </div>
        </motion.div>
      </div>

      <motion.div
        className={`mt-3 text-xs font-medium flex items-center space-x-1 ${getDaysLeftColor(
          daysLeft
        )}`}
        animate={{ opacity: daysLeft <= 3 ? 1 : 0.7 }}
      >
        {daysLeft < 0 ? (
          <>
            <X className="w-3 h-3" />
            <span>Expired</span>
          </>
        ) : (
          <>
            {daysLeft <= 3 ? (
              <AlertTriangle className="w-3 h-3" />
            ) : (
              <Thermometer className="w-3 h-3" />
            )}
            <span>{daysLeft} days left</span>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={`${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} absolute inset-0 rounded-xl flex items-center justify-center`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center p-4">
              <p className="text-white font-medium mb-2">Quick Actions</p>
              <div className="flex space-x-2">
                <motion.button
                  className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-700 rounded text-xs text-white"
                  whileTap={{ scale: 0.9 }}
                  onClick={onEdit}
                >
                  Edit
                </motion.button>
                <motion.button
                  className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-700 rounded text-xs text-white"
                  whileTap={{ scale: 0.9 }}
                  onClick={onDelete}
                >
                  Remove
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// AddItemModal Component
interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: FoodItem) => void;
  categories: string[];
  macronutrients: string[];
  editItem: FoodItem | null;
  onUpdateItem: (item: FoodItem) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  categories,
  macronutrients,
  editItem,
  onUpdateItem,
}) => {
  const [formData, setFormData] = useState<FoodItem>({
    id: "",
    name: "",
    category: "Produce",
    macronutrient: "Vitamins",
    expirationDate: "",
    quantity: 1,
    unit: "pcs",
    storage: "Refrigerator",
  });

  const [errors, setErrors] = useState({
    name: "",
    expirationDate: "",
    quantity: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    } else {
      setFormData({
        id: "",
        name: "",
        category: "Produce",
        macronutrient: "Vitamins",
        expirationDate: "",
        quantity: 1,
        unit: "pcs",
        storage: "Refrigerator",
      });
    }
    setErrors({ name: "", expirationDate: "", quantity: "" });
  }, [editItem, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "name" && value.trim()) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
    if (name === "expirationDate" && value) {
      setErrors((prev) => ({ ...prev, expirationDate: "" }));
    }
    if (name === "quantity") {
      setErrors((prev) => ({ ...prev, quantity: "" }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { name: "", expirationDate: "", quantity: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
      isValid = false;
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = "Expiration date is required";
      isValid = false;
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (editItem) {
        onUpdateItem(formData);
      } else {
        onAddItem({
          ...formData,
          id: Date.now().toString(),
          expirationDate: formData.expirationDate,
        });
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {editItem ? "Edit Item" : "Add New Item"}
            </h2>
            <motion.button
              className="text-slate-400 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Item Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-slate-900 border ${
                    errors.name ? "border-rose-500/50" : "border-slate-700"
                  } rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all duration-200`}
                  placeholder="e.g., Apples, Chicken Breast"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-rose-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all duration-200"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="macronutrient"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Macronutrient
                </label>
                <select
                  id="macronutrient"
                  name="macronutrient"
                  value={formData.macronutrient}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all duration-200"
                >
                  {macronutrients.map((macro) => (
                    <option key={macro} value={macro}>
                      {macro}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="expirationDate"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Expiration Date*
                </label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-3 py-2 bg-slate-900 border ${
                    errors.expirationDate
                      ? "border-rose-500/50"
                      : "border-slate-700"
                  } rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all duration-200`}
                />
                {errors.expirationDate && (
                  <p className="mt-1 text-sm text-rose-400">
                    {errors.expirationDate}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Quantity*
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-slate-900 border ${
                      errors.quantity
                        ? "border-rose-500/50"
                        : "border-slate-700"
                    } rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all duration-200`}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-rose-400">
                      {errors.quantity}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="unit"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Unit
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all duration-200"
                  >
                    <option value="pcs">pcs</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="storage"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Storage Location
                </label>
                <select
                  id="storage"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all duration-200"
                >
                  <option value="Refrigerator">Refrigerator</option>
                  <option value="Freezer">Freezer</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Counter">Counter</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <motion.button
                type="button"
                className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {editItem ? "Update Item" : "Add to Fridge"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Toast Notification Component
interface ToastProps {
  notification: AppNotification | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getToastColors = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-600 border-emerald-700";
      case "error":
        return "bg-rose-600 border-rose-700";
      case "warning":
        return "bg-amber-600 border-amber-700";
      default:
        return "bg-blue-600 border-blue-700";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed bottom-4 right-4 z-50 max-w-xs px-4 py-3 rounded-lg shadow-lg border ${getToastColors(
          notification.type
        )} text-white`}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {notification.type === "success" && <Check className="w-5 h-5" />}
            {notification.type === "error" && <X className="w-5 h-5" />}
            {notification.type === "warning" && (
              <AlertTriangle className="w-5 h-5" />
            )}
            {notification.type === "info" && <Bell className="w-5 h-5" />}
            <p className="font-medium">{notification.message}</p>
          </div>
          <motion.button
            className="ml-2 text-white/70 hover:text-white transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Category Filters Component
interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = themeClasses[theme];
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
        Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        <motion.button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            selectedCategory === null
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(null)}
        >
          All Items
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Search Input Component
interface SearchInputProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchQuery, onSearch }) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search items..."
        className="w-full py-2.5 pl-10 pr-4 bg-slate-800/80 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-400 transition-all duration-300"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
    </div>
  );
};

// Main App Component
const FoodInventoryApp: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = themeClasses[theme];
  const [quickFilter, setQuickFilter] = useState<"all" | "expiring">("all");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: "1",
      name: "Apples",
      category: "Produce",
      macronutrient: "Vitamins",
      expirationDate: "2024-10-25",
      quantity: 5,
      unit: "pcs",
      storage: "Refrigerator",
    },
    {
      id: "2",
      name: "Fresh Salmon",
      category: "Meat",
      macronutrient: "Protein",
      expirationDate: "2024-10-20",
      quantity: 1,
      unit: "kg",
      storage: "Refrigerator",
    },
    {
      id: "3",
      name: "Quinoa",
      category: "Grains",
      macronutrient: "Carbohydrates",
      expirationDate: "2024-11-15",
      quantity: 2,
      unit: "kg",
      storage: "Pantry",
    },
    {
      id: "4",
      name: "Milk",
      category: "Dairy",
      macronutrient: "Protein",
      expirationDate: "2024-10-22",
      quantity: 2,
      unit: "l",
      storage: "Refrigerator",
    },
    {
      id: "5",
      name: "Frozen Peas",
      category: "Produce",
      macronutrient: "Vitamins",
      expirationDate: "2024-12-01",
      quantity: 1,
      unit: "kg",
      storage: "Freezer",
    },
  ]);

  const [filteredItems, setFilteredItems] = useState<FoodItem[]>(foodItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [notification, setNotification] = useState<AppNotification | null>(
    null
  );
  const [editItem, setEditItem] = useState<FoodItem | null>(null);

  const categories = ["Produce", "Meat", "Grains", "Dairy"];
  const macronutrients = [
    "Protein",
    "Carbohydrates",
    "Fats",
    "Vitamins",
    "Minerals",
  ];

  useEffect(() => {
    let result = [...foodItems];

    if (quickFilter === "expiring") {
      result = result.filter(
        (item) => calculateDaysLeft(item.expirationDate) <= 3
      );
    } else {
      if (searchQuery) {
        result = result.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.macronutrient.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedCategory) {
        result = result.filter((item) => item.category === selectedCategory);
      }
    }

    result.sort((a, b) => {
      const daysA = calculateDaysLeft(a.expirationDate);
      const daysB = calculateDaysLeft(b.expirationDate);
      return daysA - daysB;
    });

    setFilteredItems(result);
  }, [searchQuery, selectedCategory, foodItems]);

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    const id = Date.now().toString();
    setNotification({ id, message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleAddItem = (newItem: FoodItem) => {
    setFoodItems([...foodItems, newItem]);
    showNotification("Item added successfully!", "success");
  };

  const handleUpdateItem = (updatedItem: FoodItem) => {
    setFoodItems(
      foodItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    showNotification("Item updated successfully!", "success");
    setEditItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
    showNotification("Item removed from inventory.", "error");
  };

  const handleEditItem = (item: FoodItem) => {
    setEditItem(item);
    setShowAddItemModal(true);
  };

  const handleAddNewItem = () => setShowAddItemModal(true);
  const handleUpdateInventory = () => {
    setEditItem(null);
    setShowAddItemModal(true);
  };
  const handleReviewExpiring = () => {
    setQuickFilter("expiring");
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
    <div className="relative">
      <div
        className={`min-h-screen ${currentTheme.bg}  from-slate-950 to-slate-900 text-white`}
      >
        <style jsx global>{`
          .modern-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .modern-scrollbar::-webkit-scrollbar-track {
            background: ${theme === "light" ? "#f8fafc" : "#374151"};
            border-radius: 3px;
          }
          .modern-scrollbar::-webkit-scrollbar-thumb {
            background: ${theme === "light" ? "#cbd5e1" : "#6b7280"};
            border-radius: 3px;
            transition: all 0.2s ease;
          }
          .modern-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${theme === "light" ? "#94a3b8" : "#9ca3af"};
          }
          .modern-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${theme === "light"
              ? "#cbd5e1 #f8fafc"
              : "#6b7280 #374151"};
          }
        `}</style>
        ;
        <motion.button
          className={`fixed top-4 right-4 z-50 p-3 rounded-xl shadow-lg transition-all duration-300 ${
            theme === "light"
              ? "bg-white text-gray-800 border border-gray-200 hover:shadow-xl"
              : "bg-gray-800 text-gray-100 border border-gray-700 hover:shadow-2xl"
          }`}
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            {theme === "light" ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.header className={`mb-8`}>
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              My Fridge Inventory
            </motion.h1>
            <motion.p
              className="text-slate-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              Keep track of your food items and manage your kitchen inventory
            </motion.p>
          </motion.header>

          <div className="mb-8">
            <FridgeStats
              foodItems={foodItems}
              notifications={notification ? [notification] : []}
              onAddNewItem={handleAddNewItem}
              onUpdateInventory={handleUpdateInventory}
              onReviewExpiring={handleReviewExpiring}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <motion.div
                className={`${currentTheme.bg} backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Filters</h2>

                <div className="space-y-6">
                  <SearchInput
                    searchQuery={searchQuery}
                    onSearch={setSearchQuery}
                  />

                  <CategoryFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />

                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddItemModal(true)}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Item</span>
                  </motion.button>

                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery("");
                    }}
                  >
                    <X className="w-5 h-5" />
                    <span>Clear Filters</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-3">
              <motion.div
                className={`${currentTheme.headerBg} bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`${currentTheme.text} text-xl font-bold`}>
                    {selectedCategory
                      ? `${selectedCategory} Items`
                      : "All Items"}
                    <span
                      className={`${currentTheme.text} ml-2 text-sm font-normal`}
                    >
                      ({filteredItems.length})
                    </span>
                  </h2>
                  {searchQuery && (
                    <motion.button
                      className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="w-4 h-4" />
                      <span>Clear search</span>
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {filteredItems.length === 0 ? (
                    <motion.div
                      className="text-center py-12 px-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                        <Utensils className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">
                        No items found
                      </h3>
                      <p className="text-slate-400">
                        Try adjusting your search or filters
                      </p>

                      <motion.button
                        className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory(null);
                        }}
                      >
                        Clear All Filters
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, staggerChildren: 0.1 }}
                    >
                      {filteredItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                          <FoodItemCard
                            item={item}
                            onEdit={() => handleEditItem(item)}
                            onDelete={() => handleDeleteItem(item.id)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
        <AddItemModal
          isOpen={showAddItemModal}
          onClose={() => {
            setShowAddItemModal(false);
            setEditItem(null);
          }}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          categories={categories}
          macronutrients={macronutrients}
          editItem={editItem}
        />
        <Toast notification={notification} onClose={closeNotification} />
      </div>
    </div>
  );
};

// Configuration
const categoryConfigs: Record<string, CategoryConfig> = {
  Produce: {
    name: "Produce",
    icon: <Salad className="w-5 h-5" />,
    color: "emerald",
    lightColor: "emerald-900/50",
    secondaryColor: "emerald-700",
    textColor: "emerald-300",
    gradient: "from-emerald-600 to-emerald-800",
  },
  Meat: {
    name: "Meat",
    icon: <Drumstick className="w-5 h-5" />,
    color: "rose",
    lightColor: "rose-900/50",
    secondaryColor: "rose-700",
    textColor: "rose-300",
    gradient: "from-rose-600 to-rose-800",
  },
  Grains: {
    name: "Grains",
    icon: <Wheat className="w-5 h-5" />,
    color: "amber",
    lightColor: "amber-900/50",
    secondaryColor: "amber-700",
    textColor: "amber-300",
    gradient: "from-amber-600 to-amber-800",
  },
  Dairy: {
    name: "Dairy",
    icon: <Snowflake className="w-5 h-5" />,
    color: "blue",
    lightColor: "blue-900/50",
    secondaryColor: "blue-700",
    textColor: "blue-300",
    gradient: "from-blue-600 to-blue-800",
  },
};

const macroConfigs: Record<string, MacroConfig> = {
  Protein: {
    name: "Protein",
    color: "rose",
    lightColor: "rose-900/50",
    secondaryColor: "rose-700",
    textColor: "rose-300",
    gradient: "from-rose-600 to-rose-800",
  },
  Carbohydrates: {
    name: "Carbohydrates",
    color: "amber",
    lightColor: "amber-900/50",
    secondaryColor: "amber-700",
    textColor: "amber-300",
    gradient: "from-amber-600 to-amber-800",
  },
  Fats: {
    name: "Fats",
    color: "blue",
    lightColor: "blue-900/50",
    secondaryColor: "blue-700",
    textColor: "blue-300",
    gradient: "from-blue-600 to-blue-800",
  },
  Vitamins: {
    name: "Vitamins",
    color: "emerald",
    lightColor: "emerald-900/50",
    secondaryColor: "emerald-700",
    textColor: "emerald-300",
    gradient: "from-emerald-600 to-emerald-800",
  },
  Minerals: {
    name: "Minerals",
    color: "cyan",
    lightColor: "cyan-900/50",
    secondaryColor: "cyan-700",
    textColor: "cyan-300",
    gradient: "from-cyan-600 to-cyan-800",
  },
};

// export default FoodInventoryApp;

const Page: React.FC = () => {
  return (
    <main className={poppins.className}>
      <ThemeProvider>
        <FoodInventoryApp />
      </ThemeProvider>
    </main>
  );
};

export default Page;
