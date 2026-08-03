import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function WorkInboxTab({ 
  requests, 
  onOpenDetail, 
  searchQuery
}) {
  const [startDate, setStartDate] = useState('2026-07-23');
  const [endDate, setEndDate] = useState('2026-07-23');
  const [confirmFilter, setConfirmFilter] = useState('전체');
  const [senderFilter, setSenderFilter] = useState('전체');
  
  // Status checkbox state
  const [statusFilters, setStatusFilters] = useState({
    신규: true,
    진행중: true,
    완료: true,
    취소: false,
    보류: true
  });

  const toggleStatusFilter = (st) => {
    setStatusFilters(prev => ({ ...prev, [st]: !prev[st] }));
  };

  // Filter logic
  const filteredRequests = requests.filter(req => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = req.storeName.toLowerCase().includes(q) ||
                    req.bizNo.includes(q) ||
                    req.content.toLowerCase().includes(q) ||
                    req.region.includes(q);
      if (!match) return false;
    }

    // Status filter
    if (!statusFilters[req.status]) return false;

    // Confirm filter
    if (confirmFilter === '확인' && !req.isConfirmed) return false;
    if (confirmFilter === '미확인' && req.isConfirmed) return false;

    return true;
  });

  const getStatusClass = (st) => {
    if (st === '신규') return 'badge-status status-new';
    if (st === '진행중') return 'badge-status status-process';
    if (st === '완료') return 'badge-status status-done';
    return 'badge-status status-new';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Compact Filter Bar */}
      <div className="filter-card">
        <div className="filter-group">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span className="filter-label">일자:</span>
          <input 
            type="date" 
            className="input-field" 
            style={{ width: '120px', padding: '2px 6px', fontSize: '11px' }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)' }}>~</span>
          <input 
            type="date" 
            className="input-field" 
            style={{ width: '120px', padding: '2px 6px', fontSize: '11px' }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 6px' }}></div>

          <span className="filter-label">확인:</span>
          <select 
            className="input-field" 
            style={{ width: '70px', padding: '2px 4px', fontSize: '11px' }}
            value={confirmFilter}
            onChange={(e) => setConfirmFilter(e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="확인">확인</option>
            <option value="미확인">미확인</option>
          </select>

          <span className="filter-label" style={{ marginLeft: '6px' }}>보낸이:</span>
          <select 
            className="input-field" 
            style={{ width: '90px', padding: '2px 4px', fontSize: '11px' }}
            value={senderFilter}
            onChange={(e) => setSenderFilter(e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="karis02">karis02</option>
            <option value="olive_admin">olive_admin</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">상태:</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {Object.keys(statusFilters).map((st) => (
              <label key={st} className="checkbox-item">
                <input 
                  type="checkbox" 
                  checked={statusFilters[st]} 
                  onChange={() => toggleStatusFilter(st)} 
                />
                <span>{st}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Ultra Compact High-Density Grid Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '30px', textAlign: 'center' }}>#</th>
              <th style={{ width: '50px', textAlign: 'center' }}>답장</th>
              <th style={{ width: '60px', textAlign: 'center' }}>상태</th>
              <th style={{ width: '110px' }}>사업자번호</th>
              <th style={{ width: '70px' }}>지역</th>
              <th style={{ width: '160px' }}>가맹점명</th>
              <th>내용</th>
              <th style={{ width: '120px' }}>작성자</th>
              <th style={{ width: '110px' }}>연락처</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  조회된 업무연락 내역이 없습니다.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req, idx) => (
                <tr key={req.id} onDoubleClick={() => onOpenDetail(req)} style={{ cursor: 'pointer' }}>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn-secondary-action"
                      style={{ padding: '1px 6px', fontSize: '10px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetail(req);
                      }}
                    >
                      답장
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={getStatusClass(req.status)}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                    {req.bizNo}
                  </td>
                  <td>{req.region}</td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {req.storeName}
                  </td>
                  <td>
                    <div style={{
                      maxWidth: '400px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '11px'
                    }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: '600', marginRight: '4px' }}>
                        [{req.category}]
                      </span>
                      {req.content}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {req.sender || `${req.authorName || '직원'} (${req.authorUserId || 'user'})`}
                  </td>
                  <td>{req.contact}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
