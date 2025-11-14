import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import VoteButtons from "@/components/molecules/VoteButtons";
import CommentSection from "@/components/organisms/CommentSection";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { postService } from "@/services/api/postService";
import { toast } from "react-toastify";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentCount, setCommentCount] = useState(0);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError("");
      const postData = await postService.getById(postId);
      setPost(postData);
    } catch (err) {
      setError(err.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const handleVote = async (voteType) => {
    if (!post) return;
    
    try {
      const updatedPost = await postService.vote(post.Id, voteType);
      setPost(updatedPost);
      
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

  const handleRetry = () => {
    loadPost();
  };

  if (loading) {
    return <Loading variant="post" />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  if (!post) {
    return (
      <ErrorView
        message="Post not found"
        showRetry={false}
      />
    );
  }

  const getContentTypeIcon = () => {
    switch (post.contentType) {
      case "image":
        return "Image";
      case "link":
        return "Link";
      default:
        return "FileText";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Post Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex gap-6 p-6">
          {/* Vote Buttons */}
          <div className="flex-shrink-0">
            <VoteButtons 
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              userVote={post.userVote}
              onVote={handleVote}
              size="lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Metadata */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link 
                to={`/r/${post.communityName}`}
                className="font-semibold text-gray-900 hover:text-primary transition-colors"
              >
                r/{post.communityName}
              </Link>
              <span>•</span>
              <span>Posted by u/{post.authorUsername}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.timestamp))} ago</span>
              <ApperIcon 
                name={getContentTypeIcon()} 
                className="w-4 h-4 text-gray-400 ml-auto" 
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Content */}
            {post.content && (
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            )}

            {/* Media Content */}
            {post.thumbnailUrl && post.contentType === "image" && (
              <div className="mb-6">
                <img 
                  src={post.thumbnailUrl} 
                  alt={post.title}
                  className="max-w-full h-auto rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
<ApperIcon name="MessageSquare" className="w-4 h-4" />
                <span className="font-medium">{commentCount} comments</span>
              </div>
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <ApperIcon name="Share" className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <ApperIcon name="Bookmark" className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <ApperIcon name="Flag" className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
<CommentSection postId={postId} onCommentCountChange={setCommentCount} />
    </div>
  );
};

export default PostDetail;