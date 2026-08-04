import React, { useState, useEffect } from 'react';
import { Database, Key, Globe, Check, X, Server, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getSupabaseConfig, setSupabaseConfig, supabase } from '../lib/supabase';

export default function SupabaseModal({ isOpen, onClose }) {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [isSaved, setIsSaved] = useState(false);
  const [testStatus, setTestStatus] = useState({ loading: true, success: false, msg: '연동 상태 확인 중...' });

  useEffect(() => {
    if (isOpen) {
      runConnectionTest();
    }
  }, [isOpen]);

  const runConnectionTest = async () => {
    setTestStatus({ loading: true, success: false, msg: 'Supabase 서버 연결 테스트 진행 중...' });
    try {
      const { error } = await supabase.from('app_users').select('count', { count: 'exact', head: true });
      if (error) {
        setTestStatus({
          loading: false,
          success: false,
          msg: `연동 실패: ${error.message} (코드: ${error.code || 'UNKNOWN'})`
        });
      } else {
        setTestStatus({
          loading: false,
          success: true,
          msg: '🟢 Supabase 클라우드 데이터베이스 정상 연결됨 (실시간 공유 활성화)'
        });
      }
    } catch (e) {
      setTestStatus({
        loading: false,
        success: false,
        msg: `네트워크 또는 Key 오류: ${e.message}`
      });
    }
  };

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSupabaseConfig(url.trim(), key.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-box" style={{ width: '520px' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#10b981' }}>
            <Database className="w-5 h-5" />
            <span>Supabase Cloud 데이터베이스 연동 설정</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Live Connection Test Status Banner */}
            <div style={{
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: testStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: testStatus.success ? '1px solid #10b981' : '1px solid #ef4444',
              color: testStatus.success ? '#10b981' : '#ef4444',
              fontSize: '12px',
              lineHeight: '1.5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                {testStatus.loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-500 flex-shrink-0" />
                ) : testStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
                <span>{testStatus.msg}</span>
              </div>
              <button 
                type="button" 
                onClick={runConnectionTest}
                className="btn-secondary-action"
                style={{ padding: '2px 6px', fontSize: '10px', whiteSpace: 'nowrap' }}
              >
                진단 재시도
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Project URL</label>
              <div style={{ position: 'relative' }}>
                <Globe style={{ width: '16px', height: '16px', position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '34px', fontFamily: 'monospace', fontSize: '12px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Anon Public Key / API Key</label>
              <div style={{ position: 'relative' }}>
                <Key style={{ width: '16px', height: '16px', position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <textarea
                  required
                  rows="3"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '34px', fontFamily: 'monospace', fontSize: '12px', resize: 'none' }}
                />
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                ※ Supabase Dashboard -&gt; Project Settings -&gt; API -&gt; Project API keys 에서 <strong>anon public key</strong> (eyJ...로 시작)를 등록하셔야 연동이 정상 작동합니다.
              </span>
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-action"
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-primary-action"
              style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Server className="w-4 h-4" />}
              <span>{isSaved ? '저장됨 & 재연동 중...' : '설정 저장 & 재연동'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
