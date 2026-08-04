import React, { useState, useRef, useEffect } from 'react';
import { 
  Hash, 
  Send, 
  Plus, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Store, 
  FileText,
  Search,
  PlusCircle,
  X,
  UserPlus,
  Lock,
  Check,
  RotateCcw
} from 'lucide-react';

export default function ChatWorkspace({ 
  currentUser, 
  rooms = [], 
  currentRoomId, 
  onSelectRoom, 
  onOpenCreateRoom, 
  messages = [], 
  onSendMessage, 
  stores = [],
  users = [],
  onOpenNewStore,
  onUpdateRoomMembers
}) {
  const [inputText, setInputText] = useState('');
  const [isWorkRequestMode, setIsWorkRequestMode] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [category, setCategory] = useState('POS 메뉴추가/수정');

  // Inline Store Search State
  const [storeSearchInput, setStoreSearchInput] = useState('');
  const [hasSearchedStore, setHasSearchedStore] = useState(false);

  // Invite Member Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitedUserIds, setInvitedUserIds] = useState([]);
  const [inviteSearchQuery, setInviteSearchQuery] = useState('');

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Filter rooms that current user is invited to (ultra-robust matching)
  const visibleRooms = rooms.filter(room => {
    if (!room.members || room.members.length === 0) return true; // public room
    if (!currentUser) return true;
    const uid = (currentUser.id || '').toString().toLowerCase();
    const uname = (currentUser.name || '').toString().toLowerCase();
    const uuser = (currentUser.username || '').toString().toLowerCase();

    return room.members.some(m => {
      if (!m) return false;
      const memStr = m.toString().toLowerCase();
      return memStr === 'all' || 
             memStr === uid || 
             memStr === uname || 
             memStr === uuser ||
             (uuser && (memStr.includes(uuser) || uuser.includes(memStr))) ||
             (uname && (memStr.includes(uname) || uname.includes(memStr)));
    });
  });

  // Active room must be in visibleRooms, otherwise null (Do NOT fallback to rooms[0] of uninvited rooms)
  const activeRoom = visibleRooms.find(r => String(r.id).trim().toLowerCase() === String(currentRoomId).trim().toLowerCase()) || visibleRooms[0] || null;
  const roomMessages = activeRoom 
    ? messages.filter(m => {
        if (!m || !m.roomId) return false;
        return String(m.roomId).trim().toLowerCase() === String(activeRoom.id).trim().toLowerCase();
      }) 
    : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  // Sync invited user IDs when modal opens
  useEffect(() => {
    if (isInviteModalOpen && activeRoom) {
      setInvitedUserIds(activeRoom.members || []);
      setInviteSearchQuery('');
    }
  }, [isInviteModalOpen, activeRoom]);

  // Handle Store Search Submit
  const handleStoreSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (storeSearchInput.trim()) {
      setHasSearchedStore(true);
    }
  };

  // Filter stores matching storeSearchInput
  const searchedStoresResult = stores.filter(s => {
    if (!storeSearchInput.trim()) return true;
    const q = storeSearchInput.toLowerCase();
    return (s.storeName && s.storeName.toLowerCase().includes(q)) || 
           (s.bizNo && s.bizNo.includes(q)) || 
           (s.owner && s.owner.toLowerCase().includes(q)) || 
           (s.region && s.region.includes(q));
  });

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    if (isWorkRequestMode && !selectedStore) {
      alert('업무요청 카드를 전송하려면 먼저 대상 가맹점을 검색 후 선택해 주세요.');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return;
    }

    const newMsg = {
      id: `MSG-${Date.now()}`,
      roomId: activeRoom?.id || 'ROOM-1',
      senderId: currentUser?.username || 'user',
      senderName: currentUser?.name || '직원',
      senderDept: currentUser?.department || '영업관리팀',
      content: inputText.trim(),
      isWorkRequest: isWorkRequestMode,
      category: isWorkRequestMode ? category : null,
      storeName: isWorkRequestMode ? (selectedStore?.storeName || '가맹점') : null,
      bizNo: isWorkRequestMode ? (selectedStore?.bizNo || '') : null,
      status: isWorkRequestMode ? '신규' : null,
      createdAt: new Date().toISOString()
    };

    onSendMessage(newMsg);
    setInputText('');

    // Reset card mode automatically after card transmission
    if (isWorkRequestMode) {
      setIsWorkRequestMode(false);
      setSelectedStore(null);
      setHasSearchedStore(false);
      setStoreSearchInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Toggle Member Invitation Checkbox
  const toggleInviteUser = (userItem) => {
    const uid = userItem.id || userItem.username;
    const uname = userItem.name;
    const uuser = userItem.username;

    setInvitedUserIds(prev => {
      const isAlreadyInvited = prev.some(id => id === uid || id === uname || id === uuser);
      if (isAlreadyInvited) {
        return prev.filter(id => id !== uid && id !== uname && id !== uuser);
      } else {
        return [...prev, uid, uname, uuser].filter(Boolean);
      }
    });
  };

  // Filter users in Invite Modal by search query
  const filteredUsersToInvite = users.filter(u => {
    if (!inviteSearchQuery.trim()) return true;
    const q = inviteSearchQuery.toLowerCase();
    const uname = (u.name || '').toLowerCase();
    const uuser = (u.username || u.id || '').toLowerCase();
    const udept = (u.dept || u.department || '').toLowerCase();
    return uname.includes(q) || uuser.includes(q) || udept.includes(q);
  });

  // Save Member Invitation
  const handleSaveInvitation = () => {
    if (activeRoom && onUpdateRoomMembers) {
      onUpdateRoomMembers(activeRoom.id, invitedUserIds);
    }
    setIsInviteModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
      {/* Left Chat Rooms / Spaces Sidebar */}
      <div style={{
        width: '220px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            내 업무채팅방 ({visibleRooms.length})
          </span>
          <button 
            onClick={onOpenCreateRoom}
            className="btn-secondary-action" 
            style={{ padding: '2px 6px', fontSize: '10px' }}
            title="새 채팅방 생성"
          >
            <Plus className="w-3 h-3 text-blue-600" />
            <span>방 생성</span>
          </button>
        </div>

        {/* Room List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
          {visibleRooms.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '10px', textAlign: 'center' }}>
              초대된 채팅방이 없습니다. [+ 방 생성] 버튼을 통해 새 업무채팅방을 만들어보세요.
            </div>
          ) : (
            visibleRooms.map(room => {
              const isActive = room.id === activeRoom?.id;
              const hasMembers = room.members && room.members.length > 0;
              return (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--status-new-bg)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <Hash className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {room.name}
                  </div>
                  {hasMembers && (
                    <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" title="초대 인원 전용 스페이스" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
        {!activeRoom ? (
          /* Clean Empty View when user is not invited to any room */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '40px', backgroundColor: 'var(--bg-main)' }}>
            <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: 'var(--status-new-bg)', border: '1px solid var(--status-new-border)' }}>
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>참여 중인 업무채팅방이 없습니다</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '380px', margin: 0, lineHeight: '1.5' }}>
              현재 초대되어 참여 중인 업무채팅방이 없습니다.<br />
              좌측 <strong>[+ 방 생성]</strong> 버튼을 눌러 새 업무방을 개설하시거나, 기존 대화방 멤버에게 초대를 요청하세요.
            </p>
            <button 
              type="button"
              className="btn-primary-action"
              onClick={onOpenCreateRoom}
              style={{ marginTop: '8px', padding: '8px 16px', fontSize: '12px' }}
            >
              <Plus className="w-4 h-4" />
              <span>새 업무채팅방 만들기</span>
            </button>
          </div>
        ) : (
          <>
            {/* Room Header */}
            <div style={{
              height: '44px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              backgroundColor: 'var(--bg-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash className="w-4 h-4 text-blue-600" />
                <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>
                  {activeRoom?.name || '업무채팅방'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {activeRoom?.description || '전 직원 업무 소통 및 카드 요청 채널'}
                </span>
              </div>

              {/* Member count and Invite button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    참여 멤버: <strong>{(activeRoom?.members?.length) || users.length}명</strong>
                  </span>
                </span>
                <button 
                  type="button" 
                  className="btn-secondary-action" 
                  onClick={() => setIsInviteModalOpen(true)}
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                  title="이 채팅방에 직원 추가 초대"
                >
                  <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                  <span>멤버 초대</span>
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {roomMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  💬 첫 번째 대화 내용이나 업무 요청 카드를 남겨보세요!
                </div>
              ) : (
                roomMessages.map(msg => {
                  const isMe = msg.senderId === (currentUser?.username || 'user');
                  return (
                    <div key={msg.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      {/* User Avatar */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isMe ? 'var(--accent-primary)' : 'var(--border-color)',
                        color: isMe ? '#ffffff' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '12px',
                        flexShrink: 0
                      }}>
                        {msg.senderName ? msg.senderName[0] : '직'}
                      </div>

                      {/* Message Card */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '80%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text-primary)' }}>
                            {msg.senderName} ({msg.senderDept})
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {(() => {
                              if (!msg.createdAt) return '';
                              try {
                                const d = new Date(msg.createdAt);
                                return isNaN(d.getTime()) ? msg.createdAt : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              } catch (e) {
                                return msg.createdAt;
                              }
                            })()}
                          </span>
                        </div>

                        {/* Standard Text or Work Request Card */}
                        {msg.isWorkRequest ? (
                          <div style={{
                            backgroundColor: 'var(--status-new-bg)',
                            border: '1px solid var(--status-new-border)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '700', fontSize: '12px', color: 'var(--status-new-text)' }}>
                                📋 [{msg.category}] 업무 요청
                              </span>
                              <span className="badge-status status-new" style={{ fontSize: '10px' }}>
                                {msg.status || '신규'}
                              </span>
                            </div>
                            {msg.storeName && (
                              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                🏪 가맹점: {msg.storeName} ({msg.bizNo})
                              </div>
                            )}
                            <div style={{ fontSize: '12px', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                              {msg.content}
                            </div>
                          </div>
                        ) : (
                          <div style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            lineHeight: '1.4',
                            color: 'var(--text-primary)'
                          }}>
                            {msg.content}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom Chat Input Bar */}
            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-sidebar)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {/* Work Request Toolbar Line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  className={isWorkRequestMode ? 'btn-primary-action' : 'btn-secondary-action'}
                  onClick={() => {
                    const nextMode = !isWorkRequestMode;
                    setIsWorkRequestMode(nextMode);
                    if (!nextMode) {
                      setSelectedStore(null);
                      setHasSearchedStore(false);
                      setStoreSearchInput('');
                    }
                  }}
                  style={{ padding: '3px 8px', fontSize: '11px', whiteSpace: 'nowrap' }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isWorkRequestMode ? '✓ 업무요청 카드 작성 중' : '+ 업무요청 카드로 전송'}</span>
                </button>

                {isWorkRequestMode && (
                  <>
                    <select 
                      className="input-field" 
                      style={{ padding: '2px 6px', fontSize: '11px', width: '135px', height: '26px' }}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="POS 메뉴추가/수정">POS 메뉴추가/수정</option>
                      <option value="단말기/VAN 장애">단말기/VAN 장애</option>
                      <option value="영업/계약 변경">영업/계약 변경</option>
                      <option value="POS 기능요청">POS 기능요청</option>
                      <option value="원격 지원 요청">원격 지원 요청</option>
                      <option value="세금계산서/정산 문의">세금계산서/정산 문의</option>
                      <option value="기타 문의">기타 문의</option>
                    </select>

                    {/* Inline Store Search or Selected Store Display */}
                    {!selectedStore ? (
                      <div style={{ position: 'relative', flex: 1, minWidth: '220px', display: 'flex', gap: '4px' }}>
                        <form onSubmit={handleStoreSearchSubmit} style={{ display: 'flex', flex: 1, gap: '4px' }}>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="가맹점 검색 (매장명/사업자번호)"
                            style={{ flex: 1, fontSize: '11px', height: '26px', padding: '2px 8px' }}
                            value={storeSearchInput}
                            onChange={(e) => {
                              setStoreSearchInput(e.target.value);
                              setHasSearchedStore(false);
                            }}
                          />
                          <button 
                            type="submit" 
                            className="btn-primary-action"
                            style={{ height: '26px', padding: '0 8px', fontSize: '11px', whiteSpace: 'nowrap' }}
                          >
                            <Search className="w-3 h-3" />
                            <span>검색</span>
                          </button>
                        </form>

                        {/* Floating Overlay Search Results */}
                        {hasSearchedStore && (
                          <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: 0,
                            right: 0,
                            marginBottom: '6px',
                            maxHeight: '160px',
                            overflowY: 'auto',
                            border: '1px solid var(--accent-primary)',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-card)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                            zIndex: 200,
                            padding: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px'
                          }}>
                            {searchedStoresResult.length === 0 ? (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '8px', textAlign: 'center' }}>
                                '<strong>{storeSearchInput}</strong>' 검색 결과 없음
                              </div>
                            ) : (
                              searchedStoresResult.map(s => (
                                <div 
                                  key={s.id} 
                                  onClick={() => {
                                    setSelectedStore(s);
                                    setHasSearchedStore(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '5px 8px',
                                    backgroundColor: 'var(--bg-sidebar)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '11px'
                                  }}
                                >
                                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>{s.storeName}</strong>
                                    <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', marginLeft: '6px' }}>({s.bizNo})</span>
                                    <span style={{ color: 'var(--text-muted)', marginLeft: '6px', fontSize: '10px' }}>[{s.region}]</span>
                                  </div>
                                  <span style={{ fontSize: '10px', color: 'var(--accent-primary)', fontWeight: '700', flexShrink: 0, marginLeft: '6px' }}>
                                    선택
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Selected Store Chip */
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--status-new-bg)',
                        border: '1px solid var(--status-new-border)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        height: '26px'
                      }}>
                        <Store className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{selectedStore.storeName}</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}>({selectedStore.bizNo})</span>
                        <button 
                          type="button"
                          onClick={() => {
                            setSelectedStore(null);
                            setHasSearchedStore(false);
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 2px' }}
                          title="가맹점 변경"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Text Input Area */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <textarea 
                  ref={inputRef}
                  className="input-field"
                  rows="2"
                  placeholder={isWorkRequestMode ? "가맹점 요청 세부 내용 및 연락처 정보를 입력하세요 (Enter: 전송)" : "메세지를 입력하세요 (Enter: 전송, Shift+Enter: 줄바꿈)"}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ flex: 1, resize: 'none' }}
                />
                <button 
                  type="button" 
                  className="btn-primary-action"
                  onClick={handleSend}
                  style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}
                >
                  <Send className="w-4 h-4" />
                  <span style={{ fontSize: '10px' }}>전송</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Member Invitation Modal */}
      {isInviteModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-box" style={{ width: '440px', borderRadius: '8px' }}>
            <div className="modal-header">
              <div className="modal-title" style={{ fontSize: '13px', fontWeight: '700' }}>
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>[{activeRoom?.name}] 멤버 초대 및 관리</span>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                이 업무채팅방에 참여시킬 직원을 선택하세요. 체크된 인원만 본 채팅방을 조회하고 메시지를 주고받을 수 있습니다.
              </div>

              {/* User Search Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px' }}>
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="직원 이름, 아이디, 소속 부서 검색"
                  style={{ border: 'none', outline: 'none', fontSize: '11px', flex: 1, padding: '2px 0', background: 'transparent' }}
                  value={inviteSearchQuery}
                  onChange={(e) => setInviteSearchQuery(e.target.value)}
                />
              </div>

              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '6px',
                backgroundColor: 'var(--bg-main)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                {filteredUsersToInvite.length === 0 ? (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '12px', textAlign: 'center' }}>
                    검색어와 일치하는 직원이 없습니다.
                  </div>
                ) : (
                  filteredUsersToInvite.map(u => {
                    const uid = u.id || u.username;
                    const uname = u.name;
                    const uuser = u.username;
                    const isChecked = invitedUserIds.some(id => id === uid || id === uname || id === uuser);
                    return (
                      <label 
                        key={u.id || u.username}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 8px',
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
                          onChange={() => toggleInviteUser(u)}
                        />
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary-action" onClick={() => setIsInviteModalOpen(false)}>
                취소
              </button>
              <button type="button" className="btn-primary-action" onClick={handleSaveInvitation}>
                <Check className="w-4 h-4" />
                <span>초대 완료 및 저장</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
