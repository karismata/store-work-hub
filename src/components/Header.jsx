import React from 'react';
import { 
  Building2, 
  PlusCircle, 
  Store, 
  Sun,
  Moon,
  UserCheck,
  Database,
  RefreshCw
} from 'lucide-react';

export default function Header({ 
  theme, 
  setTheme,
  onOpenNewRequest, 
  onOpenNewStore,
  onOpenDeptModal,
  onOpenSupabaseModal,
  onCheckUpdate
}) {
  return (
    <header className="header-navbar">
      {/* Left Brand Title with Version Badge */}
      <div className="brand-section">
        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>매장 관리 업무 Hub</span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: '#3b82f6',
            fontWeight: 700,
            letterSpacing: '0.3px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            v1.1.3
          </span>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="header-actions">
        {/* Manual Update Check Button */}
        <button 
          onClick={onCheckUpdate}
          className="btn-secondary-action"
          style={{ borderColor: 'rgba(59, 130, 246, 0.4)', color: '#3b82f6', fontSize: '11px', padding: '3px 8px' }}
          title="서버의 최신 버전 업데이트 유무 즉시 확인"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
          <span>업데이트 확인</span>
        </button>

        {/* DB Connection Status Button */}
        <button 
          onClick={onOpenSupabaseModal}
          className="btn-secondary-action"
          style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981', fontSize: '11px', padding: '3px 8px' }}
          title="Supabase 클라우드 데이터베이스 연동 설정 및 상태 확인"
        >
          <Database className="w-3.5 h-3.5 text-emerald-500" />
          <span>🟢 DB 실시간 연동됨</span>
        </button>

        {/* Dept Manage */}
        <button 
          onClick={onOpenDeptModal}
          className="btn-secondary-action"
          title="조직 및 부서 관리"
        >
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>조직/부서 관리</span>
        </button>

        {/* Register Store */}
        <button 
          onClick={onOpenNewStore}
          className="btn-secondary-action"
          title="신규 매장 등록"
        >
          <Store className="w-4 h-4 text-blue-600" />
          <span>매장 등록</span>
        </button>

        {/* Create Work Request */}
        <button 
          onClick={onOpenNewRequest}
          className="btn-primary-action"
        >
          <PlusCircle className="w-4 h-4" />
          <span>업무연락 작성</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn-secondary-action"
          style={{ padding: '4px 8px' }}
          title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
        </button>
      </div>
    </header>
  );
}
