"use client";

import { Poppins } from "next/font/google";
import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import {
  BookOpen,
  Users,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
  BarChart3,
  Settings,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Sparkles,
  Activity,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
  status: "available" | "borrowed";
}

interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  borrowedBooks: string[];
}

interface BorrowEvent {
  id: string;
  bookId: string;
  memberId: string;
  type: "borrow" | "return";
  date: Date;
  dueDate?: Date;
}

const genres = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Mystery",
  "Biography",
  "Fantasy",
  "History",
  "Romance",
];

const generateMockBooks = (count: number): Book[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `book-${i + 1}`,
    title: `Book Title ${i + 1}`,
    author: `Author ${Math.floor(i / 3) + 1}`,
    genre: genres[i % genres.length],
    coverUrl: `https://source.unsplash.com/random/200x300?book&sig=${i}`,
    status: Math.random() > 0.3 ? "available" : "borrowed",
  }));
};

const generateMockMembers = (count: number): Member[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `member-${i + 1}`,
    name: `Member ${i + 1}`,
    avatarUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
    borrowedBooks: [],
  }));
};

const generateMockEvents = (
  books: Book[],
  members: Member[],
  count: number
): BorrowEvent[] => {
  const now = new Date();
  const events: BorrowEvent[] = [];

  for (let i = 0; i < count; i++) {
    const bookIndex = Math.floor(Math.random() * books.length);
    const memberIndex = Math.floor(Math.random() * members.length);
    const type = Math.random() > 0.4 ? "borrow" : "return";
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const dueDate = new Date(date);
    dueDate.setDate(date.getDate() + 14);

    events.push({
      id: `event-${i + 1}`,
      bookId: books[bookIndex].id,
      memberId: members[memberIndex].id,
      type,
      date,
      dueDate: type === "borrow" ? dueDate : undefined,
    });
  }

  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
};

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  theme: Theme;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 text-left rounded-lg border transition-all duration-200 flex items-center justify-between cursor-pointer ${
          theme === "light"
            ? "bg-white border-gray-300 text-gray-900 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            : "bg-gray-700 border-gray-600 text-white hover:border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-sm font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border shadow-lg overflow-hidden max-h-60 ${
              theme === "light"
                ? "bg-white border-gray-200 shadow-gray-200"
                : "bg-gray-700 border-gray-600 shadow-black/20"
            }`}
          >
            <div className="overflow-y-auto overflow-x-hidden max-h-60 modern-scrollbar">
              {options.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors cursor-pointer ${
                    theme === "light"
                      ? "text-gray-900 hover:bg-blue-50 hover:text-blue-700"
                      : "text-white hover:bg-gray-600 hover:text-blue-300"
                  } ${
                    value === option.value
                      ? theme === "light"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-600 text-blue-300"
                      : ""
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const LibraryDashboard: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<BorrowEvent[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventsPerPage] = useState<number>(8);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("date");
  const [filterType, setFilterType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastUpdatedDateString, setLastUpdatedDateString] =
    useState<string>("");

  useEffect(() => {
    setHasMounted(true);
    setIsLoading(true);
    const mockBooks = generateMockBooks(100);
    const mockMembers = generateMockMembers(30);
    const mockEvents = generateMockEvents(mockBooks, mockMembers, 50);

    setBooks(mockBooks);
    setMembers(mockMembers);
    setEvents(mockEvents);
    setIsLoading(false);
    setLastUpdatedDateString(new Date().toLocaleDateString());
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hasMounted]);

  const totalBooks = books.length;
  const borrowedBooks = books.filter(
    (book) => book.status === "borrowed"
  ).length;
  const availableBooks = totalBooks - borrowedBooks;
  const overdueBooks = events.filter((event) => {
    if (event.type === "borrow" && event.dueDate) {
      return new Date() > event.dueDate;
    }
    return false;
  }).length;
  const activeBorrowers = new Set(
    events
      .filter(
        (event) =>
          event.type === "borrow" &&
          !events.some(
            (e) =>
              e.type === "return" &&
              e.bookId === event.bookId &&
              e.date > event.date
          )
      )
      .map((event) => event.memberId)
  ).size;

  const borrowRate =
    totalBooks > 0 ? Math.round((borrowedBooks / totalBooks) * 100) : 0;
  const previousWeekBorrowed = Math.floor(borrowedBooks * 0.9);
  const borrowTrend = borrowedBooks > previousWeekBorrowed ? "up" : "down";
  const borrowChange = Math.abs(borrowedBooks - previousWeekBorrowed);

  const genreCounts: Record<string, number> = {};
  events.forEach((event) => {
    if (event.type === "borrow") {
      const book = books.find((b) => b.id === event.bookId);
      if (book) {
        const { genre } = book;
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    }
  });

  const filteredGenreCounts =
    selectedGenre === "All"
      ? genreCounts
      : Object.fromEntries(
          Object.entries(genreCounts).filter(
            ([genre]) => genre === selectedGenre
          )
        );

  const chartData = {
    labels: Object.keys(filteredGenreCounts),
    datasets: [
      {
        label: "Books Borrowed",
        data: Object.values(filteredGenreCounts),
        backgroundColor:
          theme === "light"
            ? [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
                "#06B6D4",
                "#84CC16",
                "#F97316",
              ]
            : [
                "#60A5FA",
                "#34D399",
                "#FBBF24",
                "#F87171",
                "#A78BFA",
                "#38BDF8",
                "#A3E635",
                "#FB923C",
              ],
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    animation: {
      duration: 800,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor:
          theme === "light"
            ? "rgba(255, 255, 255, 0.95)"
            : "rgba(30, 41, 59, 0.95)",
        titleColor: theme === "light" ? "#1e293b" : "#f1f5f9",
        bodyColor: theme === "light" ? "#475569" : "#cbd5e1",
        borderColor: theme === "light" ? "#e2e8f0" : "#475569",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14,
          weight: 600,
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 13,
          weight: 500,
        },
        padding: 16,
        caretSize: 8,
        callbacks: {
          title: (context) => `${context[0].label}`,
          label: (context) => `${context.parsed.y} books borrowed`,
          afterLabel: (context) => {
            const total = (context.dataset.data as number[]).reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
            return `${percentage}% of total`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === "light" ? "#64748b" : "#94a3b8",
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
            weight: 500,
          },
          padding: 8,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === "light" ? "#64748b" : "#94a3b8",
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
            weight: 500,
          },
          stepSize: 1,
          padding: 12,
        },
        grid: {
          color:
            theme === "light"
              ? "rgba(203, 213, 225, 0.4)"
              : "rgba(71, 85, 105, 0.4)",
          lineWidth: 1,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const filteredEvents = events.filter((event) => {
    const book = books.find((b) => b.id === event.bookId);
    const member = members.find((m) => m.id === event.memberId);

    if (!book || !member) return false;

    if (filterType !== "all" && event.type !== filterType) return false;

    const daysDiff = Math.floor(
      (new Date().getTime() - event.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (parseInt(dateRange) !== 0 && daysDiff > parseInt(dateRange))
      return false;

    const searchString =
      `${book.title} ${book.author} ${member.name} ${book.genre}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return b.date.getTime() - a.date.getTime();
      case "member":
        const memberA = members.find((m) => m.id === a.memberId)?.name || "";
        const memberB = members.find((m) => m.id === b.memberId)?.name || "";
        return memberA.localeCompare(memberB);
      case "book":
        const bookA = books.find((b) => b.id === a.bookId)?.title || "";
        const bookB = books.find((b) => b.id === b.bookId)?.title || "";
        return bookA.localeCompare(bookB);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = sortedEvents.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, dateRange, sortBy]);

  const exportToCSV = async () => {
    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const csvData = sortedEvents.map((event) => {
      const book = books.find((b) => b.id === event.bookId);
      const member = members.find((m) => m.id === event.memberId);
      return {
        Date: event.date.toLocaleDateString(),
        Member: member?.name || "",
        Book: book?.title || "",
        Author: book?.author || "",
        Genre: book?.genre || "",
        Action: event.type,
        DueDate: event.dueDate?.toLocaleDateString() || "N/A",
        Status:
          event.type === "borrow" && event.dueDate && new Date() > event.dueDate
            ? "Overdue"
            : "On Time",
      };
    });

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((header) => `"${(row as any)[header] || ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `library-activities-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdatedDateString(new Date().toLocaleDateString());
      setIsLoading(false);
    }, 1000);
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

  const currentTheme = themeClasses[theme];

  const genreOptions = [
    { value: "All", label: "All Genres" },
    ...genres.map((genre) => ({ value: genre, label: genre })),
  ];

  const filterOptions = [
    { value: "all", label: "All Types" },
    { value: "borrow", label: "Borrowed" },
    { value: "return", label: "Returned" },
  ];

  const dateOptions = [
    { value: "0", label: "All Time" },
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
  ];

  const sortOptions = [
    { value: "date", label: "Sort by Date" },
    { value: "member", label: "Sort by Member" },
    { value: "book", label: "Sort by Book" },
  ];

  return (
    <div
      className={`min-h-screen w-full ${currentTheme.bg} transition-colors duration-300`}
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

      <motion.header
        className={`${currentTheme.headerBg} ${currentTheme.shadow} border-b ${currentTheme.border} sticky top-0 z-40 backdrop-blur-sm bg-opacity-95`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div
              className="flex flex-wrap items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={`p-3 rounded-xl ${
                  theme === "light" ? "bg-blue-100" : "bg-blue-900/30"
                }`}
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <BookOpen
                  className={`h-6 w-6 ${
                    theme === "light" ? "text-blue-600" : "text-blue-400"
                  }`}
                />
              </motion.div>
              <div>
                <h1
                  className={`text-xl sm:text-2xl font-bold ${currentTheme.text}`}
                >
                  Library Dashboard
                </h1>
                <p className={`text-sm ${currentTheme.textMuted}`}>
                  Digital collection management
                </p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={refreshData}
                className={`
                  p-2 rounded-lg
                  ${currentTheme.button}
                  border ${currentTheme.border}
                  transition-colors
                  ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                disabled={isLoading}
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                animate={isLoading ? { rotate: 360 } : {}}
                transition={{
                  rotate: isLoading
                    ? { duration: 1, repeat: Infinity, ease: "linear" }
                    : { duration: 0.2 },
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.button>

              <motion.button
                onClick={exportToCSV}
                className={`
                  flex items-center justify-center
                  px-3 sm:px-4 py-2 rounded-lg
                  ${currentTheme.buttonPrimary}
                  transition-colors relative overflow-hidden
                  ${isExporting ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                disabled={isExporting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isExporting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center"
                    >
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium hidden sm:inline sm:ml-2">
                        Exporting...
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center"
                    >
                      <Download className="h-4 w-4" />
                      <span className="text-sm font-medium hidden sm:inline sm:ml-2">
                        Export CSV
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {hasMounted && (
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className={`text-xs ${currentTheme.textMuted}`}>
                    {lastUpdatedDateString}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className={`w-8 h-8 border-4 border-t-transparent rounded-full ${
                theme === "light" ? "border-blue-600" : "border-blue-400"
              }`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className={`text-sm ${currentTheme.textMuted}`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading dashboard...
            </motion.p>
          </motion.div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {[
              {
                title: "Total Books",
                value: totalBooks,
                subtitle: `${availableBooks} available`,
                icon: BookOpen,
                color: "blue",
                trend: null,
              },
              {
                title: "Borrowed Books",
                value: borrowedBooks,
                subtitle: `${borrowChange} this week`,
                icon: Clock,
                color: "green",
                trend: borrowTrend,
              },
              {
                title: "Overdue Books",
                value: overdueBooks,
                subtitle:
                  overdueBooks > 0 ? "Requires attention" : "All on time",
                icon: AlertCircle,
                color: "red",
                trend: null,
              },
              {
                title: "Active Borrowers",
                value: activeBorrowers,
                subtitle: `${borrowRate}% utilization`,
                icon: Users,
                color: "purple",
                trend: null,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                className={`${currentTheme.cardBg} ${currentTheme.shadow} border ${currentTheme.border} rounded-xl p-6 transition-all duration-200 hover:${currentTheme.shadowHover} group relative overflow-hidden`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className={`absolute inset-0 ${
                    stat.color === "blue"
                      ? "bg-gradient-to-br from-blue-500/5 to-cyan-500/5"
                      : stat.color === "green"
                      ? "bg-gradient-to-br from-green-500/5 to-emerald-500/5"
                      : stat.color === "red"
                      ? "bg-gradient-to-br from-red-500/5 to-pink-500/5"
                      : "bg-gradient-to-br from-purple-500/5 to-violet-500/5"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${currentTheme.textMuted}`}
                      >
                        {stat.title}
                      </p>
                      <motion.h2
                        className={`text-2xl sm:text-3xl font-bold ${currentTheme.text} mt-1`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        {stat.value}
                      </motion.h2>
                      <div className="flex items-center mt-2 space-x-1">
                        {stat.trend && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            {stat.trend === "up" ? (
                              <ArrowUpRight className="h-3 w-3 text-green-500" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-500" />
                            )}
                          </motion.div>
                        )}
                        <span
                          className={`text-xs ${
                            stat.trend === "up"
                              ? "text-green-600"
                              : stat.trend === "down"
                              ? "text-red-600"
                              : currentTheme.textMuted
                          }`}
                        >
                          {stat.subtitle}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      className={`p-3 rounded-lg ${
                        stat.color === "blue"
                          ? theme === "light"
                            ? "bg-blue-50"
                            : "bg-blue-900/20"
                          : stat.color === "green"
                          ? theme === "light"
                            ? "bg-green-50"
                            : "bg-green-900/20"
                          : stat.color === "red"
                          ? theme === "light"
                            ? "bg-red-50"
                            : "bg-red-900/20"
                          : theme === "light"
                          ? "bg-purple-50"
                          : "bg-purple-900/20"
                      }`}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <stat.icon
                        className={`h-6 w-6 ${
                          stat.color === "blue"
                            ? theme === "light"
                              ? "text-blue-600"
                              : "text-blue-400"
                            : stat.color === "green"
                            ? theme === "light"
                              ? "text-green-600"
                              : "text-green-400"
                            : stat.color === "red"
                            ? theme === "light"
                              ? "text-red-600"
                              : "text-red-400"
                            : theme === "light"
                            ? "text-purple-600"
                            : "text-purple-400"
                        }`}
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={`${currentTheme.cardBg} ${currentTheme.shadow} border ${currentTheme.border} rounded-xl p-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className={`p-2 rounded-lg ${
                    theme === "light" ? "bg-blue-50" : "bg-blue-900/20"
                  }`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <BarChart3
                    className={`h-5 w-5 ${
                      theme === "light" ? "text-blue-600" : "text-blue-400"
                    }`}
                  />
                </motion.div>
                <div>
                  <h2
                    className={`text-lg sm:text-xl font-semibold ${currentTheme.text}`}
                  >
                    Genre Analytics
                  </h2>
                  <p className={`text-sm ${currentTheme.textMuted}`}>
                    Books borrowed by category this month
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="w-full sm:w-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CustomSelect
                  value={selectedGenre}
                  onChange={setSelectedGenre}
                  options={genreOptions}
                  placeholder="Select Genre"
                  theme={theme}
                />
              </motion.div>
            </div>

            <motion.div
              className="h-72 sm:h-80"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Chart type="bar" data={chartData} options={chartOptions} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              className={`${currentTheme.cardBg} ${currentTheme.shadow} border ${currentTheme.border} rounded-xl p-6`}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className={`p-2 rounded-lg ${
                      theme === "light" ? "bg-green-50" : "bg-green-900/20"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Activity
                      className={`h-5 w-5 ${
                        theme === "light" ? "text-green-600" : "text-green-400"
                      }`}
                    />
                  </motion.div>
                  <div>
                    <h2
                      className={`text-lg sm:text-xl font-semibold ${currentTheme.text}`}
                    >
                      Recent Activity
                    </h2>
                    <p className={`text-sm ${currentTheme.textMuted}`}>
                      Latest borrowing and return transactions
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative w-full sm:w-64">
                    <Search
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.textMuted} z-10 pointer-events-none`}
                    />
                    <motion.input
                      type="text"
                      placeholder="Search activities..."
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.input} text-sm focus:outline-none focus:ring-2 transition-all relative z-0`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <CustomSelect
                      value={filterType}
                      onChange={setFilterType}
                      options={filterOptions}
                      placeholder="Filter Type"
                      theme={theme}
                    />

                    <CustomSelect
                      value={dateRange}
                      onChange={setDateRange}
                      options={dateOptions}
                      placeholder="Date Range"
                      theme={theme}
                    />

                    <CustomSelect
                      value={sortBy}
                      onChange={setSortBy}
                      options={sortOptions}
                      placeholder="Sort By"
                      theme={theme}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="block md:hidden space-y-4"
                  >
                    {currentEvents.map((event, index) => {
                      const book = books.find((b) => b.id === event.bookId);
                      const member = members.find(
                        (m) => m.id === event.memberId
                      );

                      if (!book || !member) return null;

                      const isOverdue =
                        event.type === "borrow" &&
                        event.dueDate &&
                        new Date() > event.dueDate;

                      return (
                        <motion.div
                          key={event.id}
                          className={`p-4 rounded-lg border ${currentTheme.border} ${currentTheme.cardBg} group hover:${currentTheme.shadowHover} transition-all duration-200`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className="flex items-start space-x-3">
                            <motion.img
                              className="h-12 w-12 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-200"
                              src={member.avatarUrl || "/placeholder.svg"}
                              alt={member.name}
                              whileHover={{ scale: 1.1, rotate: 2 }}
                              transition={{ duration: 0.2 }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <p
                                  className={`font-semibold ${currentTheme.text}`}
                                >
                                  {member.name}
                                </p>
                                <motion.span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    event.type === "borrow"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {event.type === "borrow"
                                    ? "Borrowed"
                                    : "Returned"}
                                </motion.span>
                              </div>
                              <p
                                className={`font-medium ${currentTheme.textSecondary} mb-1`}
                              >
                                {book.title}
                              </p>
                              <p
                                className={`text-sm ${currentTheme.textMuted} mb-2`}
                              >
                                {book.author} • {book.genre}
                              </p>
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-sm ${currentTheme.textMuted}`}
                                >
                                  {event.date.toLocaleDateString()}
                                </span>
                                {event.type === "borrow" && (
                                  <motion.span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      isOverdue
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {isOverdue
                                      ? "Overdue"
                                      : `Due ${event.dueDate?.toLocaleDateString()}`}
                                  </motion.span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="hidden md:block"
                  >
                    <div
                      className={`overflow-x-auto rounded-lg border ${currentTheme.border}`}
                    >
                      <table
                        className={`min-w-full ${
                          theme === "light"
                            ? "divide-y divide-gray-200"
                            : "divide-y divide-gray-700"
                        }`}
                      >
                        <thead
                          className={
                            theme === "light" ? "bg-gray-50" : "bg-gray-700"
                          }
                        >
                          <tr>
                            {[
                              "Member",
                              "Book",
                              "Genre",
                              "Action",
                              "Date",
                              "Status",
                            ].map((header) => (
                              <th
                                key={header}
                                className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textMuted} uppercase tracking-wider`}
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody
                          className={`${currentTheme.cardBg} ${
                            theme === "light"
                              ? "divide-y divide-gray-200"
                              : "divide-y divide-gray-700"
                          }`}
                        >
                          {currentEvents.map((event, index) => {
                            const book = books.find(
                              (b) => b.id === event.bookId
                            );
                            const member = members.find(
                              (m) => m.id === event.memberId
                            );

                            if (!book || !member) return null;

                            const isOverdue =
                              event.type === "borrow" &&
                              event.dueDate &&
                              new Date() > event.dueDate;

                            return (
                              <motion.tr
                                key={event.id}
                                className={`hover:${
                                  theme === "light"
                                    ? "bg-gray-50"
                                    : "bg-gray-700"
                                } transition-colors group`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: index * 0.02,
                                }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <motion.img
                                      className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-200"
                                      src={
                                        member.avatarUrl || "/placeholder.svg"
                                      }
                                      alt={member.name}
                                      whileHover={{ scale: 1.1 }}
                                    />
                                    <div className="ml-4">
                                      <motion.div
                                        className={`text-sm font-medium ${currentTheme.text} group-hover:text-blue-600 transition-colors`}
                                        whileHover={{ x: 2 }}
                                      >
                                        {member.name}
                                      </motion.div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <motion.div
                                    className={`text-sm font-medium ${currentTheme.text}`}
                                    whileHover={{ x: 2 }}
                                  >
                                    {book.title}
                                  </motion.div>
                                  <div
                                    className={`text-sm ${currentTheme.textMuted}`}
                                  >
                                    {book.author}
                                  </div>
                                </td>
                                <td
                                  className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textMuted}`}
                                >
                                  {book.genre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <motion.span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      event.type === "borrow"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {event.type === "borrow" ? (
                                      <Clock className="w-3 h-3 mr-1" />
                                    ) : (
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                    )}
                                    {event.type === "borrow"
                                      ? "Borrowed"
                                      : "Returned"}
                                  </motion.span>
                                </td>
                                <td
                                  className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textMuted}`}
                                >
                                  {event.date.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {event.type === "borrow" ? (
                                    <motion.span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        isOverdue
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      {isOverdue ? (
                                        <>
                                          <XCircle className="w-3 h-3 mr-1" />
                                          Overdue
                                        </>
                                      ) : (
                                        <>
                                          <Calendar className="w-3 h-3 mr-1" />
                                          Due{" "}
                                          {event.dueDate?.toLocaleDateString()}
                                        </>
                                      )}
                                    </motion.span>
                                  ) : (
                                    <motion.span
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Completed
                                    </motion.span>
                                  )}
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div
                className={`flex flex-col sm:flex-row items-center justify-between pt-6 mt-6 border-t ${currentTheme.border} gap-4`}
              >
                <div className={`text-sm ${currentTheme.textMuted}`}>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, sortedEvents.length)} of{" "}
                  {sortedEvents.length} events
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    disabled={currentPage <= 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`
                      flex items-center px-3 py-2 text-sm rounded-lg border transition-colors
                      ${
                        currentPage <= 1
                          ? `${currentTheme.border} ${currentTheme.textMuted} opacity-50 cursor-not-allowed`
                          : `${currentTheme.button} ${currentTheme.border} hover:bg-opacity-80 cursor-pointer`
                      }
                    `}
                    whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
                    whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </motion.button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      if (pageNum > totalPages || pageNum < 1) return null;

                      return (
                        <motion.button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`
                            px-3 py-2 text-sm rounded-lg border transition-colors
                            ${
                              currentPage === pageNum
                                ? `${currentTheme.buttonPrimary} border-transparent cursor-pointer`
                                : `${currentTheme.button} ${currentTheme.border} cursor-pointer`
                            }
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.button
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={`
                      flex items-center px-3 py-2 text-sm rounded-lg border transition-colors
                      ${
                        currentPage >= totalPages
                          ? `${currentTheme.border} ${currentTheme.textMuted} opacity-50 cursor-not-allowed`
                          : `${currentTheme.button} ${currentTheme.border} hover:bg-opacity-80 cursor-pointer`
                      }
                    `}
                    whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
                    whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      )}

      <motion.footer
        className={`${currentTheme.headerBg} border-t ${currentTheme.border} mt-12`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <motion.div
                className={`p-2 rounded-lg ${
                  theme === "light" ? "bg-blue-100" : "bg-blue-900/30"
                }`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <BookOpen
                  className={`h-5 w-5 ${
                    theme === "light" ? "text-blue-600" : "text-blue-400"
                  }`}
                />
              </motion.div>
              <div>
                <span className={`text-sm font-medium ${currentTheme.text}`}>
                  Library Management System
                </span>
                <p className={`text-xs ${currentTheme.textMuted}`}>
                  Digital collection management
                </p>
              </div>
            </div>
            <p className={`text-xs ${currentTheme.textMuted}`}>
              © {new Date().getFullYear()} Library Dashboard. All rights
              reserved.
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

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

const App: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="relative">
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
      <LibraryDashboard />
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <main className={poppins.className}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </main>
  );
};

export default Page;
