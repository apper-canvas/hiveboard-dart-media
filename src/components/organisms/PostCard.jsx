import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow, isValid } from "date-fns";
import { postService } from "@/services/api/postService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import VoteButtons from "@/components/molecules/VoteButtons";

const PostCard = ({ post, className, onPostUpdate }) => {
const [currentPost, setCurrentPost] = useState(post);
  const [isSaved, setIsSaved] = useState(postService.isPostSaved(post.Id));
  const [isHidden, setIsHidden] = useState(false);
  const navigate = useNavigate();

const handleVote = async (voteType) => {
    try {
      const updatedPost = await postService.vote(currentPost.Id, voteType);
      setCurrentPost(updatedPost);
      
      if (voteType === "up" && updatedPost.userVote === "up") {
        toast.success("Upvoted!");
      } else if (voteType === "down" && updatedPost.userVote === "down") {
        toast.success("Downvoted!");
      } else {
        toast.success("Vote removed");
      }
    } catch (error) {
      toast.error("Failed to vote. Please try again.");
    }
  };

  const handleLike = async () => {
    try {
      const updatedPost = await postService.like(currentPost.Id);
      setCurrentPost(updatedPost);
      
      if (updatedPost.isLiked) {
        toast.success("Post liked!");
      } else {
        toast.success("Like removed");
      }
    } catch (error) {
      toast.error("Failed to like post. Please try again.");
    }
};
  
  const handleSave = async () => {
    try {
      if (isSaved) {
        await postService.unsavePost(currentPost.Id);
        setIsSaved(false);
        toast.success("Post removed from saved");
      } else {
        await postService.savePost(currentPost.Id);
        setIsSaved(true);
        toast.success("Post saved successfully");
      }
    } catch (error) {
      toast.error("Failed to update save status");
    }
  };
  
  const handleHide = async () => {
    try {
      await postService.hidePost(currentPost.Id);
      setIsHidden(true);
toast.success("Post hidden from feed");
      // Trigger parent to refresh feed if needed
      if (onPostUpdate) {
        onPostUpdate();
      }
    } catch (error) {
      toast.error("Failed to hide post");
    }
  };

  const handlePostClick = (e) => {
    // Don't navigate if clicking on vote buttons or community links
    if (e.target.closest(".vote-buttons") || e.target.closest(".community-link")) {
      return;
    }
    navigate(`/post/${currentPost.Id}`);
  };

  const getContentTypeIcon = () => {
    switch (currentPost.contentType) {
      case "image":
        return "Image";
      case "link":
        return "Link";
      default:
        return "FileText";
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-100 card-hover cursor-pointer",
      className
    )}>
      <div className="flex gap-4 p-4" onClick={handlePostClick}>
        {/* Vote Buttons */}
        <div 
          className="vote-buttons flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
<div className="flex gap-4">
            <VoteButtons 
              upvotes={currentPost.upvotes}
              downvotes={currentPost.downvotes}
              userVote={currentPost.userVote}
              onVote={handleVote}
            />
            <VoteButtons 
              mode="like"
              likes={currentPost.likes || 0}
              isLiked={currentPost.isLiked || false}
              onLike={handleLike}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link 
              to={`/r/${currentPost.communityName}`}
              className="community-link font-semibold text-gray-900 hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              r/{currentPost.communityName}
            </Link>
            <span>•</span>
            <span>u/{currentPost.authorUsername}</span>
<span>•</span>
            <span>{currentPost?.timestamp && isValid(new Date(currentPost.timestamp)) 
              ? `${formatDistanceToNow(new Date(currentPost.timestamp))} ago`
              : 'Date unavailable'}</span>
            <ApperIcon 
              name="MoreHorizontal"
              className="w-4 h-4 text-gray-400 ml-auto" 
            />
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-primary transition-colors">
            {currentPost.title}
          </h2>

          {/* Content Preview */}
          {currentPost.content && (
            <p className="text-gray-700 mb-3 line-clamp-3">
              {currentPost.content.length > 200 
                ? `${currentPost.content.substring(0, 200)}...` 
                : currentPost.content}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="MessageSquare" className="w-4 h-4" />
              <span>{currentPost.commentCount} comments</span>
            </div>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <ApperIcon name="Share" className="w-4 h-4" />
              <span>Share</span>
</button>
            <button 
              onClick={handleSave}
              className={`flex items-center gap-1 transition-colors ${isSaved ? 'text-primary' : 'hover:text-primary'}`}
            >
              <ApperIcon name={isSaved ? "BookmarkCheck" : "Bookmark"} className="w-4 h-4" />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
            <button 
              onClick={handleHide}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ApperIcon name="EyeOff" className="w-4 h-4" />
              <span>Hide</span>
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        {currentPost.thumbnailUrl && (
          <div className="flex-shrink-0">
            <img 
              src={currentPost.thumbnailUrl} 
              alt={currentPost.title}
              className="w-20 h-20 rounded-lg object-cover bg-gray-200"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;