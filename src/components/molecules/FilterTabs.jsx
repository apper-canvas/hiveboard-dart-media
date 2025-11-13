import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterTabs = ({ 
  activeFilter = "hot", 
  postType = "all",
  onFilterChange, 
  onTypeChange,
  className 
}) => {
  const [activeTab, setActiveTab] = useState("sort");
const sortOptions = [
    { key: "hot", label: "Hot", icon: "🔥" },
    { key: "new", label: "New", icon: "✨" },
    { key: "topAllTime", label: "Top All Time", icon: "👑" },
    { key: "topWeek", label: "Top This Week", icon: "📈" },
    { key: "controversial", label: "Controversial", icon: "⚡" },
    { key: "rising", label: "Rising", icon: "🚀" }
  ];

  const typeOptions = [
    { key: "all", label: "All", icon: "📋" },
    { key: "images", label: "Images", icon: "🖼️" },
    { key: "videos", label: "Videos", icon: "🎥" },
    { key: "discussions", label: "Discussions", icon: "💬" },
    { key: "links", label: "Links", icon: "🔗" }
  ];

  return (
<div className={cn("bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden backdrop-blur-sm", className)}>
      {/* Modern Tab Headers */}
      <div className="flex bg-gradient-to-r from-gray-50 to-gray-100/80 p-1 gap-1">
        <button
          onClick={() => setActiveTab("sort")}
          className={cn(
            "flex-1 px-4 py-2.5 font-semibold text-sm rounded-xl transition-all duration-300 ease-in-out transform",
            "flex items-center justify-center gap-2",
            activeTab === "sort"
              ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md scale-[1.02] translate-y-[-1px]"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-sm"
          )}
        >
          <ApperIcon name="ArrowUpDown" className="w-4 h-4" />
          Sort By
        </button>
        <button
          onClick={() => setActiveTab("filter")}
          className={cn(
            "flex-1 px-4 py-2.5 font-semibold text-sm rounded-xl transition-all duration-300 ease-in-out transform",
            "flex items-center justify-center gap-2",
            activeTab === "filter"
              ? "bg-gradient-to-r from-secondary to-blue-600 text-white shadow-md scale-[1.02] translate-y-[-1px]"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-sm"
          )}
        >
          <ApperIcon name="Filter" className="w-4 h-4" />
          Filter By Type
        </button>
      </div>

{/* Animated Tab Content */}
      <div className="p-3 min-h-[120px]">
        <div className="relative">
          {activeTab === "sort" ? (
            <div 
              key="sort-content"
              className="animate-in fade-in-50 slide-in-from-left-2 duration-300 grid grid-cols-2 gap-2"
            >
              {sortOptions.map((option, index) => (
                <button
                  key={option.key}
                  onClick={() => onFilterChange(option.key)}
                  style={{animationDelay: `${index * 50}ms`}}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 group",
                    "animate-in fade-in-0 slide-in-from-bottom-2",
                    activeFilter === option.key
                      ? "bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-white shadow-lg scale-105 transform"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border border-gray-200/60 hover:border-gray-300 hover:shadow-md hover:scale-102 transform"
                  )}
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div 
              key="filter-content"
              className="animate-in fade-in-50 slide-in-from-right-2 duration-300 grid grid-cols-2 gap-2"
            >
              {typeOptions.map((option, index) => (
                <button
                  key={option.key}
                  onClick={() => onTypeChange(option.key)}
                  style={{animationDelay: `${index * 50}ms`}}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 group",
                    "animate-in fade-in-0 slide-in-from-bottom-2",
                    postType === option.key
                      ? "bg-gradient-to-r from-secondary via-blue-500 to-cyan-500 text-white shadow-lg scale-105 transform"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border border-gray-200/60 hover:border-gray-300 hover:shadow-md hover:scale-102 transform"
                  )}
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;