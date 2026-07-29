import React from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  Star, 
  Clock, 
  Layers, 
  Settings, 
  Info, 
  LogOut,
  Hash
} from 'lucide-react';

export default function Sidebar({ 
  activeView, 
  setActiveView, 
  activeTag, 
  setActiveTag, 
  vocabularies,
  user,
  onLogout 
}) {
  // Compute dynamic tags from current vocabularies
  const allTags = React.useMemo(() => {
    const tagsSet = new Set();
    vocabularies.forEach(vocab => {
      if (vocab.tags && Array.isArray(vocab.tags)) {
        vocab.tags.forEach(tag => {
          if (tag && tag.trim()) {
            tagsSet.add(tag.trim());
          }
        });
      }
    });
    return Array.from(tagsSet).sort();
  }, [vocabularies]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'recent', label: 'Recently Added', icon: Clock },
    { id: 'revision', label: 'Revision Mode', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <BookOpen className="sidebar-logo-icon" size={20} />
          <span>VocabVault</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id && !activeTag;
            return (
              <a
                key={item.id}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveView(item.id);
                  setActiveTag(null); // Clear tag filter
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {allTags.length > 0 && (
          <div className="sidebar-tag-section">
            <span className="sidebar-tag-title">Custom Tags</span>
            <div className="sidebar-tag-list">
              {allTags.map((tag) => {
                const isActive = activeTag === tag;
                return (
                  <a
                    key={tag}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTag(isActive ? null : tag);
                      setActiveView('dashboard'); // Switch to dashboard when applying tag
                    }}
                  >
                    <Hash size={14} />
                    <span>{tag}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <span className="sidebar-user-email" title={user?.email}>
            {user?.email || 'user@example.com'}
          </span>
          <button className="logout-button" onClick={onLogout} title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
