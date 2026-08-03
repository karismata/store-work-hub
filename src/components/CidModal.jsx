import React from 'react';
import { X, PhoneIncoming, PhoneCall, PlusCircle, CheckCircle } from 'lucide-react';

export default function CidModal({ isOpen, onClose, onQuickRequestFromCid }) {
  if (!isOpen) return null;

  const mockCidLogs = [
    { id: 1, phone: '010-7776-9476', storeName: '(주)루미호스피털 종로점', time: '11:35:12', status: '수신완료' },
    { id: 2, phone: '010-3321-8842', storeName: '한주커피 강남본점', time: '10:50:04', status: '수신완료' },
    { id: 3, phone: '02-468-9900', storeName: '성수 버거클럽', time: '09:15:30', status: '부재중' },
    { id: 4, phone: '010-5544-3322', storeName: '홍대 야키토리 하나', time: '08:40:19', status: '수신완료' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '650px' }}>
        <div className="modal-header">
          <div className="modal-title text-emerald-400">
            <PhoneIncoming className="w-5 h-5 text-emerald-400" />
            <span>CID 실시간 전화 수신 내역</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-main)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            🟢 <b>CID 서버 상태:</b> 정상 작동 중 (Port: 8080) | 수신된 전화를 클릭하여 즉시 <b>업무 요청 등록</b>으로 전달할 수 있습니다.
          </div>

          <div className="table-container" style={{ marginTop: '10px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>수신 시각</th>
                  <th>발신 전화번호</th>
                  <th>연동 가맹점명</th>
                  <th style={{ textAlign: 'center' }}>수신 상태</th>
                  <th style={{ textAlign: 'center' }}>동작</th>
                </tr>
              </thead>
              <tbody>
                {mockCidLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>{log.time}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: 'var(--accent-primary)' }}>{log.phone}</td>
                    <td style={{ fontWeight: '600' }}>{log.storeName}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-pill ${log.status === '수신완료' ? '완료' : '취소'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-reply-action"
                        onClick={() => {
                          onClose();
                          onQuickRequestFromCid(log);
                        }}
                      >
                        업무연락 작성
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary-action" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
