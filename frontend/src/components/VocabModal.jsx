import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Star } from 'lucide-react';

export default function VocabModal({ vocab, onClose, onSave, onDelete }) {
  // Local edit states
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [notes, setNotes] = useState('');
  const [synonyms, setSynonyms] = useState([]);
  const [examples, setExamples] = useState([]);
  const [tags, setTags] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // New item inputs
  const [newSynonym, setNewSynonym] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newTag, setNewTag] = useState('');

  // Load vocabulary details into local state
  useEffect(() => {
    if (vocab) {
      setWord(vocab.word || '');
      setMeaning(vocab.meaning || '');
      setNotes(vocab.notes || '');
      setSynonyms(vocab.synonyms || []);
      setExamples(vocab.examples || []);
      setTags(vocab.tags || []);
      setIsFavorite(vocab.is_favorite || false);
    }
  }, [vocab]);

  const handleSave = () => {
    if (!word.trim() || !meaning.trim()) return;
    onSave(vocab.id, {
      word: word.trim(),
      meaning: meaning.trim(),
      notes: notes.trim(),
      synonyms,
      examples,
      tags,
      is_favorite: isFavorite
    });
  };

  const handleAddSynonym = (e) => {
    e.preventDefault();
    if (newSynonym.trim() && !synonyms.includes(newSynonym.trim())) {
      setSynonyms([...synonyms, newSynonym.trim()]);
      setNewSynonym('');
    }
  };

  const handleRemoveSynonym = (indexToRemove) => {
    setSynonyms(synonyms.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddExample = (e) => {
    e.preventDefault();
    if (newExample.trim() && !examples.includes(newExample.trim())) {
      setExamples([...examples, newExample.trim()]);
      setNewExample('');
    }
  };

  const handleRemoveExample = (indexToRemove) => {
    setExamples(examples.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    // Normalize tags to lowercase for clean sorting/casing
    const formattedTag = newTag.trim().toLowerCase();
    if (formattedTag && !tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="modal-title">Word Vault Entry</span>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite ? 'var(--favorite-color)' : 'var(--text-muted)' }}
              title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
            >
              <Star size={20} fill={isFavorite ? 'var(--favorite-color)' : 'none'} />
            </button>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Word Field */}
          <div className="modal-field">
            <label className="modal-field-label">Vocabulary Word</label>
            <input
              type="text"
              className="modal-input-field"
              style={{ fontSize: '16px', fontWeight: 600 }}
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. Perspicacity"
            />
          </div>

          {/* Meaning Field */}
          <div className="modal-field">
            <label className="modal-field-label">Meaning / Definition</label>
            <textarea
              className="modal-textarea-field"
              style={{ minHeight: '60px' }}
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="Provide a clear, brief meaning..."
            />
          </div>

          {/* My Notes (Completely user controlled) */}
          <div className="modal-field">
            <label className="modal-field-label">My Notes</label>
            <textarea
              className="modal-textarea-field"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write memory tricks, revision hints, context where you saw it, interview remarks..."
            />
          </div>

          {/* Synonyms */}
          <div className="modal-field">
            <label className="modal-field-label">Synonyms</label>
            <form onSubmit={handleAddSynonym} className="array-input-row">
              <input
                type="text"
                className="modal-input-field"
                placeholder="Add synonym..."
                value={newSynonym}
                onChange={(e) => setNewSynonym(e.target.value)}
              />
              <button type="submit" className="add-array-btn">
                <Plus size={16} />
              </button>
            </form>
            <div className="array-items-list">
              {synonyms.map((syn, idx) => (
                <div key={idx} className="array-item-tag">
                  <span>{syn}</span>
                  <button type="button" onClick={() => handleRemoveSynonym(idx)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Example Sentences */}
          <div className="modal-field">
            <label className="modal-field-label">Example Sentences</label>
            <form onSubmit={handleAddExample} className="array-input-row">
              <input
                type="text"
                className="modal-input-field"
                placeholder="Add an example sentence..."
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
              />
              <button type="submit" className="add-array-btn">
                <Plus size={16} />
              </button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              {examples.map((ex, idx) => (
                <div key={idx} className="array-item-sentence">
                  <span>"{ex}"</span>
                  <button type="button" className="card-action-btn" onClick={() => handleRemoveExample(idx)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="modal-field">
            <label className="modal-field-label">Tags</label>
            <form onSubmit={handleAddTag} className="array-input-row">
              <input
                type="text"
                className="modal-input-field"
                placeholder="Add tag (e.g. IELTS, Finance, Daily)..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button type="submit" className="add-array-btn">
                <Plus size={16} />
              </button>
            </form>
            <div className="array-items-list">
              {tags.map((tag, idx) => (
                <div key={idx} className="array-item-tag" style={{ borderColor: 'var(--accent-border)' }}>
                  <span>#{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(idx)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="modal-delete-btn"
            onClick={() => onDelete(vocab)}
          >
            <Trash2 size={16} />
            <span>Delete Word</span>
          </button>

          <div className="modal-actions-right">
            <button 
              type="button" 
              className="draft-btn cancel" 
              onClick={onClose}
              style={{ padding: '10px 18px' }}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="modal-save-btn" 
              onClick={handleSave}
              disabled={!word.trim() || !meaning.trim()}
              style={{ opacity: (!word.trim() || !meaning.trim()) ? 0.5 : 1 }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
