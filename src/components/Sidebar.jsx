import React, { useRef } from 'react';
import { 
  Search, 
  Store, 
  BellRing, 
  HelpCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  FileEdit,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ 
  searchQuery, 
  setSearchQuery, 
  onSearchReset, 
  onOpenNewStore, 
  onTriggerTestPopup,
  onOpenHelpModal,
  onOpenCidModal,
  onOpenMemoModal,
  onOpenDeptModal,
  stats 
}) {
  const inputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      onSearchReset();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <aside className="left-sidebar">
      <div>
        <div className="sidebar-title">매장 & 업무 검색</div>
        <form onSubmit={handleSearchSubmit} className="sidebar-search-box">
          <input 
            ref={inputRef}
            type="text" 
            className="input-field" 
            placeholder="가맹점명 또는 사업자번호"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-secondary-action" style={{ width: '100%', justifyContent: 'center' }}>
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>조회</span>
          </button>
        </form>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', opacity: 0.6 }} />

      <div>
        <div className="sidebar-title">빠른 도구</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button 
            className="btn-secondary-action" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={onOpenDeptModal}
          >
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>조직/부서원 관리</span>
          </button>


          <button 
            className="btn-secondary-action" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={onOpenMemoModal}
          >
            <FileEdit className="w-4 h-4 text-amber-600" />
            <span>업무 간이 메모장</span>
          </button>

          <button 
            className="btn-secondary-action" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={onOpenHelpModal}
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>이용 가이드</span>
          </button>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', opacity: 0.6 }} />

      <div>
        <div className="sidebar-title">업무 요약</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '7px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--status-new-text)', fontWeight: 600 }}>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>신규 요청</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--status-new-text)' }}>
              {stats.new}건
            </span>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '7px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--status-process-text)', fontWeight: 600 }}>
              <Clock className="w-3.5 h-3.5" />
              <span>진행 중</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--status-process-text)' }}>
              {stats.processing}건
            </span>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '7px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--status-done-text)', fontWeight: 600 }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>처리 완료</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--status-done-text)' }}>
              {stats.done}건
            </span>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', opacity: 0.6 }} />

      <div>
        <button 
          onClick={onTriggerTestPopup}
          className="btn-secondary-action" 
          style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--accent-primary)' }}
        >
          <BellRing className="w-4 h-4 text-blue-600" />
          <span>실시간 알림 테스트</span>
        </button>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button 
          onClick={onOpenNewStore}
          className="btn-secondary-action"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Store className="w-4 h-4" />
          <span>신규 매장 등록 (+사업자)</span>
        </button>
      </div>
    </aside>
  );
}
