import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  Flag,
  MoreVertical,
  Reply as ReplyIcon,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Reply from './Reply';
import CommentForm from './CommentForm';
import { useAppSelector } from '@/lib/redux/hook';
import { formatDate } from '@/lib/utils';
import { useGetListCommentsQuery } from '@/services/apiManga';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export interface CommentType {
  comment: {
    comment_id: number;
    comment_user_id: number;
    comment_content: string;
    comment_chapter_id: number;
    comment_manga_id: number;
    comment_parent_id: number | null;
    createdAt: string;
    updatedAt: string;
    user: {
      usr_id: number;
      usr_name: string;
    };
  };
}

interface CommentProps extends CommentType {
  chapterId: string;
}

const CommentItem = ({ comment, chapterId }: CommentProps) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const auth = useAppSelector((state) => state.auth);

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
    refetch: refetchComments
  } = useGetListCommentsQuery({
    chapter_id: Number(chapterId),
    parent_id: comment.comment_id
  });

  const replyCount = commentsData?.length || 0;
  const hasReplies = replyCount > 1;

  const toggleReplies = () => {
    if (!showReplies && hasReplies) {
      refetchComments();
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className="space-y-4 transition-all duration-300 hover:translate-x-1">
      {/* Main comment */}
      <div className="bg-muted/20 hover:bg-muted/30 border-manga-600/20 rounded-lg border p-4 transition-colors">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Avatar className="ring-manga-500/30 ring-offset-background h-8 w-8 ring-1 ring-offset-1">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.comment_user_id}`}
                alt={comment.user?.usr_name || 'User'}
              />
            </Avatar>
            <div>
              <h4 className="text-manga-50 font-medium">
                {comment.user?.usr_name || `User ${comment.comment_user_id}`}
              </h4>
              <p className="text-muted-foreground text-xs">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-manga-500/10 h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-card/90 border-manga-600/30 backdrop-blur-lg"
            >
              {Number(auth.clientId) === comment.comment_user_id && (
                <DropdownMenuItem className="hover:bg-destructive/10 text-destructive cursor-pointer">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mt-2 text-sm">{comment.comment_content}</p>

        <div className="mt-3 flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-manga-500/10 h-8 gap-1 text-xs"
            onClick={() =>
              setReplyingTo(
                replyingTo === comment.comment_id ? null : comment.comment_id
              )
            }
          >
            <ReplyIcon className="h-4 w-4" /> Reply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-manga-500/10 h-8 gap-1 text-xs"
          >
            <Flag className="h-4 w-4" /> Report
          </Button>

          {!comment.comment_parent_id && hasReplies && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-manga-500/10 ml-auto h-8 gap-1 text-xs"
              onClick={toggleReplies}
            >
              {showReplies ? (
                <>
                  <ChevronUp className="h-4 w-4" /> Hide Replies
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <Badge
                    variant="secondary"
                    className="bg-manga-500/20 hover:bg-manga-500/30 ml-1"
                  >
                    {replyCount - 1}
                  </Badge>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {replyingTo === comment.comment_id && auth.clientId && (
        <div className="ml-8">
          <CommentForm
            avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.comment_user_id}`}
            userName={auth.user?.name || 'User'}
            placeholder={`Reply to @${comment.user.usr_name}`}
            buttonText="Reply"
            value={replyContent}
            onChange={setReplyContent}
            isReply={true}
            onCancel={() => setReplyingTo(null)}
            chapterId={comment.comment_chapter_id}
            parentId={comment.comment_id}
            parentName={`@${comment.user.usr_name}`}
          />
        </div>
      )}

      {/* Replies */}
      {!comment.comment_parent_id && (
        <AnimatePresence>
          {showReplies && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-manga-600/20 ml-8 space-y-3 border-l-2 pt-2 pl-4">
                {commentsLoading ? (
                  // Skeleton loading for replies
                  Array(Math.min(3, replyCount || 2))
                    .fill(0)
                    .map((_, index) => (
                      <div key={`skeleton-${index}`} className="animate-pulse">
                        <div className="mb-2 flex gap-2">
                          <Skeleton className="h-8 w-8 rounded-full bg-gray-800/50" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded bg-gray-800/50" />
                            <Skeleton className="h-3 w-16 rounded bg-gray-800/30" />
                          </div>
                        </div>
                        <Skeleton className="h-12 w-full rounded bg-gray-800/30" />
                      </div>
                    ))
                ) : commentsData && commentsData.length > 0 ? (
                  commentsData.map((item) =>
                    item.comment_parent_id != null ? (
                      <Reply key={item.comment_id} comment={item} />
                    ) : null
                  )
                ) : (
                  <div className="text-muted-foreground py-4 text-center">
                    <MessageCircle className="mx-auto mb-2 h-5 w-5 opacity-50" />
                    <p className="text-sm">No replies yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default CommentItem;
