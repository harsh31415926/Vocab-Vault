import React, { useState, useEffect } from 'react';
import { Layers, Check, RefreshCw, ChevronRight } from 'lucide-react';

export default function RevisionMode({ vocabularies }) {
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Initialize and shuffle deck
  const startSession = () => {
    if (vocabularies.length === 0) return;
    const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setShowMeaning(false);
    setCompleted(false);
  };

  useEffect(() => {
    startSession();
  }, [vocabularies]);

  if (vocabularies.length === 0) {
    return (
      <div className="revision-container">
        <div className="revision-empty-state">
          <Layers size={48} className="sidebar-logo-icon" style={{ opacity: 0.4, marginBottom: '8px' }} />
          <h3 className="revision-empty-title">Vault is Empty</h3>
          <p className="revision-empty-text">
            You need to add words to your vault before you can start a revision session.
          </p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="revision-container">
        <div className="revision-card" style={{ justifyContent: 'center', gap: '20px' }}>
          <Check size={48} style={{ color: 'var(--accent-color)' }} />
          <h3 className="revision-word" style={{ fontSize: '32px' }}>Session Complete!</h3>
          <p className="revision-empty-text" style={{ margin: '0 auto 12px auto' }}>
            Excellent work. You reviewed all {deck.length} words in this session.
          </p>
          <button className="revision-reveal-btn" onClick={startSession}>
            <RefreshCw size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            <span>Restart Session</span>
          </button>
        </div>
      </div>
    );
  }

  const currentVocab = deck[currentIndex];

  if (!currentVocab) {
    return null;
  }

  const handleNext = () => {
    if (currentIndex + 1 >= deck.length) {
      setCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setShowMeaning(false);
    }
  };

  return (
    <div className="revision-container">
      <div className="revision-card">
        <div className="revision-progress">
          Card {currentIndex + 1} of {deck.length}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <h2 className="revision-word">{currentVocab.word}</h2>
          
          <div className="revision-tags">
            {currentVocab.tags && currentVocab.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">#{tag}</span>
            ))}
          </div>

          {/* Reveal button or hidden block helper */}
          {!showMeaning && (
            <button className="revision-reveal-btn" onClick={() => setShowMeaning(true)}>
              Reveal Meaning
            </button>
          )}
        </div>

        {showMeaning ? (
          <div className="revision-details">
            <div className="revision-section">
              <span className="revision-section-title">Meaning</span>
              <p className="revision-meaning">{currentVocab.meaning}</p>
            </div>

            {currentVocab.synonyms && currentVocab.synonyms.length > 0 && (
              <div className="revision-section">
                <span className="revision-section-title">Synonyms</span>
                <div className="array-items-list" style={{ marginTop: '4px' }}>
                  {currentVocab.synonyms.map((syn, idx) => (
                    <span key={idx} className="tag-badge">{syn}</span>
                  ))}
                </div>
              </div>
            )}

            {currentVocab.examples && currentVocab.examples.length > 0 && (
              <div className="revision-section">
                <span className="revision-section-title">Examples</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentVocab.examples.map((ex, idx) => (
                    <p key={idx} className="revision-section-content" style={{ fontStyle: 'italic' }}>
                      "{ex}"
                    </p>
                  ))}
                </div>
              </div>
            )}

            {currentVocab.notes && (
              <div className="revision-section">
                <span className="revision-section-title">My Notes</span>
                <p className="revision-section-content notes">{currentVocab.notes}</p>
              </div>
            )}

            <div className="revision-actions" style={{ marginTop: '16px' }}>
              <button 
                className="revision-action-btn unknown" 
                onClick={handleNext}
              >
                Skip / Hard
              </button>
              <button 
                className="revision-action-btn known" 
                onClick={handleNext}
              >
                <span>Got It</span>
                <ChevronRight size={16} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </button>
            </div>
          </div>
        ) : (
          /* Empty placeholder to keep layout stable */
          <div style={{ height: '180px' }} />
        )}
      </div>
    </div>
  );
}
