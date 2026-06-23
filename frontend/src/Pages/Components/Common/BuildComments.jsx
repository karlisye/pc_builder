import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { HeartIcon, StarIcon, TrashIcon } from './Icons';
import Modal from './Modal';
import { formatDate } from '../../../lib/formatDate';
import { useAuth } from '../../../Contexts/AuthContext';
import { useToast } from '../../../Contexts/ToastContext';

const Comment = ({ comment, onLike, onReply, onDelete, isReply = false, replyingToName = null }) => {
  const { t } = useTranslation('pages');
  const { user } = useAuth();
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState('');

  const submitReply = () => {
    if (!replyBody.trim()) return;
    onReply(comment.id, replyBody);
    setReplyBody('');
    setReplying(false);
  };

  return (
    <div className={isReply ? 'pl-8' : ''}>
      <div className="border border-border bg-surface p-3 space-y-2">
        {isReply && replyingToName && (
          <p className="text-muted text-xs">
            {t('buildComments.replyingTo', { name: replyingToName })}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Link
            className="w-8 h-8 rounded-full bg-secondary-light flex items-center justify-center font-bold text-sm shrink-0"
            to={`/profile/${comment.user?.id}`}
          >
            {comment.user?.name?.charAt(0).toUpperCase()}
          </Link>
          <Link className="text-text font-medium" to={`/profile/${comment.user?.id}`}>
            @{comment.user?.name}
          </Link>

          {comment.rating != null && (
            <span className="flex items-center gap-1">
              <StarIcon filled size={16} className={'text-alert'} />
              <span className="text-muted text-sm">{comment.rating}</span>
            </span>
          )}

          <span className="text-muted text-sm ml-auto">
            {formatDate(comment.created_at, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {user?.id === comment.user?.id && (
            <button
              className="text-muted hover:text-danger transition cursor-pointer"
              onClick={() => onDelete(comment)}
            >
              <TrashIcon size={18} />
            </button>
          )}
        </div>

        <p className="text-text">{comment.body}</p>

        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => onLike(comment.id)}
          >
            <HeartIcon
              filled={comment.liked}
              size={18}
              className={
                comment.liked
                  ? 'text-danger transition hover:text-danger/90'
                  : 'transition text-muted hover:text-text'
              }
            />
            <span className="text-muted text-sm">{comment.likes_count ?? 0}</span>
          </button>

          {!isReply && user && (
            <button
              className="text-muted text-sm hover:text-text transition cursor-pointer"
              onClick={() => setReplying((prev) => !prev)}
            >
              {t('buildComments.reply')}
            </button>
          )}
        </div>

        {replying && (
          <div className="flex gap-2">
            <input
              type="text"
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder={t('buildComments.replyPlaceholder')}
              className="bg-background border border-border text-text p-2 flex-1 focus:outline-1 outline-border"
            />
            <button
              onClick={submitReply}
              className="px-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer"
            >
              {t('buildComments.submit')}
            </button>
            <button
              onClick={() => setReplying(false)}
              className="px-4 bg-secondary text-white hover:bg-secondary-light transition cursor-pointer"
            >
              {t('buildComments.cancel')}
            </button>
          </div>
        )}
      </div>

      {comment.replies?.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onDelete={onDelete}
              isReply
              replyingToName={comment.user?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BuildComments = ({ buildId }) => {
  const { t } = useTranslation('pages');
  const { user } = useAuth();
  const { addToast } = useToast();

  const [comments, setComments] = useState([]);
  const [body, setBody] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchComments = () => {
    axios.get(`/api/shared/${buildId}/comments`).then((res) => setComments(res.data));
  };

  useEffect(() => {
    fetchComments();
  }, [buildId]);

  const updateCommentInTree = (list, commentId, updater) =>
    list.map((c) => {
      if (c.id === commentId) return updater(c);
      if (c.replies?.length) {
        return { ...c, replies: updateCommentInTree(c.replies, commentId, updater) };
      }
      return c;
    });

  const handleLike = async (commentId) => {
    try {
      await axios.post(`/api/comments/${commentId}/like`);
      setComments((prev) =>
        updateCommentInTree(prev, commentId, (c) => ({
          ...c,
          liked: !c.liked,
          likes_count: c.liked ? c.likes_count - 1 : c.likes_count + 1,
        })),
      );
    } catch (err) {
      addToast(err.response?.data?.error ?? t('buildComments.likeError'), {
        type: 'danger',
      });
    }
  };

  const removeCommentFromTree = (list, commentId) =>
    list
      .filter((c) => c.id !== commentId)
      .map((c) => ({
        ...c,
        replies: c.replies?.length ? removeCommentFromTree(c.replies, commentId) : c.replies,
      }));

  const confirmDelete = async () => {
    const commentId = deleting.id;
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments((prev) => removeCommentFromTree(prev, commentId));
    } catch (err) {
      addToast(err.response?.data?.error ?? t('buildComments.deleteError'), {
        type: 'danger',
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleReply = async (parentId, replyBody) => {
    try {
      const res = await axios.post(`/api/shared/${buildId}/comments`, {
        body: replyBody,
        parent_id: parentId,
      });
      setComments((prev) =>
        updateCommentInTree(prev, parentId, (c) => ({
          ...c,
          replies: [...(c.replies ?? []), res.data],
        })),
      );
    } catch (err) {
      addToast(err.response?.data?.error ?? t('buildComments.postError'), {
        type: 'danger',
      });
    }
  };

  const handleSubmit = async () => {
    if (!body.trim()) return;
    try {
      const res = await axios.post(`/api/shared/${buildId}/comments`, { body });
      setComments((prev) => [{ ...res.data, replies: [] }, ...prev]);
      setBody('');
    } catch (err) {
      addToast(err.response?.data?.error ?? t('buildComments.postError'), {
        type: 'danger',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-text font-semibold text-2xl">{t('buildComments.title')}</h2>

      {user ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t('buildComments.placeholder')}
            className="bg-surface border border-border text-text p-2 flex-1 focus:outline-1 outline-border"
          />
          <button
            onClick={handleSubmit}
            className="px-8 bg-primary text-white hover:bg-primary-light transition cursor-pointer"
          >
            {t('buildComments.submit')}
          </button>
        </div>
      ) : (
        <p className="text-secondary-light">
          {t('buildComments.loginToComment')}{' '}
          <Link className="text-info/80 cursor-pointer hover:underline" to="/login">
            {t('buildComments.loginLink')}
          </Link>
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-muted">{t('buildComments.empty')}</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onLike={handleLike}
              onReply={handleReply}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      {deleting && (
        <Modal close={() => setDeleting(null)}>
          <h1 className="text-text text-3xl mb-10 m-4 max-w-120">
            {t('buildComments.deleteConfirmTitle')}
          </h1>

          <div className="flex gap-4 m-4">
            <button
              className="flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition"
              onClick={confirmDelete}
            >
              {t('buildComments.delete')}
            </button>
            <button
              className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
              onClick={() => setDeleting(null)}
            >
              {t('buildComments.cancel')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BuildComments;
