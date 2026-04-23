'use client';

import { useState } from 'react';
import './ProjectModal.css';
import { useProject } from '@/context/ProjectContext';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const { addProject } = useProject();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    color: '#018bf1',
    dueDate: '',
    status: 'Active' as const,
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    addProject({
      name: formData.name,
      client: formData.client,
      status: formData.status,
      color: formData.color,
      dueDate: formData.dueDate || 'No set date',
    });
    onClose();
    setStep(1);
  };

  const colors = ['#018bf1', '#AF52DE', '#FF9500', '#34C759', '#FF3B30', '#FF2D55'];

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="project-modal card animate-slide-up" onClick={e => e.stopPropagation()}>
        
        <header className="modal-header">
            <div className="header-text">
                <h2 className="modal-title">Initialize New Workspace</h2>
                <p className="modal-subtitle">Step {step} of 3: {step === 1 ? 'Foundations' : step === 2 ? 'Identity & Timeline' : 'Team & Finalize'}</p>
            </div>
            <button className="close-btn-circle" onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </header>

        <div className="steps-progress">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
            <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
            <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
        </div>

        <div className="modal-body">
            {step === 1 && (
                <div className="form-step animate-fade-in">
                    <div className="form-group">
                        <label>Workspace Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Q3 Brand Campaign"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Client Organization</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Acme Corp"
                            value={formData.client}
                            onChange={e => setFormData({...formData, client: e.target.value})}
                        />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="form-step animate-fade-in">
                    <div className="form-group">
                        <label>Workspace Accent Color</label>
                        <div className="color-picker-grid">
                            {colors.map(c => (
                                <button 
                                    key={c}
                                    className={`color-swatch ${formData.color === c ? 'active' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setFormData({...formData, color: c})}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Hard Deadline</label>
                        <input 
                            type="date" 
                            value={formData.dueDate}
                            onChange={e => setFormData({...formData, dueDate: e.target.value})}
                        />
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="form-step animate-fade-in">
                    <div className="review-card">
                        <div className="review-row">
                            <span className="review-label">Name</span>
                            <span className="review-val">{formData.name}</span>
                        </div>
                        <div className="review-row">
                            <span className="review-label">Client</span>
                            <span className="review-val">{formData.client}</span>
                        </div>
                        <div className="review-row">
                            <span className="review-label">Due Date</span>
                            <span className="review-val">{formData.dueDate || 'Not set'}</span>
                        </div>
                    </div>
                    <p className="final-hint">Initializing this workspace will notify stakeholders and create the creative repository.</p>
                </div>
            )}
        </div>

        <footer className="modal-footer">
            {step > 1 && <button className="modal-btn secondary" onClick={handlePrev}>Previous</button>}
            <div className="spacer" />
            {step < 3 ? (
                <button className="modal-btn primary" onClick={handleNext} disabled={!formData.name || !formData.client}>
                    Continue
                </button>
            ) : (
                <button className="modal-btn primary" onClick={handleSubmit}>
                    Initialize Workspace
                </button>
            )}
        </footer>

      </div>
    </div>
  );
}
