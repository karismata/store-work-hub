import React from 'react';
import { Send, Clock, CheckCircle } from 'lucide-react';

export default function WorkSentTab({ requests, onOpenDetail }) {
  // Show requests sent by current logged in user or outbound
  const sentRequests = requests;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="filter-card">
        <div className="filter-group">
          <Send className="w-4 h-4 text-indigo-400" />
          <span className="filter-label">내가 발신한 업무 요청 목록</span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              <th style={{ width: '100px' }}>수신 팀</th>
              <th style={{ width: '80px', textAlign: 'center' }}>상태</th>
              <th style={{ width: '120px' }}>사업자번호</th>
              <th style={{ width: '180px' }}>가맹점명</th>
              <th>요청 내용</th>
              <th style={{ width: '140px' }}>발신 시각</th>
              <th style={{ width: '160px' }}>처리결과 메모</th>
            </tr>
          </thead>
          <tbody>
            {sentRequests.map((req, idx) => (
              <tr key={req.id} onClick={() => onOpenDetail(req)} style={{ cursor: 'pointer' }}>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                <td style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{req.targetTeam}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`status-pill ${req.status}`}>{req.status}</span>
                </td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>{req.bizNo}</td>
                <td style={{ fontWeight: '600' }}>{req.storeName}</td>
                <td>
                  <div style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    [{req.category}] {req.content}
                  </div>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{req.createdAt}</td>
                <td style={{ fontSize: '12px', color: 'var(--status-done-text)' }}>
                  {req.processNote || '담당자 확인 중'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
