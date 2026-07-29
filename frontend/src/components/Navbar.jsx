import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function Navbar({ 
  activeView, 
  activeTag, 
  searchQuery, 
  setSearchQuery, 
  onAddClick 
}) {
  const getHeaderDetails = () => {
    if (activeTag) {
      return {
        title: `Tag: #${activeTag}`,
        subtitle: `All vocabulary categorized under "${activeTag}".`
      };
    }

    switch (activeView) {
      case 'favorites':
        return {
          title: 'Favorites Vault',
          subtitle: 'Your curated selection of highly valued words.'
        };
      case 'recent':
        return {
          title: 'Recently Acquired',
          subtitle: 'The latest additions to your mental lexicon.'
        };
      case 'revision':
        return {
          title: 'Revision Center',
          subtitle: 'Active recall and self-testing via digital flashcards.'
        };
      case 'settings':
        return {
          title: 'System Settings',
          subtitle: 'Manage your local vault parameters and database links.'
        };
      case 'about':
        return {
          title: 'About LexVault',
          subtitle: 'A private space to build your lifelong vocabulary.'
        };
      case 'dashboard':
      default:
        return {
          title: 'Personal Vocabulary Vault',
          subtitle: 'A quiet place to build and secure your lifelong English lexicon.'
        };
    }
  };

  const { title, subtitle } = getHeaderDetails();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Only show search & add button on list views (dashboard, favorites, recent, tag filtering)
  const isListView = activeView === 'dashboard' || activeView === 'favorites' || activeView === 'recent';

  return (
    <header className="content-header">
      <div className="header-title-area">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      {isListView && (
        <div className="header-actions">
          <div className="search-bar-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search words, meanings, synonyms, or notes..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button 
            className="add-vocab-btn" 
            onClick={onAddClick}
            title="Add New Word"
          >
            <Plus size={24} />
          </button>
        </div>
      )}
    </header>
  );
}
