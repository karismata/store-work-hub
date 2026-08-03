import React, { useState } from 'react';
import { X, Send, Users, RotateCcw, UserCheck } from 'lucide-react';

export default function WorkRequestModal({ 
  isOpen, 
  onClose, 
  stores, 
  categories, 
  currentUser,
  onSubmitRequest,
  onOpenUserSelectModal
}) {
  const [recipient, setRecipient] = useState('02-영업관리팀');
  const [sendToSelf, setSendToSelf] = useState(false);
  const [sendSms, setSendSms] = useState(false);

  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || '');
  const [executionDate, setExecutionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [addToWorkLog, setAddToWorkLog] = useState(false);

  const [contact, setContact] = useState(stores[0]?.contact || '010-7776-9476');
  const [category, setCategory] = useState(categories[0] || 'POS 메뉴추가/수정');
  const [content, setContent] = useState('');
  const [includeOriginal, setIncludeOriginal] = useState(true);

  if (!isOpen) return null;

  const currentStore = stores.find(s => s.id === selectedStoreId) || stores[0];

  const handleReset = () => {
    setRecipient('02-영업관리팀');
    setSendToSelf(false);
    setSendSms(false);
    setSelectedStoreId(stores[0]?.id || '');
    setExecutionDate(new Date().toISOString().split('T')[0]);
    setAddToWorkLog(false);
    setContact(stores[0]?.contact || '');
    setContent('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipient.trim()) {
      alert("받는 사람(수신자/부서)을 선택하거나 입력하세요.");
      return;
    }
    if (!content.trim()) {
      alert("업무연락 내용을 입력하세요.");
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

    const authorName = currentUser ? currentUser.name : '미인증사용자';
    const authorUserId = currentUser ? currentUser.username : 'guest';
    const authorId = currentUser ? currentUser.id : 'U-GUEST';

    const newReq = {
      id: `REQ-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(100+Math.random()*900)}`,
      storeId: currentStore ? currentStore.id : 'ST-NEW',
      bizNo: currentStore ? currentStore.bizNo : '미등록',
      region: currentStore ? currentStore.region : '종로구',
      storeName: currentStore ? currentStore.storeName : '신규 매장',
      category: category,
      content: content,
      contact: contact || (currentStore ? currentStore.contact : ''),
      status: '신규',
      targetTeam: recipient,
      sender: `${authorName} (${authorUserId})`,
      authorName: authorName,
      authorUserId: authorUserId,
      authorId: authorId,
      createdAt: formattedDate,
      updatedAt: formattedDate,
      executionDate: executionDate,
      sendSms: sendSms,
      images: [],
      imageCount: 0,
      priority: '보통',
      isConfirmed: false,
      processNote: '',
      processedBy: ''
    };

    onSubmitRequest(newReq);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '620px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Send className="w-5 h-5 text-cyan-400" />
            <span>업무연락 작성 및 전송</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Logged in author info pill */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '13px',
              color: '#93c5fd',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span><b>작성자(보내는 사람):</b> {currentUser ? `${currentUser.name} (${currentUser.username})` : '비로그인 사용자'}</span>
              </div>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Supabase 자동 기록</span>
            </div>

            {/* Help Guidance Box */}
            <div style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '10px 12px',
              fontSize: '12px',
              color: '#38bdf8',
              lineHeight: '1.5'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
                💡 <b>도움말</b>
              </div>
              <ol style={{ paddingLeft: '16px', margin: 0 }}>
                <li>여러 명에게 보낼 때는 콤마(,)로 구분해 주세요. 예) 홍길동,김선달</li>
                <li>부서명을 입력하면, 부서원 전체에게 전송합니다. 예) 홍길동,영업관리</li>
                <li>전체를 입력하면, 전직원에게 전송합니다. 예) 전체</li>
              </ol>
            </div>

            {/* Recipient Row */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn-primary-action"
                  onClick={onOpenUserSelectModal}
                  style={{ width: '120px', padding: '6px 10px', fontSize: '12px' }}
                >
                  <Users className="w-4 h-4" />
                  <span>수신자선택</span>
                </button>

                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="수신 부서 또는 이름 (예: 02-영업관리팀, 한정훈)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  style={{ flex: 1 }}
                  required
                />

                <label className="checkbox-item" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                  <input 
                    type="checkbox" 
                    checked={sendToSelf}
                    onChange={(e) => setSendToSelf(e.target.checked)}
                  />
                  <span>내게보내기</span>
                </label>

                <label className="checkbox-item" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                  <input 
                    type="checkbox" 
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                  />
                  <span>SMS 동시전송</span>
                </label>
              </div>
            </div>

            {/* Store Selection Row */}
            <div className="form-group">
              <label className="form-label">가맹점 정보</label>
              <select 
                className="input-field"
                value={selectedStoreId}
                onChange={(e) => {
                  setSelectedStoreId(e.target.value);
                  const st = stores.find(s => s.id === e.target.value);
                  if (st) setContact(st.contact);
                }}
              >
                {stores.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.bizNo}] {s.storeName} ({s.region}) - {s.contact}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Add to WorkLog */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">실행 예정 일자</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={executionDate}
                    onChange={(e) => setExecutionDate(e.target.value)}
                  />
                  <label className="checkbox-item" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                    <input 
                      type="checkbox" 
                      checked={addToWorkLog}
                      onChange={(e) => setAddToWorkLog(e.target.checked)}
                    />
                    <span>업무일지계획추가</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">연락처</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="010-XXXX-XXXX"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="form-group">
              <label className="form-label">업무 분류</label>
              <select 
                className="input-field" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Content Textarea */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">내용 *</label>
                <label className="checkbox-item" style={{ fontSize: '12px' }}>
                  <input 
                    type="checkbox" 
                    checked={includeOriginal}
                    onChange={(e) => setIncludeOriginal(e.target.checked)}
                  />
                  <span>원문포함</span>
                </label>
              </div>
              <textarea 
                className="input-field" 
                rows="5" 
                placeholder="전송할 업무 내용 및 전달사항을 입력하세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'center', gap: '16px' }}>
            <button 
              type="button" 
              className="btn-secondary-action"
              onClick={handleReset}
              style={{ width: '100px', justifyContent: 'center' }}
            >
              <RotateCcw className="w-4 h-4" />
              <span>초기화</span>
            </button>

            <button 
              type="submit" 
              className="btn-primary-action"
              style={{ width: '110px', justifyContent: 'center', background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}
            >
              <Send className="w-4 h-4" />
              <span>전송</span>
            </button>

            <button 
              type="button" 
              className="btn-secondary-action" 
              onClick={onClose}
              style={{ width: '100px', justifyContent: 'center' }}
            >
              <span>CLOSE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
