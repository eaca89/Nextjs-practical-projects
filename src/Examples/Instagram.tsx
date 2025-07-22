"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  Plus,
  Camera,
  Send,
  MoreHorizontal,
  Home,
  Compass,
  PlusSquare,
  UserCircle,
  Bookmark,
  X,
  MapPin,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
}

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  tags: string[];
  location?: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "pawsome_photographer",
    displayName: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    bio: "Professional pet photographer 📸 Capturing precious moments with your furry friends 🐾",
    followers: 12500,
    following: 543,
    posts: 289,
  },
  {
    id: "2",
    username: "golden_retriever_mom",
    displayName: "Emma Davis",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    bio: "Golden retriever mom of 3 🐕 Sharing the joy and chaos of life with my pack!",
    followers: 8750,
    following: 321,
    posts: 156,
  },
  {
    id: "3",
    username: "cat_cafe_chronicles",
    displayName: "Alex Chen",
    avatar:
      "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    bio: "Cat cafe owner ☕ Home to 12 rescue cats 🐱 Adoption stories and daily adventures",
    followers: 15200,
    following: 432,
    posts: 847,
  },
];

const mockPosts: Post[] = [
  {
    id: "1",
    userId: "1",
    username: "pawsome_photographer",
    userAvatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    image:
      "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
    caption:
      "Golden hour with this beautiful golden retriever! The lighting was absolutely perfect for this shot. There's nothing quite like capturing the bond between pets and their families. 🌅✨",
    likes: 324,
    comments: [
      {
        id: "1",
        userId: "2",
        username: "golden_retriever_mom",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        content: "Absolutely stunning! The lighting is incredible 😍",
        timestamp: new Date("2024-01-15T10:30:00"),
      },
      {
        id: "2",
        userId: "3",
        username: "cat_cafe_chronicles",
        avatar:
          "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        content: "Professional quality! Love the composition 📸",
        timestamp: new Date("2024-01-15T11:15:00"),
      },
    ],
    timestamp: new Date("2024-01-15T09:00:00"),
    tags: ["goldenretriever", "photography", "goldenhour", "pets"],
    location: "Central Park, NY",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    userId: "2",
    username: "golden_retriever_mom",
    userAvatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    image:
      "https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
    caption:
      "Beach day with my three golden angels! They absolutely love splashing around in the waves. Sandy paws and salty kisses - perfect day! 🏖️🐕",
    likes: 189,
    comments: [
      {
        id: "3",
        userId: "1",
        username: "pawsome_photographer",
        avatar:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        content: "They look so happy! Great action shot 🌊",
        timestamp: new Date("2024-01-14T14:20:00"),
      },
    ],
    timestamp: new Date("2024-01-14T13:45:00"),
    tags: ["beach", "goldenretriever", "family", "ocean"],
    location: "Malibu Beach, CA",
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "3",
    userId: "3",
    username: "cat_cafe_chronicles",
    userAvatar:
      "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    image:
      "https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
    caption:
      "Meet Luna, our newest rescue! She was so shy when she first arrived, but look at her now - total queen of the cafe! 👑 She's looking for her forever home 💕",
    likes: 267,
    comments: [
      {
        id: "4",
        userId: "2",
        username: "golden_retriever_mom",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        content: "She's gorgeous! Hope she finds her family soon 🥺",
        timestamp: new Date("2024-01-13T16:45:00"),
      },
      {
        id: "5",
        userId: "1",
        username: "pawsome_photographer",
        avatar:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        content: "Those eyes! She's absolutely beautiful ✨",
        timestamp: new Date("2024-01-13T17:20:00"),
      },
    ],
    timestamp: new Date("2024-01-13T15:30:00"),
    tags: ["rescue", "cat", "adoption", "cafe"],
    location: "Whiskers & Coffee, Seattle",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "4",
    userId: "1",
    username: "pawsome_photographer",
    userAvatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    image:
      "https://images.pexels.com/photos/1954515/pexels-photo-1954515.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
    caption:
      "This little French Bulldog puppy just melted my heart during today's photoshoot! Those wrinkles and that expression - pure perfection! 🥰",
    likes: 445,
    comments: [],
    timestamp: new Date("2024-01-12T11:20:00"),
    tags: ["frenchbulldog", "puppy", "studio", "photography"],
    isLiked: true,
    isBookmarked: false,
  },
];

// Custom Button Component
const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-700",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Input Component
const Input = ({
  className = "",
  placeholder = "",
  value,
  onChange,
  ...props
}: {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}) => {
  return (
    <input
      className={`
       w-full px-3 py-2
       bg-white text-slate-900 placeholder-slate-400
       border border-gray-300 rounded-lg
       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
       transition-all duration-200

       dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:border-slate-600
       ${className}
      `}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

// Custom Textarea Component
const Textarea = ({
  className = "",
  placeholder = "",
  value,
  onChange,
  ...props
}: {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  [key: string]: any;
}) => {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

// Custom Avatar Component
const Avatar = ({
  src,
  alt = "",
  size = "md",
  className = "",
  isDarkMode = false,
}: {
  src: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  isDarkMode?: boolean;
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${
        sizes[size]
      } rounded-full object-cover transition-colors duration-200 ${
        isDarkMode ? "ring-2 ring-slate-600" : "ring-2 ring-gray-200"
      } ${className}`}
    />
  );
};

// Custom Badge Component
const Badge = ({
  children,
  className = "",
  variant = "default",
  isDarkMode = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary";
  isDarkMode?: boolean;
}) => {
  const variants = {
    default: isDarkMode
      ? "bg-blue-900/50 text-blue-300 border border-blue-700/50"
      : "bg-blue-100 text-blue-800",
    secondary: isDarkMode
      ? "bg-slate-700 text-slate-300 border border-slate-600"
      : "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Custom Modal Component
const Modal = ({
  isOpen,
  onClose,
  children,
  className = "",
  isDarkMode = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-white/20 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto ${className}`}
      >
        <button
          onClick={onClose}
          className={`cursor-pointer absolute top-4 right-4 z-10 p-2 rounded-full shadow-lg transition-colors ${
            isDarkMode
              ? "bg-slate-700 hover:bg-slate-600 text-white"
              : "bg-white text-slate-900 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </motion.div>
    </div>
  );
};

export default function PetCommunity() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [activeUser] = useState<User>(mockUsers[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostModal, setNewPostModal] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [isDragOver, setIsDragOver] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect location when modal opens
  useEffect(() => {
    if (newPostModal) {
      detectUserLocation();
    } else {
      setUserLocation("");
    }
  }, [newPostModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        !(event.target as Element).closest(".dropdown-container")
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isBookmarked: !post.isBookmarked,
            }
          : post
      )
    );
  };

  const handleReport = (postId: string) => {
    toast.success("Post reported successfully!");
    setOpenDropdown(null);
  };

  const toggleDropdown = (postId: string) => {
    setOpenDropdown(openDropdown === postId ? null : postId);
  };

  const handleHashtagClick = (hashtag: string) => {
    setSearchQuery(`${hashtag}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      userId: activeUser.id,
      username: activeUser.username,
      avatar: activeUser.avatar,
      content: newComment,
      timestamp: new Date(),
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newCommentObj] }
          : post
      )
    );
    setNewComment("");
  };

  const getLocationName = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      // Use a simple, free geocoding service that doesn't require API keys
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.city && data.countryName) {
          return `${data.city}, ${data.countryName}`;
        } else if (data.locality && data.countryName) {
          return `${data.locality}, ${data.countryName}`;
        } else if (data.city) {
          return data.city;
        } else if (data.countryName) {
          return data.countryName;
        }
      }

      // If the service fails, return coordinates
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.log("Error getting location name:", error);
      // Fallback to coordinates
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const detectUserLocation = async () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        }
      );

      const { latitude, longitude } = position.coords;
      const locationName = await getLocationName(latitude, longitude);
      setUserLocation(locationName);
    } catch (error) {
      // Handle different types of geolocation errors gracefully
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("Location access denied by user");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Location information unavailable");
            break;
          case error.TIMEOUT:
            console.log("Location request timed out");
            break;
          default:
            console.log("Unknown location error occurred");
            break;
        }
      } else {
        console.log("Error getting location:", error);
      }
      // Don't set any location if there's an error
      setUserLocation("");
    }
  };

  const handleCreatePost = () => {
    if (!selectedImage || !newPostCaption.trim()) return;

    // Extract hashtags and remove them from the caption
    const hashtags =
      newPostCaption.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [];
    const captionText = newPostCaption.replace(/#\w+/g, "").trim();

    const newPost: Post = {
      id: Date.now().toString(),
      userId: activeUser.id,
      username: activeUser.username,
      userAvatar: activeUser.avatar,
      image: selectedImage,
      caption: captionText,
      likes: 0,
      comments: [],
      timestamp: new Date(),
      tags: hashtags,
      location: userLocation,
      isLiked: false,
      isBookmarked: false,
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setNewPostModal(false);
    setNewPostCaption("");
    setSelectedImage("");
    setUserLocation("");

    // Scroll to top after creating post
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleImageSelect = () => {
    // For demo purposes, use a random pet image
    const demoImages = [
      "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      "https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      "https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      "https://images.pexels.com/photos/1954515/pexels-photo-1954515.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
    ];
    const randomImage =
      demoImages[Math.floor(Math.random() * demoImages.length)];
    setSelectedImage(randomImage);
  };

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this adorable pet photo by @${post.username}`,
        text: post.caption,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard!");
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 to-slate-800"
          : "bg-gradient-to-br from-slate-50 to-blue-50"
      }`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      {/* Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-sm border-b shadow-[0_2px_8px_0_rgba(0,0,0,0.08),0_1px_4px_0_rgba(0,0,0,0.04)] transition-colors duration-300 ${
          isDarkMode
            ? "bg-slate-900/95 border-slate-700"
            : "bg-white/95 border-slate-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left aligned */}
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PawShare
              </h1>
            </div>

            {/* Search - Center (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    isDarkMode ? "text-slate-400" : "text-slate-400"
                  }`}
                />
                <Input
                  placeholder="Search posts, users, or tags..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`pl-10 transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-700"
                      : "bg-slate-50 border-slate-200 focus:bg-white"
                  }`}
                />
              </div>
            </div>

            {/* Avatar and New Post Button - Right aligned */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setNewPostModal(true)}
                className="cursor-pointer hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-slate-700 text-yellow-400 hover:bg-slate-600"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.button>

              <Avatar
                src={activeUser.avatar}
                alt={activeUser.displayName}
                className="transition-all"
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? "text-slate-400" : "text-slate-400"
              }`}
            />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 transition-colors duration-300 ${
                isDarkMode
                  ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                  : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      isDarkMode
                        ? "bg-slate-800/80 backdrop-blur-sm"
                        : "bg-white/80 backdrop-blur-sm"
                    }`}
                  >
                    {/* Post Header */}
                    <div className="p-6 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            src={post.userAvatar}
                            alt={post.username}
                            isDarkMode={isDarkMode}
                          />
                          <div>
                            <p
                              className={`font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {post.username}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                              <Clock className="w-3 h-3 hidden sm:block" />
                              <span className="hidden sm:inline">
                                {formatTimeAgo(post.timestamp)}
                              </span>
                              {post.location && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <MapPin className="w-3 h-3" />
                                  <span>{post.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="relative dropdown-container">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDropdown(post.id)}
                            className={`p-2 transition-colors ${
                              isDarkMode
                                ? "hover:bg-slate-700 text-slate-300 hover:text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                          {openDropdown === post.id && (
                            <div
                              className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border py-1 z-10 ${
                                isDarkMode
                                  ? "bg-slate-800 border-slate-700"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              <button
                                onClick={() => handleReport(post.id)}
                                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                                  isDarkMode
                                    ? "text-red-400 hover:bg-slate-700"
                                    : "text-red-600 hover:bg-red-50"
                                }`}
                              >
                                Report Post
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Post Image */}
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <img
                        src={post.image}
                        alt="Pet photo"
                        className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>

                    {/* Post Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`cursor-pointer p-2 rounded-full transition-all duration-200 ${
                              post.isLiked
                                ? "text-red-500"
                                : "text-slate-600  hover:text-red-500"
                            }`}
                            onClick={() => handleLike(post.id)}
                          >
                            <Heart
                              className={`h-6 w-6 ${
                                post.isLiked ? "fill-current" : ""
                              }`}
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="cursor-pointer p-2 rounded-full text-slate-600 hover:text-blue-600 transition-all duration-200"
                            onClick={() => setSelectedPost(post)}
                          >
                            <MessageCircle className="h-6 w-6" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="cursor-pointer p-2 rounded-full text-slate-600 hover:text-green-600 transition-all duration-200"
                            onClick={() => handleShare(post)}
                          >
                            <Share2 className="h-6 w-6" />
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`cursor-pointer p-2 rounded-full transition-all duration-200 ${
                            post.isBookmarked
                              ? "text-amber-500"
                              : "text-slate-600 hover:text-amber-600"
                          }`}
                          onClick={() => handleBookmark(post.id)}
                        >
                          <Bookmark
                            className={`h-6 w-6 ${
                              post.isBookmarked ? "fill-current" : ""
                            }`}
                          />
                        </motion.button>
                      </div>

                      <div className="space-y-3">
                        <p
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {post.likes.toLocaleString()} likes
                        </p>

                        <div>
                          <span
                            className={`font-semibold mr-2 ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {post.username}
                          </span>
                          <span
                            className={
                              isDarkMode ? "text-slate-300" : "text-slate-700"
                            }
                          >
                            {post.caption}
                          </span>
                        </div>

                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                              <div
                                key={index}
                                onClick={() => handleHashtagClick(tag)}
                                className="cursor-pointer"
                              >
                                <Badge
                                  className={`hover:bg-blue-200 transition-colors ${
                                    isDarkMode
                                      ? "hover:bg-blue-800/70 hover:text-blue-200"
                                      : "hover:bg-blue-200"
                                  }`}
                                  isDarkMode={isDarkMode}
                                >
                                  #{tag}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}

                        {post.comments.length > 0 && (
                          <div className="space-y-2">
                            {post.comments.length > 2 && (
                              <button
                                className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                                onClick={() => setSelectedPost(post)}
                              >
                                View all {post.comments.length} comments
                              </button>
                            )}

                            {post.comments.slice(-2).map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-start space-x-2"
                              >
                                <Avatar
                                  src={comment.avatar}
                                  alt={comment.username}
                                  size="sm"
                                  isDarkMode={isDarkMode}
                                />
                                <div className="flex-1 min-w-0">
                                  <span
                                    className={`font-semibold text-sm mr-2 ${
                                      isDarkMode
                                        ? "text-white"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {comment.username}
                                  </span>
                                  <span
                                    className={`text-sm ${
                                      isDarkMode
                                        ? "text-slate-300"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {comment.content}
                                  </span>
                                  <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                                    {formatTimeAgo(comment.timestamp)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div
                          className={`border-t pt-4 mt-4 ${
                            isDarkMode ? "border-slate-700" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar
                              src={activeUser.avatar}
                              alt={activeUser.displayName}
                              size="sm"
                              isDarkMode={isDarkMode}
                            />
                            <div className="flex-1 flex items-center space-x-2">
                              <Input
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className={`transition-colors duration-300 ${
                                  isDarkMode
                                    ? "bg-slate-700 border-0 text-white placeholder-slate-400 focus:bg-slate-600"
                                    : "bg-slate-50 border-0 focus:bg-white"
                                }`}
                                onKeyPress={(
                                  e: React.KeyboardEvent<HTMLInputElement>
                                ) => {
                                  if (e.key === "Enter") {
                                    handleComment(post.id);
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleComment(post.id)}
                                disabled={!newComment.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <Camera
                  className={`h-12 w-12 mx-auto mb-4 ${
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  No posts found
                </h3>
                <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                  Try adjusting your search terms or check back later for new
                  content.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* About Card */}
              <div
                className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-slate-800/80 backdrop-blur-sm"
                    : "bg-white/80 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Camera className="h-6 w-6 text-blue-600" />
                  <h2
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    About PawShare
                  </h2>
                </div>

                <div
                  className={`space-y-4 text-sm ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  <p>
                    PawShare is a vibrant community for pet lovers to share
                    their adorable moments, connect with fellow animal
                    enthusiasts, and discover heartwarming stories from around
                    the world.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Share your pet's precious moments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span>Connect with fellow pet lovers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span>Discover pets from around the world</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-purple-500" />
                      <span>Capture and share beautiful memories</span>
                    </div>
                  </div>

                  <div
                    className={`pt-4 border-t ${
                      isDarkMode ? "border-slate-700" : "border-slate-200"
                    }`}
                  >
                    <Button
                      className="w-full"
                      variant="primary"
                      onClick={() => setNewPostModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Share Your Pet
                    </Button>
                  </div>
                </div>
              </div>

              {/* Community Stats */}
              <div
                className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-slate-800/80 backdrop-blur-sm"
                    : "bg-white/80 backdrop-blur-sm"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Community Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span
                      className={
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }
                    >
                      Total Posts
                    </span>
                    <span
                      className={isDarkMode ? "text-white" : "text-slate-900"}
                    >
                      {posts.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }
                    >
                      Active Users
                    </span>
                    <span
                      className={isDarkMode ? "text-white" : "text-slate-900"}
                    >
                      {mockUsers.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }
                    >
                      Total Likes
                    </span>
                    <span
                      className={isDarkMode ? "text-white" : "text-slate-900"}
                    >
                      {posts
                        .reduce((sum, post) => sum + post.likes, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <Modal
        isOpen={newPostModal}
        onClose={() => setNewPostModal(false)}
        className="w-full max-w-md"
        isDarkMode={isDarkMode}
      >
        <div
          className={`p-6 transition-colors duration-300 ${
            isDarkMode ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="flex items-center space-x-2 mb-6">
            <Camera className="h-5 w-5 text-blue-600" />
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Create New Post
            </h2>
          </div>

          <div className="space-y-4">
            {selectedImage ? (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected pet photo"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage("")}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : isDarkMode
                    ? "border-slate-600 hover:border-blue-400 bg-slate-700"
                    : "border-slate-300 hover:border-blue-400"
                }`}
                onClick={() => document.getElementById("file-input")?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Camera
                  className={`h-12 w-12 mx-auto mb-2 ${
                    isDarkMode ? "text-slate-400" : "text-slate-400"
                  }`}
                />
                <p className={isDarkMode ? "text-slate-300" : "text-slate-600"}>
                  {isDragOver
                    ? "Drop your image here"
                    : "Click to upload photo"}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  or drag and drop
                </p>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            )}

            <Textarea
              placeholder="Write a caption for your post..."
              value={newPostCaption}
              onChange={(e) => setNewPostCaption(e.target.value)}
              className={`min-h-[100px] transition-colors duration-300 ${
                isDarkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : ""
              }`}
            />

            {userLocation && (
              <div
                className={`flex items-center space-x-2 text-sm p-3 rounded-lg ${
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Location: {userLocation}</span>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleCreatePost}
              disabled={!selectedImage || !newPostCaption.trim()}
            >
              Share Post
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post Detail Modal */}
      {selectedPost && (
        <Modal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          className="w-full max-w-4xl"
          isDarkMode={isDarkMode}
        >
          <div
            className={`flex flex-col md:grid md:grid-cols-2 h-[80vh] max-h-[80vh] ${
              isDarkMode ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div className="relative h-1/2 md:h-full">
              <img
                src={selectedPost.image}
                alt="Pet photo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col h-1/2 md:h-full overflow-y-auto">
              <div
                className={`p-4 border-b flex-shrink-0 ${
                  isDarkMode ? "border-slate-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={selectedPost.userAvatar}
                    alt={selectedPost.username}
                    isDarkMode={isDarkMode}
                  />
                  <div>
                    <p
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {selectedPost.username}
                    </p>
                    <p className="text-sm text-slate-500">
                      {selectedPost.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                <div>
                  <span
                    className={`font-semibold mr-2 ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {selectedPost.username}
                  </span>
                  <span
                    className={isDarkMode ? "text-slate-300" : "text-slate-700"}
                  >
                    {selectedPost.caption}
                  </span>
                </div>

                {selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <div
                        key={index}
                        onClick={() => handleHashtagClick(tag)}
                        className="cursor-pointer"
                      >
                        <Badge
                          className={`hover:bg-blue-200 transition-colors ${
                            isDarkMode
                              ? "hover:bg-blue-800/70 hover:text-blue-200"
                              : "hover:bg-blue-200"
                          }`}
                          isDarkMode={isDarkMode}
                        >
                          #{tag}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {posts
                  .find((p) => p.id === selectedPost.id)
                  ?.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-3"
                    >
                      <Avatar
                        src={comment.avatar}
                        alt={comment.username}
                        size="sm"
                        isDarkMode={isDarkMode}
                      />
                      <div className="flex-1">
                        <span
                          className={`font-semibold text-sm mr-2 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {comment.username}
                        </span>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {comment.content}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                          {formatTimeAgo(comment.timestamp)}
                        </p>
                      </div>
                    </div>
                  )) ||
                  selectedPost.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-3"
                    >
                      <Avatar
                        src={comment.avatar}
                        alt={comment.username}
                        size="sm"
                        isDarkMode={isDarkMode}
                      />
                      <div className="flex-1">
                        <span
                          className={`font-semibold text-sm mr-2 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {comment.username}
                        </span>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {comment.content}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                          {formatTimeAgo(comment.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div
                className={`p-4 border-t space-y-3 flex-shrink-0 ${
                  isDarkMode ? "border-slate-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-1 transition-colors ${
                        posts.find((p) => p.id === selectedPost.id)?.isLiked
                          ? "text-red-500"
                          : "text-slate-600"
                      }`}
                      onClick={() => handleLike(selectedPost.id)}
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          posts.find((p) => p.id === selectedPost.id)?.isLiked
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-slate-600"
                      onClick={() => handleShare(selectedPost)}
                    >
                      <Share2 className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-1 transition-colors ${
                        posts.find((p) => p.id === selectedPost.id)
                          ?.isBookmarked
                          ? "text-amber-500"
                          : "text-slate-600"
                      }`}
                      onClick={() => handleBookmark(selectedPost.id)}
                    >
                      <Bookmark
                        className={`h-6 w-6 ${
                          posts.find((p) => p.id === selectedPost.id)
                            ?.isBookmarked
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    </motion.button>
                  </div>
                </div>

                <p
                  className={`font-semibold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {posts
                    .find((p) => p.id === selectedPost.id)
                    ?.likes.toLocaleString() ||
                    selectedPost.likes.toLocaleString()}{" "}
                  likes
                </p>

                <div className="flex items-center space-x-2">
                  <Avatar
                    src={activeUser.avatar}
                    alt={activeUser.displayName}
                    size="sm"
                    isDarkMode={isDarkMode}
                  />
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className={`flex-1 transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : ""
                    }`}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        handleComment(selectedPost.id);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleComment(selectedPost.id)}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Mobile Floating Action Button */}
      <div className="sm:hidden fixed bottom-6 right-6 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setNewPostModal(true)}
          className={`p-4 rounded-full shadow-lg transition-all duration-200 ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          }`}
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </div>
    </div>
  );
}
