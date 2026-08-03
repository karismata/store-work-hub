import React from 'react';
import { X, HelpCircle, CheckCircle, Info } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '600px' }}>
        <div className="modal-header">
          <div className="modal-title text-indigo-400">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Store Work Hub 도움말 및 단축키 안내</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: '700' }}>💡 주요 사용 가이드</h4>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><b>행 더블클릭</b>: 가맹점 관리 그리드의 행을 더블클릭하면 상세 사업자 및 계약 정보 모달이 열립니다.</li>
              <li><b>실시간 팀 팝업</b>: 업무 채팅 작성 시 지정한 팀 담당자의 화면에 데스크톱 팝업 알림이 수신됩니다.</li>
              <li><b>매장 등록</b>: 조회 목록에 없는 매장은 [매장 등록] 버튼을 눌러 언제든지 신규 추가할 수 있습니다.</li>
              <li><b>가맹점 수정</b>: [가맹점/매장관리] 탭에서 [상세/수정] 버튼을 눌러 정보를 변경할 수 있습니다.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary-action" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
