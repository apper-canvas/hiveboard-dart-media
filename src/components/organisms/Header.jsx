import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ className }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 group"
            >
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <ApperIcon name="Hexagon" className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black gradient-text hidden sm:block">
                HiveBoard
              </span>
            </button>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ApperIcon name="Search" className="w-5 h-5 text-gray-600" />
            </button>

            {/* Create Post */}
            <Button 
              onClick={handleCreatePost}
              size="sm"
              className="hidden sm:flex"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              Create Post
            </Button>

            {/* Mobile Create Post */}
            <button 
              onClick={handleCreatePost}
className="sm:hidden p-2 rounded-lg bg-gradient-to-r from-primary to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-all"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-blue-600 flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-600 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-semibold text-gray-900">current_user</div>
                    <div className="text-xs text-gray-500">1,337 karma</div>
                  </div>
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <ApperIcon name="User" className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link 
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <ApperIcon name="Settings" className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 mt-1">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <ApperIcon name="LogOut" className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Create Post Modal Placeholder */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create Post</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="FileText" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Create post functionality will be implemented in PostCreator component</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;