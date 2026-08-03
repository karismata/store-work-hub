import React from 'react';
import { BarChart3, Users, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function WorkStatusTab({ requests, teams }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {teams.map((t) => {
          const teamReqs = requests.filter(r => r.targetTeam === t.name);
          const newCount = teamReqs.filter(r => r.status === '신규').length;
          const processCount = teamReqs.filter(r => r.status === '진행중').length;
          const doneCount = teamReqs.filter(r => r.status === '완료').length;

          return (
            <div key={t.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '15px' }}>{t.name}</span>
                <span style={{ fontSize: '11px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                  총 {teamReqs.length}건
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                <div style={{ background: 'var(--status-new-bg)', padding: '8px 4px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--status-new-text)' }}>신규</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--status-new-text)' }}>{newCount}</div>
                </div>
                <div style={{ background: 'var(--status-process-bg)', padding: '8px 4px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--status-process-text)' }}>진행중</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--status-process-text)' }}>{processCount}</div>
                </div>
                <div style={{ background: 'var(--status-done-bg)', padding: '8px 4px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--status-done-text)' }}>완료</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--status-done-text)' }}>{doneCount}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Team workload list */}
      <div className="table-container">
        <div style={{ padding: '12px 16px', fontWeight: '700', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>팀별 업무 처리 현황 데이터 리포트</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>담당 팀명</th>
              <th style={{ textAlign: 'center' }}>총 요청 건수</th>
              <th style={{ textAlign: 'center' }}>대기 (신규)</th>
              <th style={{ textAlign: 'center' }}>처리 중</th>
              <th style={{ textAlign: 'center' }}>처리 완료</th>
              <th style={{ textAlign: 'center' }}>완료율 (%)</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(t => {
              const teamReqs = requests.filter(r => r.targetTeam === t.name);
              const doneCount = teamReqs.filter(r => r.status === '완료').length;
              const rate = teamReqs.length > 0 ? Math.round((doneCount / teamReqs.length) * 100) : 100;
              return (
                <tr key={t.id}>
                  <td style={{ fontWeight: '600' }}>{t.name}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono' }}>{teamReqs.length}</td>
                  <td style={{ textAlign: 'center', color: 'var(--status-new-text)', fontWeight: '700' }}>
                    {teamReqs.filter(r => r.status === '신규').length}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--status-process-text)', fontWeight: '700' }}>
                    {teamReqs.filter(r => r.status === '진행중').length}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--status-done-text)', fontWeight: '700' }}>
                    {doneCount}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${rate}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '600' }}>{rate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
