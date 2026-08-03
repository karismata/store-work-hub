import React, { useState, useEffect } from 'react';
import { X, Store, Save } from 'lucide-react';

export default function StoreModal({ isOpen, onClose, onSaveStore, editingStore = null }) {
  const [formData, setFormData] = useState({
    bizNo: '',
    storeName: '',
    region: '종로구',
    contact: '',
    tel: '',
    owner: '',
    address: '',
    posType: 'OKPOS / Win10',
    memo: ''
  });

  useEffect(() => {
    if (editingStore) {
      setFormData({
        bizNo: editingStore.bizNo || '',
        storeName: editingStore.storeName || '',
        region: editingStore.region || '종로구',
        contact: editingStore.contact || '',
        tel: editingStore.tel || '',
        owner: editingStore.owner || '',
        address: editingStore.address || '',
        posType: editingStore.posType || 'OKPOS / Win10',
        memo: editingStore.memo || ''
      });
    } else {
      setFormData({
        bizNo: '',
        storeName: '',
        region: '종로구',
        contact: '',
        tel: '',
        owner: '',
        address: '',
        posType: 'OKPOS / Win10',
        memo: ''
      });
    }
  }, [editingStore, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bizNo || !formData.storeName) {
      alert('사업자번호와 가맹점명은 필수 항목입니다.');
      return;
    }
    
    const storeToSave = {
      id: editingStore ? editingStore.id : `ST-${Date.now().toString().slice(-4)}`,
      ...formData,
      registeredAt: editingStore ? editingStore.registeredAt : new Date().toISOString().split('T')[0]
    };
    
    onSaveStore(storeToSave);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title">
            <Store className="w-5 h-5 text-cyan-400" />
            <span>{editingStore ? `가맹점 정보 수정 [${editingStore.storeName}]` : '신규 가맹점/사업자 등록'}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">사업자등록번호 *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="예: 205-88-03143"
                  value={formData.bizNo}
                  onChange={(e) => setFormData({ ...formData, bizNo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">가맹점명 (매장명) *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="예: (주)루미호스피털 종로점"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">지역 (구/군)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="예: 종로구"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">대표자명</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="예: 김대표"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">담당자 휴대폰 (업무연락 수신)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="예: 010-7776-9476"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">매장 일반전화</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="예: 02-730-1199"
                  value={formData.tel}
                  onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">매장 주소</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="서울특별시 종로구 종로 123"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">POS/단말기 환경</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="예: OKPOS / Win10 / 키오스크 2대"
                value={formData.posType}
                onChange={(e) => setFormData({ ...formData, posType: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">특이사항 / 메모</label>
              <textarea 
                className="input-field" 
                rows="3"
                placeholder="매장 운영 시간, 세금계산서 발행 정보 등 특이사항 입력"
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary-action" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn-primary-action">
              <Save className="w-4 h-4" />
              <span>{editingStore ? '수정 내용 저장' : '매장 정보 저장'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
