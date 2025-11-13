import { cn } from "@/utils/cn";

const FilterTabs = ({ 
  activeFilter = "hot", 
  onFilterChange, 
  className 
}) => {
  const filters = [
    { key: "hot", label: "Hot", icon: "🔥" },
    { key: "new", label: "New", icon: "✨" },
    { key: "top", label: "Top", icon: "📈" },
    { key: "rising", label: "Rising", icon: "🚀" }
  ];

  return (
    <div className={cn("flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-100", className)}>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={cn(
            "filter-tab flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200",
            activeFilter === filter.key
              ? "bg-gradient-to-r from-primary to-orange-500 text-white shadow-md active"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <span className="text-base">{filter.icon}</span>
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;