import React from 'react';
import { X } from 'lucide-react';

export default function ImageGalleryModal({ isOpen, onClose, imageUrl }) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          background: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
          padding: '8px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            padding: '6px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X className="w-6 h-6" />
        </button>
        <img 
          src={imageUrl} 
          alt="첨부 이미지 확답" 
          style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block' }} 
        />
      </div>
    </div>
  );
}
