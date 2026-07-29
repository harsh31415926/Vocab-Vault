import React from 'react';
import { 
  Mail, 
  Globe, 
  Cpu, 
  Code, 
  Database, 
  Layers, 
  Smartphone, 
  Sparkles,
  BookOpen
} from 'lucide-react';

// Custom inline SVG icons for compile safety
const Github = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" rx="1" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function AboutView() {
  const interests = [
    'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 
    'Generative AI', 'Agentic AI', 'Large Language Models', 
    'LangGraph', 'AI System Design', 'Python Development', 
    'Competitive Programming', 'Quantitative Finance', 
    'Algorithmic Trading', 'Building intelligent productivity tools'
  ];

  const techStack = [
    { name: 'HTML5', icon: Code },
    { name: 'CSS3', icon: Sparkles },
    { name: 'JavaScript', icon: Cpu },
    { name: 'Local Storage / Database', icon: Database },
    { name: 'Responsive Design', icon: Smartphone },
    { name: 'Modular Architecture', icon: Layers }
  ];

  const contacts = [
    { label: 'Email', value: 'harsh3h3@gmail.com', icon: Mail, link: 'mailto:harsh3h3@gmail.com' },
    { label: 'LinkedIn', value: 'https://www.linkedin.com/in/harshsharma-engineer/', icon: Linkedin, link: 'https://www.linkedin.com/in/harshsharma-engineer/' },
    { label: 'GitHub', value: 'github.com/harsh31415926', icon: Github, link: 'https://github.com/harsh31415926' },
    { label: 'Portfolio', value: 'https://harsh31415926-github-io.vercel.app/', icon: Globe, link: 'https://harsh31415926-github-io.vercel.app/' }
  ];

  return (
    <div className="about-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '48px' }}>
      
      {/* 1. About LexVault */}
      <div className="about-card">
        <h2 className="about-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={20} style={{ color: 'var(--accent-color)' }} />
          About LexVault
        </h2>
        <p className="about-text" style={{ fontSize: '14px', lineHeight: '1.6' }}>
          LexVault is a personal vocabulary management platform designed to help users build and maintain their own lifelong vocabulary collection.
        </p>
        <p className="about-text" style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '12px' }}>
          Unlike traditional dictionary applications, LexVault allows users to create their own vocabulary entries, write their own meanings, add synonyms, personal notes, and example sentences, making the learning experience completely personal.
        </p>
        <p className="about-text" style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '12px' }}>
          The goal of LexVault is to make vocabulary learning simple, organized, and enjoyable while giving users complete ownership over their learning journey. Every vocabulary entry is stored securely so users can continue building their personal knowledge base over time.
        </p>
        <p className="about-text" style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '12px' }}>
          This project is designed with a minimal, distraction-free interface that encourages consistency and makes revising vocabulary effortless.
        </p>
      </div>

      {/* 2. About the Creator */}
      <div className="about-card">
        <h2 className="about-title">About the Creator</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Harsh Sharma</h3>
            <p className="about-text" style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '2px' }}>
              Final-year Engineering student specializing in Artificial Intelligence and Machine Learning.
            </p>
          </div>
          
          <p className="about-text" style={{ fontSize: '14px', lineHeight: '1.6' }}>
            Passionate about building practical software products that solve real-world problems through clean engineering and thoughtful design.
          </p>

          <div style={{ marginTop: '8px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '12px' }}>
              Areas of Interest
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
              {interests.map((interest, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }} />
                  <span>{interest}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="about-text" style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '8px' }}>
            Harsh enjoys creating projects that combine technology with everyday learning and productivity. His goal is to build software that helps people learn more effectively, think more clearly, and become better problem solvers.
          </p>

          <p className="about-text" style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '4px' }}>
            LexVault was created from a personal need to organize and remember newly learned vocabulary in a clean, searchable, and permanent way. Instead of relying on generic dictionary apps, the project provides a dedicated space where users can build their own vocabulary library over time.
          </p>
        </div>
      </div>

      {/* 3. Technology Stack */}
      <div className="about-card">
        <h2 className="about-title">Technology Stack</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginTop: '8px' }}>
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '12px 16px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)' 
                }}
              >
                <Icon size={16} style={{ color: 'var(--accent-color)' }} />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. GitHub Project Section */}
      <div className="about-card">
        <h2 className="about-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Github size={20} />
          GitHub Repository
        </h2>
        <p className="about-text" style={{ fontSize: '14px' }}>
          Explore the source code, suggest features, or report bugs directly in the project repository:
        </p>
        <a 
          href="https://github.com/harsh31415926/Vocab-Vault" 
          target="_blank" 
          rel="noopener noreferrer"
          className="sidebar-link"
          style={{ 
            marginTop: '8px',
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '13px'
          }}
        >
          <Github size={16} />
          <span>github.com/your-username</span>
        </a>
      </div>

      {/* 5. Contact Sheet */}
      <div className="about-card">
        <h2 className="about-title">Contact & Profiles</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
          {contacts.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '10px 0',
                  borderBottom: idx < contacts.length - 1 ? '1px solid var(--border-color)' : 'none' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>{contact.label}</span>
                </div>
                <a 
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '13px', 
                    color: 'var(--accent-color)', 
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  {contact.value}
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Footer */}
      <footer style={{ 
        marginTop: '16px', 
        paddingTop: '24px', 
        borderTop: '1px solid var(--border-color)', 
        textAlign: 'center' 
      }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          Created by Harsh Sharma
        </p>
      </footer>

    </div>
  );
}
