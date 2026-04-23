'use client';

import { useState, useMemo } from 'react';
import './media.css';
import RightSidebar from '@/components/RightSidebar';
import { useProject } from '@/context/ProjectContext';

// ── Types ──────────────────────────────────────────────────────────────────
type AssetCategory = 'All' | 'Proposals' | 'Creative' | 'Technical' | 'Legal';
type AssetStatus = 'Approved' | 'In Review' | 'Draft' | 'Needs Revision';
type FileType = 'PDF' | 'PPTX' | 'JPG' | 'PNG' | 'DOCX' | 'MP4';

interface ProjectAsset {
  id: string;
  projectId: string;
  title: string;
  fileName: string;
  type: FileType;
  category: AssetCategory;
  status: AssetStatus;
  version: string;
  size: string;
  updatedAt: string;
  isClientShared: boolean;
  thumbnail?: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_ASSETS: ProjectAsset[] = [
  { id: 'a1', projectId: 'p1', title: 'Q2 Project Proposal', fileName: 'Acme_Proposal_v2.pdf', type: 'PDF', category: 'Proposals', status: 'Approved', version: '2.1', size: '4.2 MB', updatedAt: '2h ago', isClientShared: true },
  { id: 'a2', projectId: 'p1', title: 'Brand Guideline V1', fileName: 'Brand_Identity.pdf', type: 'PDF', category: 'Creative', status: 'In Review', version: '1.0', size: '12.8 MB', updatedAt: '5h ago', isClientShared: false },
  { id: 'a3', projectId: 'p2', title: 'Tech Architecture Deck', fileName: 'System_Scaffold.pptx', type: 'PPTX', category: 'Technical', status: 'Approved', version: '1.4', size: '8.5 MB', updatedAt: 'Yesterday', isClientShared: true },
  { id: 'a4', projectId: 'p2', title: 'API Integration Auth Flow', fileName: 'Auth_Logic.docx', type: 'DOCX', category: 'Technical', status: 'Draft', version: '0.9', size: '1.1 MB', updatedAt: '3h ago', isClientShared: false },
  { id: 'a5', projectId: 'p1', title: 'Hero Illustration', fileName: 'Hero_Asset_Final.png', type: 'PNG', category: 'Creative', status: 'Approved', version: '3.0', size: '24.5 MB', updatedAt: '2d ago', isClientShared: true },
  { id: 'a6', projectId: 'p3', title: 'Strategic Partnership Proposal', fileName: 'Strategy_Deck_Q3.pptx', type: 'PPTX', category: 'Proposals', status: 'Needs Revision', version: '1.1', size: '15.2 MB', updatedAt: '4h ago', isClientShared: false },
  { id: 'a7', projectId: 'p1', title: 'Contract Terms - Master', fileName: 'Acme_Contract_Final.docx', type: 'DOCX', category: 'Legal', status: 'Approved', version: '1.0', size: '0.8 MB', updatedAt: '5d ago', isClientShared: true },
];

export default function MediaPage() {
  const { selectedProject } = useProject();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [category, setCategory] = useState<AssetCategory>('All');

  const filteredAssets = useMemo(() => {
    let assets = MOCK_ASSETS;
    if (selectedProject) {
      assets = assets.filter(a => a.projectId === selectedProject.id);
    }
    if (category !== 'All') {
      assets = assets.filter(a => a.category === category);
    }
    return assets;
  }, [selectedProject, category]);

  const categories: AssetCategory[] = ['All', 'Proposals', 'Creative', 'Technical', 'Legal'];

  return (
    <main className="dashboard-layout">
      <div className="dashboard-main-column">
        <div className="media-page animate-fade-in">
          
          <header className="media-toolbar">
            <div className="media-title-group">
                <h1 className="media-title">Media Library</h1>
                <p className="media-subtitle">
                    {selectedProject ? `${selectedProject.name} — Project Assets` : 'Organization Asset Portfolio'}
                </p>
            </div>

            <div className="media-actions">
                <div className="media-v-switcher">
                    <button className={`media-v-btn ${viewType === 'grid' ? 'active' : ''}`} onClick={() => setViewType('grid')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    </button>
                    <button className={`media-v-btn ${viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('list')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    </button>
                </div>
                <div className="toolbar-divider" />
                <button className="toolbar-btn primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/></svg>
                    Upload Asset
                </button>
            </div>
          </header>

          <nav className="media-categories">
            {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`cat-tab ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                    {cat}
                </button>
            ))}
          </nav>

          <div className="media-content">
            {/* Top Level Folders (Only in All or relevant categories) */}
            {category === 'All' && viewType === 'grid' && (
                <div className="folder-grid">
                    {[
                        { name: 'Brand Assets', count: 12, color: '#018bf1' },
                        { name: 'Project Proposals', count: 5, color: '#34C759' },
                        { name: 'Technical Docs', count: 8, color: '#AF52DE' },
                        { name: 'Legal & Contracts', count: 3, color: '#FF9500' }
                    ].map(f => (
                        <div key={f.name} className="folder-card" onClick={() => setCategory(f.name.split(' ')[1] as AssetCategory)}>
                            <div className="folder-icon-wrapper" style={{ color: f.color }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.15"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
                                <div className="folder-icon-top">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                </div>
                            </div>
                            <div className="folder-info">
                                <span className="folder-name">{f.name}</span>
                                <span className="folder-count">{f.count} items</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {viewType === 'grid' ? (
                <div className="asset-grid">
                    {filteredAssets.map(asset => (
                        <div key={asset.id} className="asset-card">
                            <div className="asset-preview">
                                <div className="file-type-icon">{asset.type}</div>
                                {asset.isClientShared && (
                                    <span className="client-badge" title="Shared with Client">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </span>
                                )}
                            </div>
                            <div className="asset-info">
                                <span className={`asset-status-tag ${asset.status.toLowerCase().replace(' ', '-')}`}>
                                    {asset.status}
                                </span>
                                <h3 className="asset-name" title={asset.fileName}>{asset.title}</h3>
                                <div className="asset-meta">
                                    <span>v{asset.version}</span>
                                    <span className="meta-dot">•</span>
                                    <span>{asset.size}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="asset-list-container">
                    <table className="asset-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Version</th>
                                <th>Size</th>
                                <th>Shared</th>
                                <th>Updated</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.map(asset => (
                                <tr key={asset.id} className="asset-row">
                                    <td>
                                        <div className="asset-name-cell">
                                            <div className="mini-icon">{asset.type}</div>
                                            <div className="cell-info">
                                                <span className="cell-title">{asset.title}</span>
                                                <span className="cell-filename">{asset.fileName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="category-tag">{asset.category}</span></td>
                                    <td>
                                        <span className={`status-pill ${asset.status.toLowerCase().replace(' ', '-')}`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td>v{asset.version}</td>
                                    <td>{asset.size}</td>
                                    <td>
                                        {asset.isClientShared ? (
                                            <span className="shared-indicator yes">Yes</span>
                                        ) : (
                                            <span className="shared-indicator no">Internal Only</span>
                                        )}
                                    </td>
                                    <td>{asset.updatedAt}</td>
                                    <td>
                                        <button className="row-action-btn">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-right-column">
        <RightSidebar mode="reports" />
      </div>
    </main>
  );
}
