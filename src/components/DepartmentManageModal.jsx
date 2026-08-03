import React, { useState } from 'react';
import { X, Plus, Trash2, Users, Building, Save } from 'lucide-react';

export default function DepartmentManageModal({ 
  isOpen, 
  onClose, 
  departments, 
  users, 
  onAddDepartment,
  onAddUser,
  onDeleteDepartment,
  onDeleteUser
}) {
  const [activeTab, setActiveTab] = useState('users'); // users, depts
  
  // New Dept Form
  const [newDeptName, setNewDeptName] = useState('');

  // New User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserDept, setNewUserDept] = useState(departments[0]?.name || '');
  const [newUserRole, setNewUserRole] = useState('사용자');

  if (!isOpen) return null;

  const handleCreateDept = (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    onAddDepartment({
      id: `DEP-${Date.now().toString().slice(-4)}`,
      name: newDeptName.trim()
    });
    setNewDeptName('');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    onAddUser({
      id: `U-${Date.now().toString().slice(-4)}`,
      name: newUserName.trim(),
      dept: newUserDept || departments[0]?.name,
      role: newUserRole,
      status: '재직'
    });
    setNewUserName('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '650px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>조직도 부서 및 직급/부서원 관리</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          {/* Sub tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <button 
              className={`btn-secondary-action ${activeTab === 'users' ? 'btn-primary-action' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4" />
              <span>부서원 목록 & 등록 ({users.length}명)</span>
            </button>

            <button 
              className={`btn-secondary-action ${activeTab === 'depts' ? 'btn-primary-action' : ''}`}
              onClick={() => setActiveTab('depts')}
            >
              <Building className="w-4 h-4" />
              <span>부서 목록 & 등록 ({departments.length}개)</span>
            </button>
          </div>

          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Add User Form */}
              <form onSubmit={handleCreateUser} style={{ display: 'flex', gap: '8px', background: 'var(--bg-main)', padding: '10px', borderRadius: '6px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="직원 성명 (예: 김철수)"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={{ flex: 1 }}
                  required
                />
                <select 
                  className="input-field" 
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  style={{ width: '150px' }}
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <select 
                  className="input-field"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  style={{ width: '100px' }}
                >
                  <option value="사용자">사용자</option>
                  <option value="어드민">어드민</option>
                  <option value="팀장">팀장</option>
                </select>
                <button type="submit" className="btn-primary-action">
                  <Plus className="w-4 h-4" />
                  <span>추가</span>
                </button>
              </form>

              {/* User List Grid */}
              <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>이름</th>
                      <th>소속 부서</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>구분</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>상태</th>
                      <th style={{ width: '60px', textAlign: 'center' }}>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: '700' }}>{u.name}</td>
                        <td style={{ color: 'var(--accent-primary)' }}>{u.dept}</td>
                        <td style={{ textAlign: 'center', fontSize: '12px' }}>{u.role}</td>
                        <td style={{ textAlign: 'center', fontSize: '12px', color: 'var(--status-done-text)' }}>{u.status}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            onClick={() => onDeleteUser(u.id)}
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'depts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Add Dept Form */}
              <form onSubmit={handleCreateDept} style={{ display: 'flex', gap: '8px', background: 'var(--bg-main)', padding: '10px', borderRadius: '6px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="신규 부서명 (예: 14-기술지원팀)"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  style={{ flex: 1 }}
                  required
                />
                <button type="submit" className="btn-primary-action">
                  <Plus className="w-4 h-4" />
                  <span>부서 추가</span>
                </button>
              </form>

              {/* Dept List Grid */}
              <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>부서 코드/명칭</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>소속 인원</th>
                      <th style={{ width: '60px', textAlign: 'center' }}>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map(d => {
                      const count = users.filter(u => u.dept === d.name).length;
                      return (
                        <tr key={d.id}>
                          <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{d.name}</td>
                          <td style={{ textAlign: 'center', color: 'var(--accent-primary)', fontWeight: '600' }}>{count}명</td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                              onClick={() => onDeleteDepartment(d.id)}
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
