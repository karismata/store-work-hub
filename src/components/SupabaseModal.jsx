import React, { useState } from 'react';
import { Database, Key, Globe, Check, X, Server } from 'lucide-react';
import { getSupabaseConfig, setSupabaseConfig } from '../lib/supabase';

export default function SupabaseModal({ isOpen, onClose }) {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [isSaved, setIsSaved] = useState(false);

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
            <div style={{
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              color: 'var(--text-primary)',
              fontSize: '12px',
              lineHeight: '1.5'
            }}>
              ✅ 현재 <b>Supabase Cloud 클라우드 데이터베이스</b>가 연결되어 있습니다. 모든 직원 PC에서 동일한 데이터가 실시간 동기화됩니다.
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
              <label className="form-label">Anon Public / Publishable Key</label>
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
