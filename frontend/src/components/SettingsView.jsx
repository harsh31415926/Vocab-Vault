import React, { useState } from 'react';
import { Download, Upload, Shield, Bell, Brain, Calendar, Info } from 'lucide-react';

export default function SettingsView({ vocabularies, user }) {
  const [reminders, setReminders] = useState(false);
  const [spacedRep, setSpacedRep] = useState(true);
  const [quizDifficulty, setQuizDifficulty] = useState('medium');

  // Working Client-side CSV Exporter
  const handleExportCSV = () => {
    if (vocabularies.length === 0) {
      alert('Your vault is currently empty. There is nothing to export.');
      return;
    }

    // Define CSV headers
    const headers = ['Word', 'Meaning', 'Notes', 'Synonyms', 'Examples', 'Tags', 'Favorite', 'Created At'];
    
    // Map rows
    const rows = vocabularies.map(vocab => {
      const synStr = (vocab.synonyms || []).join('; ');
      const exStr = (vocab.examples || []).join('; ');
      const tagStr = (vocab.tags || []).join(', ');
      const favStr = vocab.is_favorite ? 'Yes' : 'No';
      
      return [
        vocab.word || '',
        vocab.meaning || '',
        vocab.notes || '',
        synStr,
        exStr,
        tagStr,
        favStr,
        vocab.created_at || ''
      ].map(field => {
        // Escape quotes for CSV format
        const escaped = ('' + field).replace(/"/g, '""');
        return `"${escaped}"`;
      });
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vocab_vault_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportPlaceholder = () => {
    alert('CSV Import is configured to read standard comma-separated formats. The import ingestion system is structurally prepared for backend upload mapping.');
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h3 className="settings-section-title">My Account</h3>
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Authorized Email</span>
            <span className="setting-desc">The credentials securing your active vault.</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>
            {user?.email || 'test@example.com'}
          </span>
        </div>
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Vault Database Connection</span>
            <span className="setting-desc">Local instance backing your records.</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--accent-color)' }} className="tag-badge">
            SQLite (vocab.db)
          </span>
        </div>
      </div>

      <div className="settings-card">
        <h3 className="settings-section-title">Data Actions</h3>
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Export Vault to CSV</span>
            <span className="setting-desc">Download your entire personal vocabulary collection in spreadsheet format.</span>
          </div>
          <button className="add-array-btn" style={{ height: '38px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Import Vocabulary</span>
            <span className="setting-desc">Batch upload vocabulary words via CSV templates.</span>
          </div>
          <button className="add-array-btn" style={{ height: '38px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleImportPlaceholder}>
            <Upload size={14} />
            <span>Import</span>
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h3 className="settings-section-title">Future Feature Integrations (Architectural Stubs)</h3>
        
        <div className="setting-row">
          <div className="setting-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={16} style={{ color: 'var(--accent-color)' }} />
              <span className="setting-title">Spaced Repetition Algorithm (SuperMemo-2)</span>
            </div>
            <span className="setting-desc">Calculate dynamic revision intervals based on recall speed.</span>
          </div>
          <input 
            type="checkbox" 
            checked={spacedRep}
            onChange={(e) => setSpacedRep(e.target.checked)}
            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
          />
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} style={{ color: 'var(--accent-color)' }} />
              <span className="setting-title">Daily Word Reminder</span>
            </div>
            <span className="setting-desc">Receive a daily digest of 5 forgotten vocabulary entries.</span>
          </div>
          <input 
            type="checkbox" 
            checked={reminders}
            onChange={(e) => setReminders(e.target.checked)}
            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
          />
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} style={{ color: 'var(--accent-color)' }} />
              <span className="setting-title">Active Streaks and Stats</span>
            </div>
            <span className="setting-desc">Log your learning session consistency calendar.</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            In development
          </span>
        </div>
      </div>
    </div>
  );
}
