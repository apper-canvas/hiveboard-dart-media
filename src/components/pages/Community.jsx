import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import PostFeed from "@/components/organisms/PostFeed";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { communityService } from "@/services/api/communityService";

const Community = () => {
  const { communityName } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const loadCommunity = async () => {
    try {
      setLoading(true);
      setError("");
      const communityData = await communityService.getById(communityName);
      setCommunity(communityData);
      // In a real app, check if user is subscribed
      setIsJoined(false);
    } catch (err) {
      setError(err.message || "Failed to load community");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityName) {
      loadCommunity();
    }
  }, [communityName]);

  const handleJoinToggle = () => {
    setIsJoined(!isJoined);
    // In a real app, this would call an API
  };

  const handleRetry = () => {
    loadCommunity();
  };

  const formatMemberCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  if (!community) {
    return (
      <ErrorView
        message="Community not found"
        showRetry={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary to-orange-500"></div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Community Avatar */}
              <div className="w-20 h-20 -mt-10 rounded-full bg-gradient-to-br from-primary to-orange-500 border-4 border-white flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {community.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  r/{community.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Users" className="w-4 h-4" />
                    <span>{formatMemberCount(community.memberCount)} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="FileText" className="w-4 h-4" />
                    <span>{community.postCount.toLocaleString()} posts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    <span>
                      Created {formatDistanceToNow(new Date(community.createdAt))} ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleJoinToggle}
                variant={isJoined ? "secondary" : "primary"}
                className="min-w-[100px]"
              >
                {isJoined ? "Joined" : "Join"}
              </Button>
              <Button variant="ghost">
                <ApperIcon name="Bell" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Description */}
          {community.description && (
            <p className="mt-4 text-gray-700 text-lg">
              {community.description}
            </p>
          )}
        </div>
      </div>

      {/* Posts Feed */}
      <PostFeed communityName={communityName} />
    </div>
  );
};

export default Community;