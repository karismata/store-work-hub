import React, { useState } from 'react';
import { LogIn, UserPlus, Shield, User, Lock, Building, AlertCircle, CheckCircle, Settings, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ isOpen, onLoginSuccess, departments = [] }) {
  const [tabMode, setTabMode] = useState('login'); // 'login' | 'signup' | 'edit'
  
  // Login / Signup fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState(departments[0]?.name || '02-영업관리팀');
  
  // Edit Account fields
  const [editUsername, setEditUsername] = useState('');
  const [editCurrentPassword, setEditCurrentPassword] = useState('');
  const [editNewPassword, setEditNewPassword] = useState('');
  const [editNewPasswordConfirm, setEditNewPasswordConfirm] = useState('');
  const [editName, setEditName] = useState('');
  const [editDepartment, setEditDepartment] = useState(departments[0]?.name || '02-영업관리팀');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const clearAllFields = () => {
    setUsername('');
    setPassword('');
    setName('');
    setEditUsername('');
    setEditCurrentPassword('');
    setEditNewPassword('');
    setEditNewPasswordConfirm('');
    setEditName('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleTabChange = (newTab) => {
    setTabMode(newTab);
    clearAllFields();
  };

  // Password matching check calculation
  const hasNewPasswordInput = editNewPassword.length > 0 || editNewPasswordConfirm.length > 0;
  const isPasswordMatch = hasNewPasswordInput && editNewPassword === editNewPasswordConfirm && editNewPassword.length > 0;
  const isPasswordMismatch = hasNewPasswordInput && editNewPasswordConfirm.length > 0 && editNewPassword !== editNewPasswordConfirm;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('아이디와 비밀번호를 모두 입력해 주세요.');
      setLoading(false);
      return;
    }

    try {
      // 1. Try Supabase app_users table first
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', username.trim())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase login check note:', error.message);
      }

      if (data) {
        if (data.password === password) {
          const userObj = {
            id: data.id,
            username: data.username,
            name: data.name,
            department: data.department,
            role: data.role || '직원'
          };
          clearAllFields();
          onLoginSuccess(userObj);
          return;
        } else {
          setErrorMsg('비밀번호가 일치하지 않습니다.');
          setLoading(false);
          return;
        }
      }

      // 2. Fallback local user check
      const localUsers = JSON.parse(localStorage.getItem('store_work_hub_users') || '[]');
      const localMatch = localUsers.find(u => (u.username || u.id) === username.trim());

      if (localMatch) {
        if (localMatch.password && localMatch.password !== password) {
          setErrorMsg('비밀번호가 일치하지 않습니다.');
          setLoading(false);
          return;
        }
        const userObj = {
          id: localMatch.id,
          username: localMatch.username || localMatch.id,
          name: localMatch.name,
          department: localMatch.dept || localMatch.department,
          role: localMatch.role || '직원'
        };
        clearAllFields();
        onLoginSuccess(userObj);
        return;
      }

      setErrorMsg('등록된 계정을 찾을 수 없습니다. [신규 회원가입] 탭에서 가입해 주세요.');
    } catch (err) {
      console.error(err);
      setErrorMsg('로그인 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!username.trim() || !password.trim() || !name.trim()) {
      setErrorMsg('아이디, 비밀번호, 성명을 모두 입력해 주세요.');
      setLoading(false);
      return;
    }

    try {
      const newUser = {
        id: `U-${Date.now()}`,
        username: username.trim(),
        password: password.trim(),
        name: name.trim(),
        department: department,
        role: '직원',
        created_at: new Date().toISOString()
      };

      // 1. Save to Supabase DB
      const { error } = await supabase
        .from('app_users')
        .insert([newUser]);

      if (error) {
        console.warn('Supabase signup note:', error.message);
      }

      // 2. Save locally as fallback
      const localUsers = JSON.parse(localStorage.getItem('store_work_hub_users') || '[]');
      if (!localUsers.some(u => u.username === newUser.username)) {
        localUsers.push(newUser);
        localStorage.setItem('store_work_hub_users', JSON.stringify(localUsers));
      }

      setSuccessMsg('회원가입이 완료되었습니다! 바로 로그인됩니다.');
      
      const loggedUser = {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        department: newUser.department,
        role: newUser.role
      };

      setTimeout(() => {
        clearAllFields();
        onLoginSuccess(loggedUser);
      }, 700);

    } catch (err) {
      console.error(err);
      setErrorMsg('회원가입 처리 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!editUsername.trim() || !editCurrentPassword.trim()) {
      setErrorMsg('수정할 아이디와 기존 비밀번호를 입력해 주세요.');
      setLoading(false);
      return;
    }

    // Check if new password confirmation matches
    if (editNewPassword.trim()) {
      if (editNewPassword.trim() !== editNewPasswordConfirm.trim()) {
        setErrorMsg('새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.');
        setLoading(false);
        return;
      }
    }

    try {
      // 1. Verify current user credentials in Supabase
      const { data: user, error: fetchErr } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', editUsername.trim())
        .single();

      let targetUser = user;

      // Fallback local check
      if (!targetUser) {
        const localUsers = JSON.parse(localStorage.getItem('store_work_hub_users') || '[]');
        targetUser = localUsers.find(u => (u.username || u.id) === editUsername.trim());
      }

      if (!targetUser) {
        setErrorMsg('입력하신 아이디의 계정을 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      if (targetUser.password !== editCurrentPassword) {
        setErrorMsg('기존 비밀번호가 일치하지 않습니다.');
        setLoading(false);
        return;
      }

      // Compute updated fields
      const updatedPassword = editNewPassword.trim() ? editNewPassword.trim() : editCurrentPassword;
      const updatedName = editName.trim() ? editName.trim() : targetUser.name;
      const updatedDept = editDepartment ? editDepartment : targetUser.department;

      // Update in Supabase
      const { error: updateErr } = await supabase
        .from('app_users')
        .update({
          password: updatedPassword,
          name: updatedName,
          department: updatedDept
        })
        .eq('username', editUsername.trim());

      if (updateErr) {
        console.warn('Supabase update note:', updateErr.message);
      }

      // Update in LocalStorage fallback
      const localUsers = JSON.parse(localStorage.getItem('store_work_hub_users') || '[]');
      const updatedLocalUsers = localUsers.map(u => {
        if ((u.username || u.id) === editUsername.trim()) {
          return {
            ...u,
            password: updatedPassword,
            name: updatedName,
            department: updatedDept
          };
        }
        return u;
      });
      localStorage.setItem('store_work_hub_users', JSON.stringify(updatedLocalUsers));

      setSuccessMsg('계정 정보가 성공적으로 변경되었습니다!');
      
      setTimeout(() => {
        clearAllFields();
        setTabMode('login');
      }, 1200);

    } catch (err) {
      console.error(err);
      setErrorMsg('계정 정보 수정 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-box" style={{ width: '460px', padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', borderRadius: '12px' }}>
        {/* Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7, #4f46e5)',
          padding: '18px 20px',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <div style={{
            display: 'inline-flex',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            marginBottom: '6px'
          }}>
            <Shield style={{ width: '26px', height: '26px', color: '#ffffff' }} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 2px 0', letterSpacing: '-0.5px' }}>매장 관리 업무 Hub</h2>
          <p style={{ fontSize: '11px', color: '#e0f2fe', margin: 0 }}>전 직원 통합 업무 로그인 & 계정 관리 시스템</p>
        </div>

        {/* 3-Tab Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            style={{
              flex: 1,
              padding: '10px 4px',
              border: 'none',
              borderBottom: tabMode === 'login' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              backgroundColor: tabMode === 'login' ? 'var(--bg-card)' : 'transparent',
              color: tabMode === 'login' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <LogIn style={{ width: '14px', height: '14px' }} />
            <span>로그인</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('signup')}
            style={{
              flex: 1,
              padding: '10px 4px',
              border: 'none',
              borderBottom: tabMode === 'signup' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              backgroundColor: tabMode === 'signup' ? 'var(--bg-card)' : 'transparent',
              color: tabMode === 'signup' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <UserPlus style={{ width: '14px', height: '14px' }} />
            <span>신규 회원가입</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('edit')}
            style={{
              flex: 1,
              padding: '10px 4px',
              border: 'none',
              borderBottom: tabMode === 'edit' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              backgroundColor: tabMode === 'edit' ? 'var(--bg-card)' : 'transparent',
              color: tabMode === 'edit' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Settings style={{ width: '14px', height: '14px' }} />
            <span>내 계정 정보 수정</span>
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '18px 20px', backgroundColor: 'var(--bg-card)' }}>
          {errorMsg && (
            <div style={{
              padding: '8px 10px',
              marginBottom: '10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '8px 10px',
              marginBottom: '10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              color: '#10b981',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tabMode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>아이디 (User ID) *</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 10px'
                }}>
                  <User style={{ width: '16px', height: '16px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="아이디 입력"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>비밀번호 *</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 10px'
                }}>
                  <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="password"
                    required
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-action"
                style={{
                  width: '100%',
                  padding: '10px',
                  justifyContent: 'center',
                  fontSize: '13px',
                  marginTop: '8px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)'
                }}
              >
                {loading ? '로그인 중...' : '로그인하기'}
              </button>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {tabMode === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>아이디 (User ID) *</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 10px'
                }}>
                  <User style={{ width: '16px', height: '16px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="생성할 아이디 입력"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>비밀번호 *</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 10px'
                }}>
                  <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="password"
                    required
                    placeholder="사용할 비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>성명 (직원 이름) *</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 10px'
                }}>
                  <User style={{ width: '16px', height: '16px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="이름 입력 (예: 홍길동)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>소속 부서 *</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 10px'
                }}>
                  <Building style={{ width: '16px', height: '16px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {departments.map((d) => (
                      <option key={d.id || d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-action"
                style={{
                  width: '100%',
                  padding: '10px',
                  justifyContent: 'center',
                  fontSize: '13px',
                  marginTop: '8px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)'
                }}
              >
                {loading ? '처리 중...' : '회원가입 완료 및 접속'}
              </button>
            </form>
          )}

          {/* TAB 3: EDIT ACCOUNT */}
          {tabMode === 'edit' && (
            <form onSubmit={handleEditAccount} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>수정할 아이디 (User ID) *</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 8px'
                }}>
                  <User style={{ width: '15px', height: '15px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="기존 아이디 입력"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>기존 비밀번호 * (본인 확인용)</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 8px'
                }}>
                  <Lock style={{ width: '15px', height: '15px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="password"
                    required
                    placeholder="기존 비밀번호 입력"
                    value={editCurrentPassword}
                    onChange={(e) => setEditCurrentPassword(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <hr style={{ borderColor: 'var(--border-color)', opacity: 0.6, margin: '2px 0' }} />

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>새 비밀번호 (변경 시에만 입력)</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: isPasswordMatch ? '1.5px solid #2563eb' : isPasswordMismatch ? '1.5px solid #ef4444' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  transition: 'border-color 0.15s'
                }}>
                  <Lock style={{ width: '15px', height: '15px', color: isPasswordMatch ? '#2563eb' : isPasswordMismatch ? '#ef4444' : 'var(--accent-primary)', flexShrink: 0 }} />
                  <input
                    type="password"
                    placeholder="새로 변경할 비밀번호"
                    value={editNewPassword}
                    onChange={(e) => setEditNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              {/* New Password Confirm Field with Dynamic Color Feedback */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>새 비밀번호 확인 (재입력)</label>
                  {isPasswordMatch && (
                    <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      ✓ 비밀번호 일치 (파란색)
                    </span>
                  )}
                  {isPasswordMismatch && (
                    <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      ✕ 비밀번호 불일치 (빨간색)
                    </span>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: isPasswordMatch ? '1.5px solid #2563eb' : isPasswordMismatch ? '1.5px solid #ef4444' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  transition: 'border-color 0.15s'
                }}>
                  {isPasswordMismatch ? (
                    <X style={{ width: '15px', height: '15px', color: '#ef4444', flexShrink: 0 }} />
                  ) : isPasswordMatch ? (
                    <Check style={{ width: '15px', height: '15px', color: '#2563eb', flexShrink: 0 }} />
                  ) : (
                    <Check style={{ width: '15px', height: '15px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  )}
                  <input
                    type="password"
                    placeholder="새 비밀번호 재입력"
                    value={editNewPasswordConfirm}
                    onChange={(e) => setEditNewPasswordConfirm(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>성명 (이름 변경 시 입력)</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 8px'
                }}>
                  <User style={{ width: '15px', height: '15px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="변경할 이름 (선택)"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '11px' }}>소속 부서 변경</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 8px'
                }}>
                  <Building style={{ width: '15px', height: '15px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <select
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {departments.map((d) => (
                      <option key={d.id || d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-action"
                style={{
                  width: '100%',
                  padding: '9px',
                  justifyContent: 'center',
                  fontSize: '12px',
                  marginTop: '6px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #4f46e5, #2563eb)'
                }}
              >
                {loading ? '변경 중...' : '계정 정보 저장하기'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
