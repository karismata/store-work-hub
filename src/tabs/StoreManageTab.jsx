import React, { useState } from 'react';
import { Store, Plus, Search, Edit3, MessageSquare, Info } from 'lucide-react';

export default function StoreManageTab({ 
  stores, 
  onOpenNewStore, 
  onEditStore,
  onOpenNewRequest,
  searchQuery 
}) {
  const [localSearch, setLocalSearch] = useState('');

  const effectiveSearch = searchQuery || localSearch;
  const filteredStores = stores.filter(s => {
    if (!effectiveSearch.trim()) return true;
    const q = effectiveSearch.toLowerCase();
    return s.storeName.toLowerCase().includes(q) ||
           s.bizNo.includes(q) ||
           (s.owner && s.owner.toLowerCase().includes(q)) ||
           s.region.includes(q) ||
           s.contact.includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="filter-card" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className="filter-group">
          <Store className="w-4 h-4 text-blue-500" />
          <span className="filter-label">등록된 가맹점 / 사업자 데이터베이스 ({stores.length}개)</span>
        </div>

        <div className="filter-group" style={{ marginLeft: 'auto' }}>
          <input 
            type="text" 
            className="input-field"
            placeholder="사업자번호 / 매장명 / 대표자 검색" 
            style={{ width: '240px' }}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <button className="btn-primary-action" onClick={onOpenNewStore}>
            <Plus className="w-4 h-4" />
            <span>신규 매장 등록</span>
          </button>
        </div>
      </div>

      {/* Double-click Guide Notification Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}
      >
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          💡 <strong>매장 목록 행(Row)을 더블클릭</strong>하면 이전 프로그램처럼 사업자번호, 대표자, <strong>계약 정보</strong> 및 메모 상세 모달이 열립니다.
        </span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              <th style={{ width: '130px' }}>사업자등록번호</th>
              <th style={{ width: '180px' }}>가맹점명 (매장명)</th>
              <th style={{ width: '90px' }}>대표자</th>
              <th style={{ width: '80px' }}>지역</th>
              <th style={{ width: '120px' }}>담당자 휴대폰</th>
              <th style={{ width: '110px' }}>일반전화</th>
              <th style={{ width: '140px' }}>계약 / 단말기 환경</th>
              <th>주소 / 메모</th>
              <th style={{ width: '130px', textAlign: 'center' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  검색 조건에 해당되는 가맹점이 없습니다.
                </td>
              </tr>
            ) : (
              filteredStores.map((s, idx) => (
                <tr 
                  key={s.id}
                  onDoubleClick={() => onEditStore(s)}
                  style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                  title="더블클릭하여 매장 정보 및 계약 상세 보기"
                >
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '700', color: 'var(--accent-primary)' }}>
                    {s.bizNo}
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    {s.storeName}
                  </td>
                  <td style={{ fontWeight: '500' }}>{s.owner || '-'}</td>
                  <td>{s.region}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{s.contact}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{s.tel || '-'}</td>
                  <td style={{ fontSize: '11px' }}>
                    <div style={{ fontWeight: '600' }}>{s.posType || 'OKPOS'}</div>
                    {s.contractStatus && (
                      <div style={{ fontSize: '10px', color: 'var(--accent-secondary)' }}>{s.contractStatus}</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {s.address}
                      {s.memo && <span style={{ color: 'var(--accent-primary)', marginLeft: '6px', fontWeight: '500' }}>({s.memo})</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button 
                        className="btn-secondary-action"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditStore(s);
                        }}
                        title="매장 상세 / 계약 정보 수정"
                      >
                        상세/수정
                      </button>
                      <button 
                        className="btn-primary-action"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenNewRequest(s.id);
                        }}
                        title="이 매장으로 업무요청 작성"
                      >
                        요청
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
