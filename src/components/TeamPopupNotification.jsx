import React from 'react';
import { BellRing, X, ArrowRight, Store, MessageSquare } from 'lucide-react';

export default function TeamPopupNotification({ activePopup, onOpenDetail, onDismiss }) {
  if (!activePopup) return null;

  return (
    <div className="team-popup-toast">
      <div className="popup-header">
        <div className="popup-tag">
          <BellRing className="w-3.5 h-3.5 animate-bounce" />
          <span>실시간 팀 업무 팝업 [{activePopup.targetTeam}]</span>
        </div>
        <button 
          onClick={onDismiss} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="popup-body">
        <div className="popup-store-name">
          {activePopup.storeName} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({activePopup.region})</span>
        </div>
        
        <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '600' }}>
          [{activePopup.category}] | 보낸이: {activePopup.sender}
        </div>

        <div className="popup-content">
          {activePopup.content.length > 80 ? activePopup.content.slice(0, 80) + '...' : activePopup.content}
        </div>
      </div>

      <div className="popup-actions">
        <button 
          className="popup-btn-confirm" 
          onClick={() => {
            onOpenDetail(activePopup);
            onDismiss();
          }}
        >
          <span>확인 및 답변/처리하기</span>
          <ArrowRight className="w-4 h-4 inline ml-1" />
        </button>
        <button className="popup-btn-dismiss" onClick={onDismiss}>
          나중에
        </button>
      </div>
    </div>
  );
}
