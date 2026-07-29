import React, { useState, useEffect, useRef } from 'react';
import { Star, Copy, Trash2, Tag, Calendar } from 'lucide-react';

export default function VocabCard({ 
  vocab, 
  isDraft, 
  onSaveDraft, 
  onCancelDraft, 
  onCardClick, 
  onToggleFavorite, 
  onDuplicate, 
  onDeleteClick 
}) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const wordInputRef = useRef(null);

  // Focus the word input field when draft card is generated
  useEffect(() => {
    if (isDraft && wordInputRef.current) {
      wordInputRef.current.focus();
    }
  }, [isDraft]);

  const handleSave = (e) => {
    e.stopPropagation();
    if (!word.trim() || !meaning.trim()) return;
    onSaveDraft({
      word: word.trim(),
      meaning: meaning.trim(),
      synonyms: [],
      examples: [],
      tags: [],
      notes: '',
      is_favorite: false
    });
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    onCancelDraft();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return '';
    }
  };

  if (isDraft) {
    return (
      <div className="vocab-card draft-mode" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            ref={wordInputRef}
            placeholder="Enter word..."
            className="vocab-card-input word-input"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <textarea
            placeholder="Enter meaning..."
            className="vocab-card-input"
            style={{ resize: 'none', minHeight: '60px' }}
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
          />
        </div>
        <div className="draft-actions">
          <button className="draft-btn cancel" onClick={handleCancel}>
            Discard
          </button>
          <button 
            className="draft-btn save" 
            onClick={handleSave}
            disabled={!word.trim() || !meaning.trim()}
            style={{ opacity: (!word.trim() || !meaning.trim()) ? 0.5 : 1 }}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vocab-card" onClick={() => onCardClick(vocab)}>
      <div className="vocab-card-header">
        <h3 className="vocab-card-word">{vocab.word}</h3>
        <div className="vocab-card-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className={`card-action-btn ${vocab.is_favorite ? 'favorite' : ''}`}
            onClick={() => onToggleFavorite(vocab)}
            title={vocab.is_favorite ? 'Remove from favorites' : 'Mark as favorite'}
          >
            <Star size={16} fill={vocab.is_favorite ? 'var(--favorite-color)' : 'none'} />
          </button>
          <button 
            className="card-action-btn"
            onClick={() => onDuplicate(vocab)}
            title="Duplicate Word"
          >
            <Copy size={15} />
          </button>
          <button 
            className="card-action-btn"
            onClick={() => onDeleteClick(vocab)}
            title="Delete Word"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <p className="vocab-card-meaning">{vocab.meaning}</p>

      {vocab.notes && (
        <p className="vocab-card-notes">
          {vocab.notes.length > 90 ? `${vocab.notes.substring(0, 90)}...` : vocab.notes}
        </p>
      )}

      <div className="vocab-card-footer">
        <div className="vocab-card-tags">
          {vocab.tags && vocab.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="tag-badge">{tag}</span>
          ))}
          {vocab.tags && vocab.tags.length > 2 && (
            <span className="tag-badge" style={{ color: 'var(--accent-color)' }}>
              +{vocab.tags.length - 2}
            </span>
          )}
        </div>
        <span className="vocab-card-date">
          {formatDate(vocab.created_at)}
        </span>
      </div>
    </div>
  );
}
