import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import VoteButtons from "@/components/molecules/VoteButtons";
import CommentForm from "@/components/molecules/CommentForm";
import { commentService } from "@/services/api/commentService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const CommentThread = ({ 
  comment, 
  onCommentAdded, 
  onCommentVoted, 
  depth = 0 
}) => {
  const [currentComment, setCurrentComment] = useState(comment);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleVote = async (voteType) => {
    try {
      const updatedComment = await commentService.vote(currentComment.Id, voteType);
      setCurrentComment(updatedComment);
      onCommentVoted(currentComment.Id, updatedComment);
      
      if (voteType === "up" && updatedComment.userVote === "up") {
        toast.success("Comment upvoted!");
      } else if (voteType === "down" && updatedComment.userVote === "down") {
        toast.success("Comment downvoted!");
      } else {
        toast.success("Vote removed");
      }
    } catch (error) {
      toast.error("Failed to vote. Please try again.");
    }
  };

const handleReplyAdded = (newReply) => {
    // Update local state to include the new reply
    setCurrentComment(prev => ({
      ...prev,
      children: [...(prev.children || []), newReply]
    }));
    
    // Notify parent component
    onCommentAdded(newReply);
    setShowReplyForm(false);
  };

  const maxDepth = 2;
  const shouldShowReplyButton = depth < maxDepth;

  return (
    <div className={cn(
      "comment-thread",
      depth === 0 ? "depth-0" : ""
    )}>
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <div className="flex gap-3">
          {/* Vote Buttons */}
          <div className="flex-shrink-0">
            <VoteButtons 
              upvotes={currentComment.upvotes}
              downvotes={currentComment.downvotes}
              userVote={currentComment.userVote}
              onVote={handleVote}
              size="sm"
            />
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="font-semibold text-gray-900">
                u/{currentComment.authorUsername}
              </span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(currentComment.timestamp))} ago
              </span>
              {currentComment.children && currentComment.children.length > 0 && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
className="flex items-center gap-1 text-primary hover:text-indigo-600 font-medium"
                  >
                    <ApperIcon 
                      name={isCollapsed ? "Plus" : "Minus"} 
                      className="w-3 h-3" 
                    />
                    {isCollapsed ? "Expand" : "Collapse"}
                  </button>
                </>
              )}
            </div>

            {/* Content */}
            {!isCollapsed && (
              <>
                <div className="text-gray-900 mb-3">
                  {currentComment.content}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {shouldShowReplyButton && (
                    <button
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary font-medium"
                    >
                      <ApperIcon name="MessageSquare" className="w-4 h-4" />
                      Reply
                    </button>
                  )}
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary font-medium">
                    <ApperIcon name="Share" className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <CommentForm 
                      postId={currentComment.postId}
                      parentId={currentComment.Id}
                      onCommentAdded={handleReplyAdded}
                      placeholder={`Reply to u/${currentComment.authorUsername}...`}
                      compact
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Child Comments */}
      {!isCollapsed && currentComment.children && currentComment.children.length > 0 && (
        <div className="mt-3 space-y-3">
          {currentComment.children.map((childComment) => (
<CommentThread
              key={childComment.Id}
              comment={childComment}
              onCommentAdded={onCommentAdded}
              onCommentVoted={onCommentVoted}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;