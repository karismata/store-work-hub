import React, { useState, useEffect } from 'react';
import { 
  X, Store, Copy, Check, Save, FileText, Phone, ShieldCheck, 
  MapPin, Calendar, CreditCard, Cpu, MessageSquare, Plus, Trash2, ExternalLink
} from 'lucide-react';

export default function StoreDetailModal({ 
  isOpen, 
  onClose, 
  store, 
  onSaveStore,
  requests = [],
  onOpenNewRequest,
  onOpenRequestDetail
}) {
  const [activeTab, setActiveTab] = useState('detail'); // 'summary', 'detail', 'contract', 'consulting', 'device', 'notes', 'map'
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    bizNo: '',
    storeName: '',
    region: '',
    contact: '',
    tel: '',
    homeTel: '',
    owner: '',
    address: '',
    posType: '',
    registeredAt: '',
    status: 'active', // 'active' | 'inactive'
    storeStatus: '정상가맹점',
    salesAgent: '',
    smsNumber: '',
    smsOptOut: false,
    bizCategory: '',
    email: '',
    corpNo: '',
    homepage: '',
    contractDate: '',
    contractStatus: '',
    vanCompany: '',
    monthlyFee: '',
    posModel: '',
    contractMemo: '',
    memo: '',
    contactsList: []
  });

  // New Contact Inline State
  const [newContact, setNewContact] = useState({
    phone: '',
    dept: '',
    name: '',
    regDate: new Date().toISOString().split('T')[0],
    memo: ''
  });

  useEffect(() => {
    if (store) {
      setFormData({
        id: store.id || `ST-${Date.now().toString().slice(-4)}`,
        bizNo: store.bizNo || '',
        storeName: store.storeName || '',
        region: store.region || '',
        contact: store.contact || '',
        tel: store.tel || '',
        homeTel: store.homeTel || '',
        owner: store.owner || '',
        address: store.address || '',
        posType: store.posType || 'OKPOS / Win10',
        registeredAt: store.registeredAt || new Date().toISOString().split('T')[0],
        status: store.status || 'active',
        storeStatus: store.storeStatus || '정상가맹점',
        salesAgent: store.salesAgent || '',
        smsNumber: store.smsNumber || store.contact || '',
        smsOptOut: store.smsOptOut || false,
        bizCategory: store.bizCategory || '음식업 / 구내식당',
        email: store.email || '',
        corpNo: store.corpNo || '',
        homepage: store.homepage || '',
        contractDate: store.contractDate || store.registeredAt || new Date().toISOString().split('T')[0],
        contractStatus: store.contractStatus || '36개월 약정 (자동연장)',
        vanCompany: store.vanCompany || 'NICE VAN / KCP',
        monthlyFee: store.monthlyFee || '11,000원 (VAT 포함)',
        posModel: store.posModel || store.posType || 'OKPOS Z-POS 2대',
        contractMemo: store.contractMemo || '월 관리비 매월 25일 CMS 자동이체.',
        memo: store.memo || '',
        contactsList: store.contactsList || [
          { 
            id: 1, 
            phone: store.contact || store.tel || '010-0000-0000', 
            dept: '대표전화/담당자', 
            name: store.owner || '대표자', 
            regDate: store.registeredAt || '2024-01-01', 
            memo: '주 연락처' 
          }
        ]
      });
      setActiveTab('detail');
    }
  }, [store, isOpen]);

  if (!isOpen || !store) return null;

  // Copy Business Number
  const handleCopyBizNo = () => {
    if (formData.bizNo) {
      navigator.clipboard.writeText(formData.bizNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Add Contact Handler
  const handleAddContact = () => {
    if (!newContact.phone.trim() && !newContact.name.trim()) {
      alert('연락처 전화번호 또는 담당자명을 입력해 주세요.');
      return;
    }
    const added = {
      id: Date.now(),
      ...newContact
    };
    setFormData(prev => ({
      ...prev,
      contactsList: [...prev.contactsList, added]
    }));
    setNewContact({
      phone: '',
      dept: '',
      name: '',
      regDate: new Date().toISOString().split('T')[0],
      memo: ''
    });
  };

  // Delete Contact Handler
  const handleDeleteContact = (id) => {
    setFormData(prev => ({
      ...prev,
      contactsList: prev.contactsList.filter(c => c.id !== id)
    }));
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSaveStore(formData);
    onClose();
  };

  // Filter requests for this store
  const storeRequests = requests.filter(
    r => r.storeId === store.id || r.bizNo === store.bizNo || r.storeName === store.storeName
  );

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="modal-box modal-box-large" 
        style={{ 
          maxWidth: '1000px', 
          width: '95vw', 
          maxHeight: '92vh',
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Top Window Title Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            padding: '8px 16px',
            backgroundColor: 'var(--bg-sidebar)',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '13px',
            fontWeight: '700'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store className="w-4 h-4 text-blue-500" />
            <span style={{ color: 'var(--text-primary)' }}>
              {formData.storeName || '가맹점 정보'} [{formData.owner || '대표자'}:{formData.bizNo || '사업자번호'}]
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Registration Number Highlight Header & Quick Actions */}
        <div 
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--bg-main)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Big Yellow-on-Black Business Number Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                backgroundColor: '#0f172a',
                color: '#facc15',
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: '22px',
                fontWeight: '900',
                letterSpacing: '1px',
                padding: '4px 16px',
                borderRadius: '4px',
                border: '2px solid #334155',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {formData.bizNo || '000-00-00000'}
            </div>
            <button 
              type="button"
              className="btn-secondary-action"
              onClick={handleCopyBizNo}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: copied ? '#10b981' : 'var(--bg-sidebar)',
                color: copied ? '#ffffff' : 'var(--text-primary)',
                borderColor: copied ? '#10b981' : 'var(--border-color)',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '복사됨!' : '복사'}</span>
            </button>
          </div>

          {/* Quick Badges & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              style={{
                fontSize: '11px',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: formData.status === 'active' ? 'var(--status-done-bg)' : 'var(--status-cancel-bg)',
                color: formData.status === 'active' ? 'var(--status-done-text)' : 'var(--status-cancel-text)',
                border: `1px solid ${formData.status === 'active' ? 'var(--status-done-border)' : 'var(--status-cancel-border)'}`
              }}
            >
              {formData.status === 'active' ? '● 활성가맹점' : '○ 비활성 (중지)'}
            </span>
            {formData.salesAgent && (
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-sidebar)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                영업담당: <strong>{formData.salesAgent}</strong>
              </span>
            )}
            <button 
              type="button" 
              className="btn-primary-action"
              onClick={() => onOpenNewRequest && onOpenNewRequest(formData.id)}
              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'var(--accent-secondary)' }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>업무요청 작성</span>
            </button>
            <button 
              type="button" 
              className="btn-primary-action"
              onClick={handleSubmit}
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>저장</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div 
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-sidebar)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 8px',
            gap: '2px',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'detail', label: '상세정보', icon: FileText },
            { id: 'contract', label: '계약정보', icon: ShieldCheck, highlight: true },
            { id: 'contacts', label: '담당자 & 비상연락처', icon: Phone },
            { id: 'requests', label: `업무요청 이력 (${storeRequests.length})`, icon: MessageSquare },
            { id: 'location', label: '위치 & 지도', icon: MapPin }
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  fontSize: '12px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  background: isActive ? 'var(--bg-card)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : ''}`} />
                <span>{tab.label}</span>
                {tab.highlight && (
                  <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: '#3b82f6', color: '#fff', fontWeight: '700' }}>
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Area */}
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* TAB 1: DETAIL (상세정보 & 계약정보 포함) */}
          {activeTab === 'detail' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* SECTION A: 기본 매장 정보 Grid */}
              <div 
                style={{
                  backgroundColor: 'var(--bg-sidebar)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '14px'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Store className="w-4 h-4 text-blue-500" />
                  <span>기본 가맹점 정보</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  
                  {/* Row 1 */}
                  <div className="form-group">
                    <label className="form-label">사업자등록번호 *</label>
                    <input 
                      type="text" 
                      className="input-field"
                      value={formData.bizNo}
                      onChange={e => setFormData({ ...formData, bizNo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">운영상태</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '4px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}>
                        <input 
                          type="radio" 
                          name="status" 
                          checked={formData.status === 'active'}
                          onChange={() => setFormData({ ...formData, status: 'active' })}
                        />
                        <span style={{ fontWeight: '600', color: '#16a34a' }}>● 활성</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}>
                        <input 
                          type="radio" 
                          name="status" 
                          checked={formData.status === 'inactive'}
                          onChange={() => setFormData({ ...formData, status: 'inactive' })}
                        />
                        <span style={{ fontWeight: '600', color: '#dc2626' }}>○ 비활성 (중지)</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">SMS 수신번호 / 거부</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        className="input-field"
                        placeholder="SMS 수신 전용 번호"
                        value={formData.smsNumber}
                        onChange={e => setFormData({ ...formData, smsNumber: e.target.value })}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', fontSize: '11px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={formData.smsOptOut}
                          onChange={e => setFormData({ ...formData, smsOptOut: e.target.checked })}
                        />
                        <span>수신거부</span>
                      </label>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="form-group">
                    <label className="form-label">가맹점상태 / 구분</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: 정상가맹점"
                      value={formData.storeStatus}
                      onChange={e => setFormData({ ...formData, storeStatus: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">신규구분 / 영업담당자</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="담당자 이름 (예: 송용현)"
                      value={formData.salesAgent}
                      onChange={e => setFormData({ ...formData, salesAgent: e.target.value })}
                    />
                  </div>

                  {/* Row 3 */}
                  <div className="form-group">
                    <label className="form-label">가맹점명 (매장명) *</label>
                    <input 
                      type="text" 
                      className="input-field"
                      value={formData.storeName}
                      onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">대표자명</label>
                    <input 
                      type="text" 
                      className="input-field"
                      value={formData.owner}
                      onChange={e => setFormData({ ...formData, owner: e.target.value })}
                    />
                  </div>

                  {/* Row 4 */}
                  <div className="form-group">
                    <label className="form-label">전화번호 (일반전화)</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: 02-581-4095"
                      value={formData.tel}
                      onChange={e => setFormData({ ...formData, tel: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">자택 / 비상전화</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: 031-591-1122"
                      value={formData.homeTel}
                      onChange={e => setFormData({ ...formData, homeTel: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">휴대폰 (주연락처)</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: 010-2054-6389"
                      value={formData.contact}
                      onChange={e => setFormData({ ...formData, contact: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">등록일자</label>
                    <input 
                      type="date" 
                      className="input-field"
                      value={formData.registeredAt}
                      onChange={e => setFormData({ ...formData, registeredAt: e.target.value })}
                    />
                  </div>

                  {/* Row 5 - Full Width Address */}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">매장 주소</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="경기도 남양주시 미금로 57 빙그레도농2공장 식당"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  {/* Row 6 */}
                  <div className="form-group">
                    <label className="form-label">업태 / 종목</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: 음식업 / 구내식당"
                      value={formData.bizCategory}
                      onChange={e => setFormData({ ...formData, bizCategory: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">이메일 (Email)</label>
                    <input 
                      type="email" 
                      className="input-field"
                      placeholder="예: store@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">법인등록번호</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="법인등록번호 13자리"
                      value={formData.corpNo}
                      onChange={e => setFormData({ ...formData, corpNo: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">홈페이지</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="http://"
                      value={formData.homepage}
                      onChange={e => setFormData({ ...formData, homepage: e.target.value })}
                    />
                  </div>

                </div>
              </div>

              {/* SECTION B: 계약정보 (USER REQUEST: "메모 위쪽으로 계약정보를 넣을수있는 란도 있으면 좋겠다") */}
              <div 
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  borderRadius: '6px',
                  padding: '14px'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>가맹점 계약 정보 (Contract Information)</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '400', marginLeft: 'auto' }}>
                    * 메모 상단 계약 관리 필드
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">계약일자</label>
                    <input 
                      type="date" 
                      className="input-field"
                      value={formData.contractDate}
                      onChange={e => setFormData({ ...formData, contractDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">계약상태 / 약정기간</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: 36개월 약정 (자동연장)"
                      value={formData.contractStatus}
                      onChange={e => setFormData({ ...formData, contractStatus: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">VAN사 / PG 결제사</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: NICE VAN / KCP"
                      value={formData.vanCompany}
                      onChange={e => setFormData({ ...formData, vanCompany: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">월 관리비 / 수수료</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: 11,000원 (VAT 포함)"
                      value={formData.monthlyFee}
                      onChange={e => setFormData({ ...formData, monthlyFee: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">POS / 단말기 계약 모델</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: OKPOS Z-POS 2대 (임대)"
                      value={formData.posModel}
                      onChange={e => setFormData({ ...formData, posModel: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">계약 특약사항 / CMS 안내</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="예: 월 관리비 매월 25일 CMS 자동이체. 위약금 면제 조항 포함"
                      value={formData.contractMemo}
                      onChange={e => setFormData({ ...formData, contractMemo: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: 특이사항 / 메모 */}
              <div 
                style={{
                  backgroundColor: 'var(--bg-sidebar)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '14px'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>특이사항 및 메모 (Memo)</span>
                </div>
                <textarea 
                  className="input-field"
                  rows="3"
                  placeholder="예: 밴프로는 3168108343_주식회사 정우푸드(빙그레) 검색. 점심시간 조치 시 유의사항 입력"
                  value={formData.memo}
                  onChange={e => setFormData({ ...formData, memo: e.target.value })}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              {/* SECTION D: 하단 매장 담당자 목록 Table (Screenshot bottom contacts table) */}
              <div 
                style={{
                  backgroundColor: 'var(--bg-sidebar)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>매장 담당자 / 부서 연락처 (총 {formData.contactsList.length}건)</span>
                  </div>
                </div>

                <div className="table-container" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '130px' }}>전화번호</th>
                        <th style={{ width: '120px' }}>부서</th>
                        <th style={{ width: '110px' }}>담당자</th>
                        <th style={{ width: '100px' }}>등록일자</th>
                        <th>메모</th>
                        <th style={{ width: '50px', textAlign: 'center' }}>삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.contactsList.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)' }}>
                            등록된 추가 담당자 연락처가 없습니다. 아래에서 입력하여 등록하세요.
                          </td>
                        </tr>
                      ) : (
                        formData.contactsList.map(c => (
                          <tr key={c.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{c.phone}</td>
                            <td>{c.dept}</td>
                            <td style={{ fontWeight: '600' }}>{c.name}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{c.regDate}</td>
                            <td style={{ color: 'var(--text-secondary)' }}>{c.memo}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                type="button"
                                onClick={() => handleDeleteContact(c.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                title="삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Inline Add Contact Input Bar */}
                <div 
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginTop: '8px',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-card)',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="전화번호 (예: 010-1234-5678)"
                    style={{ flex: 1.2, fontSize: '11px' }}
                    value={newContact.phone}
                    onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="부서 (예: 경리부)"
                    style={{ flex: 1, fontSize: '11px' }}
                    value={newContact.dept}
                    onChange={e => setNewContact({ ...newContact, dept: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="담당자 (예: 홍길동)"
                    style={{ flex: 1, fontSize: '11px' }}
                    value={newContact.name}
                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="메모 (예: 주간 담당)"
                    style={{ flex: 1.5, fontSize: '11px' }}
                    value={newContact.memo}
                    onChange={e => setNewContact({ ...newContact, memo: e.target.value })}
                  />
                  <button 
                    type="button" 
                    className="btn-secondary-action"
                    onClick={handleAddContact}
                    style={{ padding: '4px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>추가</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* TAB 2: CONTRACT INFO (전용 계약 정보 뷰) */}
          {activeTab === 'contract' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div 
                style={{
                  backgroundColor: 'var(--bg-sidebar)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '16px'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <span>가맹점 상세 계약 및 CMS/정산 관리</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>계약 체결일자</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', marginTop: '4px', color: 'var(--text-primary)' }}>
                      {formData.contractDate || formData.registeredAt || '2021-04-15'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>계약약정 상태</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', marginTop: '4px', color: 'var(--accent-primary)' }}>
                      {formData.contractStatus || '36개월 약정 (자동연장)'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>VAN사 / PG결제사</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', marginTop: '4px', color: 'var(--text-primary)' }}>
                      {formData.vanCompany || 'NICE VAN / KCP'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>월 관리비 및 수수료</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', marginTop: '4px', color: '#16a34a' }}>
                      {formData.monthlyFee || '11,000원 (VAT 포함)'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', gridColumn: '1 / -1' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>POS / 단말기 계약 모델 및 장비</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px', color: 'var(--text-primary)' }}>
                      {formData.posModel || formData.posType || 'OKPOS Z-POS 2대 (임대)'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', gridColumn: '1 / -1' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>계약 특약사항 및 비고</div>
                    <div style={{ fontSize: '13px', marginTop: '6px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {formData.contractMemo || '월 관리비 매월 25일 CMS 자동이체. 핑거패드 무상제공.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTS */}
          {activeTab === 'contacts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700' }}>매장 등록 담당자 목록</div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>전화번호</th>
                      <th>부서</th>
                      <th>담당자</th>
                      <th>등록일자</th>
                      <th>메모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.contactsList.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{c.phone}</td>
                        <td>{c.dept}</td>
                        <td style={{ fontWeight: '600' }}>{c.name}</td>
                        <td>{c.regDate}</td>
                        <td>{c.memo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REQUESTS HISTORY */}
          {activeTab === 'requests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  [{formData.storeName}] 관련 처리된 업무요청 내역 ({storeRequests.length}건)
                </span>
                <button 
                  className="btn-primary-action" 
                  onClick={() => onOpenNewRequest && onOpenNewRequest(formData.id)}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  + 새 업무요청 작성
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '90px' }}>요청ID</th>
                      <th style={{ width: '70px' }}>상태</th>
                      <th style={{ width: '130px' }}>카테고리</th>
                      <th>요청 내용</th>
                      <th style={{ width: '110px' }}>작성일시</th>
                      <th style={{ width: '60px', textAlign: 'center' }}>보기</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeRequests.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                          이 매장과 연관된 업무요청 내역이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      storeRequests.map(r => (
                        <tr key={r.id}>
                          <td style={{ fontFamily: 'monospace' }}>{r.id}</td>
                          <td>
                            <span className={`badge-status ${r.status === '신규' ? 'status-new' : r.status === '완료' ? 'status-done' : 'status-process'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{r.category}</td>
                          <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {r.content}
                          </td>
                          <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.createdAt}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              className="btn-secondary-action"
                              style={{ padding: '2px 6px', fontSize: '10px' }}
                              onClick={() => onOpenRequestDetail && onOpenRequestDetail(r)}
                            >
                              보기
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: LOCATION & MAP */}
          {activeTab === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div 
                style={{
                  backgroundColor: 'var(--bg-sidebar)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '16px'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>가맹점 위치 주소</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  {formData.address || '등록된 주소가 없습니다.'}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="btn-secondary-action"
                    onClick={() => {
                      if (formData.address) {
                        window.open(`https://map.kakao.com/?q=${encodeURIComponent(formData.address)}`, '_blank');
                      }
                    }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>카카오맵에서 보기</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary-action"
                    onClick={() => {
                      if (formData.address) {
                        window.open(`https://map.naver.com/v5/search/${encodeURIComponent(formData.address)}`, '_blank');
                      }
                    }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>네이버지도에서 보기</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div 
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--bg-sidebar)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            매장 ID: {formData.id} | 등록일자: {formData.registeredAt}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn-secondary-action" onClick={onClose}>
              닫기
            </button>
            <button type="button" className="btn-primary-action" onClick={handleSubmit}>
              <Save className="w-4 h-4" />
              <span>수정 내용 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
