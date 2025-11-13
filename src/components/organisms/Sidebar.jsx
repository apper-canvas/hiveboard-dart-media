import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import { communityService } from "@/services/api/communityService";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const loadPopularCommunities = async () => {
    try {
      const popularCommunities = await communityService.getPopular(10);
      setCommunities(popularCommunities);
    } catch (error) {
      console.error("Failed to load communities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopularCommunities();
  }, []);

  const formatMemberCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <aside className={cn("w-80 flex-shrink-0", className)}>
      <div className="sticky top-20 space-y-6">
        {/* Popular Communities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary" />
            Popular Communities
          </h3>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full skeleton-shimmer"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-1 skeleton-shimmer"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 skeleton-shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {communities.slice(0, 8).map((community, index) => (
                <Link
                  key={community.name}
                  to={`/r/${community.name}`}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors",
                    location.pathname === `/r/${community.name}` && "bg-primary bg-opacity-10 text-primary"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      r/{community.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatMemberCount(community.memberCount)} members
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Zap" className="w-5 h-5 text-accent" />
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <Link
              to="/create"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                <ApperIcon name="Plus" className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium group-hover:text-primary transition-colors">
                Create Post
              </span>
            </Link>
            
            <Link
              to="/communities"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-blue-600 flex items-center justify-center">
                <ApperIcon name="Search" className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium group-hover:text-primary transition-colors">
                Browse Communities
              </span>
            </Link>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="bg-gradient-to-br from-primary to-orange-500 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ApperIcon name="BarChart" className="w-5 h-5" />
            HiveBoard Today
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-orange-100">Active Users</span>
              <span className="font-bold">24.7k</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-orange-100">New Posts</span>
              <span className="font-bold">1,284</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-orange-100">New Comments</span>
              <span className="font-bold">8,926</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-orange-100">Communities</span>
              <span className="font-bold">50k+</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;