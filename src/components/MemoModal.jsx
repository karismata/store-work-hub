import React, { useState, useEffect } from 'react';
import { X, FileEdit, Save, Check } from 'lucide-react';

export default function MemoModal({ isOpen, onClose }) {
  const [memoText, setMemoText] = useState(() => {
    return localStorage.getItem('store_work_hub_memo') || 
`[오늘의 업무 메모]
- (주)루미호스피털 메뉴 수정건 지원팀 연결 완료
- 15시 한주커피 포스 패치 예정
- VAN사 정산 문의건 확인 필요`;
  });
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('store_work_hub_memo', memoText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '550px' }}>
        <div className="modal-header">
          <div className="modal-title text-amber-400">
            <FileEdit className="w-5 h-5 text-amber-400" />
            <span>업무 간이 메모장 (자동저장)</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <textarea
            className="input-field"
            rows="10"
            style={{ fontSize: '13px', lineHeight: '1.6', fontFamily: 'sans-serif' }}
            placeholder="통화 내용이나 임시 업무 정보를 자유롭게 기록하세요..."
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
          ></textarea>
          {isSaved && (
            <div style={{ fontSize: '12px', color: 'var(--status-done-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check className="w-4 h-4" />
              <span>메모가 저장되었습니다.</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary-action" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="btn-primary-action" onClick={handleSave}>
            <Save className="w-4 h-4" />
            <span>저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
