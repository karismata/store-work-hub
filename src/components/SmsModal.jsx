import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

export default function SmsModal({ isOpen, onClose }) {
  const [receiver, setReceiver] = useState('010-7776-9476');
  const [msg, setMsg] = useState('[한주정보통신] 요청하신 POS 메뉴 추가건 처리가 완료되었습니다.');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    alert(`[SMS 전송 완료]\n수신번호: ${receiver}\n내용: ${msg}`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '500px' }}>
        <div className="modal-header">
          <div className="modal-title text-amber-400">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>가맹점 SMS 전송 서비스</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">수신자 번호</label>
              <input 
                type="text" 
                className="input-field" 
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">문자 메시지 내용</label>
              <textarea 
                className="input-field" 
                rows="4" 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary-action" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn-primary-action">
              <Send className="w-4 h-4" />
              <span>SMS 전송</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
