import React, { useState, useEffect } from 'react';
import { X, Save, Clock, History } from 'lucide-react';

export default function RequestDetailModal({ 
  isOpen, 
  onClose, 
  request, 
  stores = [], 
  allRequests = [],
  onSaveRequest, 
  onOpenImageGallery,
  onViewStoreDetail
}) {
  if (!isOpen || !request) return null;

  const [status, setStatus] = useState(request.status || '신규');
  const [processNote, setProcessNote] = useState(request.processNote || '');
  const [processedBy, setProcessedBy] = useState(request.processedBy || 'POS지원팀 김담당');

  useEffect(() => {
    if (request) {
      setStatus(request.status || '신규');
      setProcessNote(request.processNote || '');
      setProcessedBy(request.processedBy || 'POS지원팀 김담당');
    }
  }, [request]);

  const storeInfo = stores.find(s => s.bizNo === request.bizNo || s.storeName === request.storeName) || {
    storeName: request.storeName,
    bizNo: request.bizNo,
    region: request.region,
    contact: request.contact || '010-0000-0000',
    address: '서울특별시 종로구 종로 123'
  };

  // Chronological consultation history for this store
  const storeHistory = allRequests
    .filter(r => (r.bizNo && r.bizNo === request.bizNo) || (r.storeName && r.storeName === request.storeName))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const handleSave = () => {
    const updated = {
      ...request,
      status: status,
      processNote: processNote,
      processedBy: processedBy,
      isConfirmed: true,
      updatedAt: new Date().toLocaleString()
    };
    onSaveRequest(updated);
    onClose();
  };

  const getStatusClass = (st) => {
    if (st === '신규') return 'badge-status status-new';
    if (st === '진행중') return 'badge-status status-process';
    if (st === '완료') return 'badge-status status-done';
    return 'badge-status status-new';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '760px', borderRadius: '10px' }}>
        {/* Clean Header */}
        <div className="modal-header">
          <div className="modal-title" style={{ fontSize: '14px', fontWeight: '700' }}>
            <span>업무 요청 상세 및 처리 등록 [{request.id}]</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 1. Ultra-Clean Store Information Box (매장명, 사업자번호, 연락처, 주소) */}
          <div style={{
            backgroundColor: 'var(--bg-sidebar)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>
                  {storeInfo.storeName || request.storeName}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  (사업자번호: {storeInfo.bizNo || request.bizNo})
                </span>
                {onViewStoreDetail && (
                  <button 
                    type="button"
                    className="btn-secondary-action"
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                    onClick={() => onViewStoreDetail(storeInfo)}
                    title="매장 상세 정보 및 계약 정보 조회"
                  >
                    매장상세/계약정보
                  </button>
                )}
              </div>
              <span className={getStatusClass(status)} style={{ fontSize: '11px', padding: '3px 8px' }}>
                {status}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border-color-light)',
              paddingTop: '8px',
              marginTop: '2px'
            }}>
              <div><b>연락처:</b> {storeInfo.contact || request.contact || '미등록'}</div>
              <div><b>주소:</b> {storeInfo.address || `${request.region} 대표 소재지`}</div>
            </div>
          </div>

          {/* 2. Current Request Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span><b>요청자:</b> {request.sender || request.authorName} | <b>수신팀:</b> {request.targetTeam}</span>
              <span><b>요청시각:</b> {request.createdAt}</span>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '12px',
              lineHeight: '1.5',
              color: 'var(--text-primary)'
            }}>
              <div style={{ color: 'var(--accent-primary)', fontWeight: '700', marginBottom: '4px' }}>
                [{request.category}]
              </div>
              {request.content}
            </div>
          </div>

          {/* Attachment Images */}
          {request.images && request.images.length > 0 && (
            <div className="form-group">
              <label className="form-label">첨부 이미지 ({request.images.length}장)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {request.images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => onOpenImageGallery(img)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <img src={img} alt="첨부 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Chronological Consultation & Work History (이전 상담 및 처리 이력 - 날짜 시간 순) */}
          <div style={{ marginTop: '4px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '6px'
            }}>
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>해당 매장 이전 상담 & 업무 이력 ({storeHistory.length}건)</span>
            </div>

            <div style={{
              maxHeight: '160px',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-main)',
              padding: '6px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {storeHistory.length === 0 ? (
                <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                  이전 상담 이력이 없습니다.
                </div>
              ) : (
                storeHistory.map((h, i) => (
                  <div 
                    key={h.id || i} 
                    style={{
                      padding: '6px 8px',
                      borderRadius: '4px',
                      backgroundColor: h.id === request.id ? 'var(--status-new-bg)' : 'var(--bg-sidebar)',
                      border: '1px solid var(--border-color)',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>
                        [{h.category}] <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>({h.sender})</span>
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={getStatusClass(h.status)} style={{ fontSize: '9px', padding: '1px 5px' }}>{h.status}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}><Clock className="w-3 h-3 inline mr-1" />{h.createdAt}</span>
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>
                      {h.content}
                    </div>
                    {h.processNote && (
                      <div style={{
                        marginTop: '3px',
                        padding: '4px 6px',
                        backgroundColor: 'var(--bg-main)',
                        borderRadius: '4px',
                        color: 'var(--status-done-text)',
                        fontSize: '10px',
                        borderLeft: '3px solid var(--status-done-border)'
                      }}>
                        <b>답변/처리내역:</b> {h.processNote}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.6, margin: '2px 0' }} />

          {/* 4. Process & Status Change Reply Section */}
          <div className="form-group">
            <label className="form-label">처리 상태 변경 *</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['신규', '진행중', '완료', '보류', '취소'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    border: status === st ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: status === st ? 'var(--status-' + (st === '신규' ? 'new' : st === '진행중' ? 'process' : st === '완료' ? 'done' : st === '취소' ? 'cancel' : 'hold') + '-bg)' : 'var(--bg-main)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">처리 내역 및 답변 메모</label>
            <textarea
              className="input-field"
              rows="3"
              placeholder="예: 가맹점 조치 완료. 사이드 메뉴 가격 및 신규 탭 세팅 완료 후 POS 재부팅 안내함."
              value={processNote}
              onChange={(e) => setProcessNote(e.target.value)}
              style={{ fontSize: '11px', lineHeight: '1.4' }}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary-action" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="btn-primary-action" onClick={handleSave}>
            <Save className="w-3.5 h-3.5" />
            <span>처리 내역 및 상태 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
}
