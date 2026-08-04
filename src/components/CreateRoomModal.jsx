import React, { useState } from 'react';
import { X, Hash, Users, PlusCircle, Search } from 'lucide-react';

export default function CreateRoomModal({ isOpen, onClose, users = [], currentUser, onCreateRoom }) {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const toggleUserSelection = (userItem) => {
    const uid = userItem.id || userItem.username;
    const uname = userItem.name;
    const uuser = userItem.username;

    setSelectedUsers(prev => {
      const isSelected = prev.some(id => id === uid || id === uname || id === uuser);
      if (isSelected) {
        return prev.filter(id => id !== uid && id !== uname && id !== uuser);
      } else {
        return [...prev, uid, uname, uuser].filter(Boolean);
      }
    });
  };

  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const uname = (u.name || '').toLowerCase();
    const uuser = (u.username || u.id || '').toLowerCase();
    const udept = (u.dept || u.department || '').toLowerCase();
    return uname.includes(q) || uuser.includes(q) || udept.includes(q);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      alert("채팅방 이름을 입력하세요.");
      return;
    }

    // Automatically include room creator (and 'all' for public room if no specific members selected)
    const creatorKeys = [currentUser?.id, currentUser?.username, currentUser?.name].filter(Boolean);
    const finalMembers = selectedUsers.length > 0 
      ? Array.from(new Set([...selectedUsers, ...creatorKeys]))
      : ['all', ...creatorKeys];

    const newRoom = {
      id: `ROOM-${Date.now()}`,
      name: roomName.trim(),
      description: description.trim(),
      members: finalMembers,
      createdAt: new Date().toISOString()
    };

    onCreateRoom(newRoom);
    setRoomName('');
    setDescription('');
    setSelectedUsers([]);
    setSearchQuery('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '440px', borderRadius: '10px' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ fontSize: '14px', fontWeight: '700' }}>
            <Hash className="w-4 h-4 text-blue-600" />
            <span>새 업무채팅방 생성</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>채팅방 이름 *</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="예: 02-영업관리팀 업무 소통방"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>채팅방 설명 (선택)</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="예: 가맹점 POS 장애 및 메뉴 수정 업무 채널"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>초대할 멤버 선택 ({selectedUsers.length}개 항목)</span>
              </span>
            </label>

            {/* Member Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px', marginBottom: '6px' }}>
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input 
                type="text" 
                className="input-field" 
                placeholder="직원 이름, 아이디, 소속 부서 검색"
                style={{ border: 'none', outline: 'none', fontSize: '11px', flex: 1, padding: '2px 0', background: 'transparent' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{
              maxHeight: '150px',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-main)',
              padding: '6px'
            }}>
              {filteredUsers.length === 0 ? (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '10px', textAlign: 'center' }}>
                  검색어와 일치하는 직원이 없습니다.
                </div>
              ) : (
                filteredUsers.map(u => {
                  const uid = u.id || u.username;
                  const uname = u.name;
                  const uuser = u.username;
                  const isChecked = selectedUsers.some(id => id === uid || id === uname || id === uuser);
                  return (
                    <label 
                      key={u.id || u.username} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '5px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        backgroundColor: isChecked ? 'var(--status-new-bg)' : 'transparent'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{u.name}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>({u.username || u.id})</span>
                        <span style={{ color: 'var(--accent-primary)', marginLeft: '6px', fontSize: '10px' }}>[{u.dept || u.department}]</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => toggleUserSelection(u)}
                      />
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '8px 0 0 0', background: 'transparent', border: 'none' }}>
            <button type="button" className="btn-secondary-action" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn-primary-action">
              <PlusCircle className="w-4 h-4" />
              <span>채팅방 만들기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
