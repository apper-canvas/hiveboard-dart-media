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
<div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("sort")}
          className={cn(
            "flex-1 px-6 py-3 font-medium text-sm transition-all duration-200",
            activeTab === "sort"
              ? "bg-primary text-white"
              : "text-gray-600 hover:text-primary hover:bg-gray-50"
          )}
        >
          <ApperIcon name="ArrowUpDown" className="w-4 h-4 inline mr-2" />
          Sort By
        </button>
        <button
          onClick={() => setActiveTab("filter")}
          className={cn(
            "flex-1 px-6 py-3 font-medium text-sm transition-all duration-200",
            activeTab === "filter"
              ? "bg-primary text-white"
              : "text-gray-600 hover:text-primary hover:bg-gray-50"
          )}
        >
          <ApperIcon name="Filter" className="w-4 h-4 inline mr-2" />
          Filter By Type
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "sort" ? (
          <div className="grid grid-cols-2 gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => onFilterChange(option.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200",
                  activeFilter === option.key
                    ? "bg-gradient-to-r from-primary to-orange-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                )}
              >
                <span className="text-base">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {typeOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => onTypeChange(option.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200",
                  postType === option.key
                    ? "bg-gradient-to-r from-secondary to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                )}
              >
                <span className="text-base">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterTabs;