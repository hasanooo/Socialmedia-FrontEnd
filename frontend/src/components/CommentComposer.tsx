import { useState, type FormEvent, type KeyboardEvent } from 'react';

interface Props {
  placeholder?: string;
  autoFocus?: boolean;
  submitting?: boolean;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
}

export function CommentComposer({ placeholder = 'Write a comment', autoFocus, submitting, onSubmit, onCancel }: Props) {
  const [value, setValue] = useState('');

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || submitting) return;
    onSubmit(trimmed);
    setValue('');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="_feed_inner_comment_box">
      <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <textarea
              autoFocus={autoFocus}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={2000}
              className="form-control _comment_textarea"
            />
          </div>
        </div>
        <div className="_feed_inner_comment_box_icon">
          {onCancel && (
            <button type="button" onClick={onCancel} className="_feed_inner_comment_box_icon_btn">
              <small>Cancel</small>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
