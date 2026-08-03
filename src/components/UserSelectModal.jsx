import React, { useState } from 'react';
import { X, CheckSquare, Users } from 'lucide-react';

export default function UserSelectModal({ isOpen, onClose, departments, users, onConfirmSelection }) {
  const [selectedItems, setSelectedItems] = useState([]);

  if (!isOpen) return null;

  // Toggle single item (dept or user)
  const toggleItem = (name) => {
    setSelectedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  // Toggle department and all its users
  const toggleDeptWithUsers = (deptName) => {
    const deptUsers = users.filter(u => u.dept === deptName).map(u => u.name);
    const isDeptSelected = selectedItems.includes(deptName);

    if (isDeptSelected) {
      // Remove dept and its users
      setSelectedItems(prev => prev.filter(i => i !== deptName && !deptUsers.includes(i)));
    } else {
      // Add dept and its users
      setSelectedItems(prev => Array.from(new Set([...prev, deptName, ...deptUsers])));
    }
  };

  const handleConfirm = () => {
    if (selectedItems.length === 0) {
      alert("수신할 부서 또는 사용자를 최소 1개 이상 선택하세요.");
      return;
    }
    onConfirmSelection(selectedItems.join(', '));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '480px', maxHeight: '85vh' }}>
        <div className="modal-header" style={{ padding: '12px 16px', background: '#2563eb', color: 'white' }}>
          <div className="modal-title" style={{ fontSize: '15px', color: 'white' }}>
            <Users className="w-4 h-4" />
            <span>사용자/부서 선택</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '0', overflowY: 'auto' }}>
          <table className="data-table" style={{ fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#3b82f6', color: 'white' }}>
                <th style={{ width: '45px', textAlign: 'center' }}>선택</th>
                <th style={{ width: '150px' }}>부서</th>
                <th>이름</th>
                <th style={{ width: '60px', textAlign: 'center' }}>구분</th>
                <th style={{ width: '60px', textAlign: 'center' }}>재직</th>
              </tr>
            </thead>
            <tbody>
              {/* Row for Entire (전체) */}
              <tr style={{ background: 'var(--bg-card-hover)', fontWeight: '700' }}>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes('전체')}
                    onChange={() => toggleItem('전체')}
                  />
                </td>
                <td colSpan="4" style={{ color: 'var(--accent-primary)' }}>전체 (전직원 전송)</td>
              </tr>

              {/* Department groups and their users */}
              {departments.map((dept) => {
                const deptUsers = users.filter(u => u.dept === dept.name);
                const isDeptChecked = selectedItems.includes(dept.name);

                return (
                  <React.Fragment key={dept.id}>
                    {/* Department Row */}
                    <tr style={{ background: 'var(--bg-main)', fontWeight: '600' }}>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={isDeptChecked}
                          onChange={() => toggleDeptWithUsers(dept.name)}
                        />
                      </td>
                      <td colSpan="4" style={{ color: 'var(--text-primary)' }}>
                        {dept.name} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({deptUsers.length}명)</span>
                      </td>
                    </tr>

                    {/* Member Rows under this Department */}
                    {deptUsers.map((u) => {
                      const isUserChecked = selectedItems.includes(u.name);
                      return (
                        <tr key={u.id}>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={isUserChecked}
                              onChange={() => toggleItem(u.name)}
                            />
                          </td>
                          <td style={{ paddingLeft: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
                            {u.dept}
                          </td>
                          <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                            {u.name}
                          </td>
                          <td style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {u.role}
                          </td>
                          <td style={{ textAlign: 'center', fontSize: '12px', color: 'var(--status-done-text)' }}>
                            {u.status}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center', gap: '16px', background: 'var(--bg-main)', padding: '10px' }}>
          <button 
            type="button" 
            className="btn-primary-action" 
            style={{ width: '100px', justifyContent: 'center' }}
            onClick={handleConfirm}
          >
            선택
          </button>
          <button 
            type="button" 
            className="btn-secondary-action" 
            style={{ width: '100px', justifyContent: 'center' }}
            onClick={onClose}
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
}
