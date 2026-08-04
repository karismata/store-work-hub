import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StoreDetailModal from './components/StoreDetailModal';
import WorkRequestModal from './components/WorkRequestModal';
import RequestDetailModal from './components/RequestDetailModal';
import TeamPopupNotification from './components/TeamPopupNotification';
import ImageGalleryModal from './components/ImageGalleryModal';
import CidModal from './components/CidModal';
import MemoModal from './components/MemoModal';
import HelpModal from './components/HelpModal';
import SmsModal from './components/SmsModal';
import AuthModal from './components/AuthModal';
import SupabaseModal from './components/SupabaseModal';
import ChatWorkspace from './components/ChatWorkspace';
import CreateRoomModal from './components/CreateRoomModal';

import UserSelectModal from './components/UserSelectModal';
import DepartmentManageModal from './components/DepartmentManageModal';

import WorkInboxTab from './tabs/WorkInboxTab';
import WorkSentTab from './tabs/WorkSentTab';
import WorkStatusTab from './tabs/WorkStatusTab';
import StoreManageTab from './tabs/StoreManageTab';

import { supabase } from './lib/supabase';

import { 
  INITIAL_STORES, 
  INITIAL_REQUESTS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_USERS, 
  CATEGORIES 
} from './data/mockData';

const INITIAL_ROOMS = [
  { id: 'ROOM-1', name: '02-영업관리팀 업무방', description: '영업팀 전용 업무 소통 채널', members: ['U-001', 'U-002', 'U-003', 'U-004', 'karis02', 'olive_admin', 'admin'] },
  { id: 'ROOM-2', name: 'POS/단말기 장애 긴급대응', description: 'POS 단말기 및 VAN 장애 전용 대응방', members: ['U-001', 'U-002', 'U-007', 'U-016', 'karis02', 'admin'] },
  { id: 'ROOM-3', name: '신규 가맹점 조치 채널', description: '신규 오픈 가맹점 세팅 채널', members: ['U-001', 'U-003', 'U-008', 'U-012', 'olive_admin', 'admin'] }
];

const INITIAL_CHAT_MESSAGES = [
  {
    id: 'MSG-1',
    roomId: 'ROOM-1',
    senderId: 'karis02',
    senderName: '한정훈',
    senderDept: '02-영업관리팀',
    content: '안녕하세요! 업무채팅방 채널이 개설되었습니다. 자유롭게 대화 및 업무 요청을 카드 형태로 남겨주세요.',
    isWorkRequest: false,
    createdAt: new Date().toLocaleString()
  },
  {
    id: 'MSG-2',
    roomId: 'ROOM-1',
    senderId: 'olive_admin',
    senderName: '이올리브',
    senderDept: '02-영업관리팀',
    content: '한주커피 강남본점에서 사이드메뉴 가격 변경 및 영수증 하단 텍스트 수정 요청 들어왔습니다.',
    isWorkRequest: true,
    category: 'POS 메뉴추가/수정',
    storeName: '한주커피 강남본점',
    bizNo: '110-81-99812',
    status: '신규',
    createdAt: new Date().toLocaleString()
  }
];

export default function App() {
  // Theme state: Default to 'light' and persist to localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('store_work_hub_theme');
    return savedTheme ? savedTheme : 'light';
  });

  const [currentTeam] = useState('02-영업관리팀');
  const [activeTab, setActiveTab] = useState('chat'); // chat, inbox, sent, status, stores

  // Logged-in User State (sessionStorage: automatically resets on app restart)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('store_work_hub_current_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.username) return parsed;
    } catch (e) {}
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => !currentUser);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Chat Rooms & Messages states
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('store_work_hub_chat_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });
  const [currentRoomId, setCurrentRoomId] = useState('ROOM-1');
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('store_work_hub_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  // Department & User states (persisted)
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('store_work_hub_depts');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('store_work_hub_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Data states (Smart migration merge with INITIAL_STORES)
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem('store_work_hub_stores');
    if (!saved) return INITIAL_STORES;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_STORES;
      return parsed.map(s => {
        const initial = INITIAL_STORES.find(i => i.id === s.id || i.bizNo === s.bizNo);
        return {
          ...initial,
          ...s,
          status: s.status || initial?.status || 'active',
          contractStatus: s.contractStatus || initial?.contractStatus || '36개월 약정 (자동연장)',
          contractDate: s.contractDate || initial?.contractDate || s.registeredAt || '2021-04-15',
          vanCompany: s.vanCompany || initial?.vanCompany || 'NICE VAN / KCP',
          monthlyFee: s.monthlyFee || initial?.monthlyFee || '11,000원 (VAT 포함)',
          posModel: s.posModel || initial?.posModel || s.posType || 'OKPOS Z-POS 2대',
          contractMemo: s.contractMemo || initial?.contractMemo || '월 관리비 매월 25일 CMS 자동이체.',
          contactsList: (s.contactsList && s.contactsList.length > 0) ? s.contactsList : (initial?.contactsList || [
            { id: 1, phone: s.contact || s.tel || '010-0000-0000', dept: '대표전화', name: s.owner || '대표자', regDate: s.registeredAt || '2024-01-01', memo: '주 연락처' }
          ])
        };
      });
    } catch (e) {
      return INITIAL_STORES;
    }
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('store_work_hub_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [galleryImageUrl, setGalleryImageUrl] = useState(null);

  // Tools & Dept modals state
  const [isUserSelectModalOpen, setIsUserSelectModalOpen] = useState(false);
  const [isDeptManageModalOpen, setIsDeptManageModalOpen] = useState(false);
  const [isCidModalOpen, setIsCidModalOpen] = useState(false);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  const CURRENT_APP_VERSION = '1.1.0';
  const [updateAvailableInfo, setUpdateAvailableInfo] = useState(null);
  const [downloadedUpdateVersion, setDownloadedUpdateVersion] = useState(null);
  const [downloadProgressPercent, setDownloadProgressPercent] = useState(0);

  const handleManualUpdateCheck = async () => {
    if (window.electronAPI) {
      try {
        alert('🔍 최신 버전을 검사합니다. 신규 버전이 존재하면 웹브라우저 없이 앱 내부에서 백그라운드 무인 다운로드가 시작됩니다.');
        await window.electronAPI.checkForUpdate();
        return;
      } catch (e) {
        console.warn('Electron updater check note:', e);
      }
    }
    try {
      const res = await fetch('https://api.github.com/repos/karismata/store-work-hub/releases/latest');
      if (res.ok) {
        const data = await res.json();
        const latestTag = (data.tag_name || '').replace(/^v/, '').trim();
        if (latestTag && latestTag !== CURRENT_APP_VERSION) {
          const exeAsset = data.assets?.find(a => a.name.endsWith('.exe'));
          const url = exeAsset ? exeAsset.browser_download_url : data.html_url;

          if (window.confirm(`🚀 새로운 최신 버전(v${latestTag})이 출시되었습니다!\n현재 버전: v${CURRENT_APP_VERSION}\n\n지금 설치파일(v${latestTag})을 다운로드하시겠습니까?`)) {
            if (window.electronAPI) {
              window.electronAPI.openExternal(url);
            } else {
              window.open(url, '_blank');
            }
          }
        } else {
          alert(`✅ 현재 사용 중인 버전(v${CURRENT_APP_VERSION})이 최신 버전입니다.`);
        }
      } else {
        alert(`✅ 현재 사용 중인 버전(v${CURRENT_APP_VERSION})이 최신 버전입니다.`);
      }
    } catch (e) {
      alert(`✅ 현재 사용 중인 버전(v${CURRENT_APP_VERSION})이 최신 버전입니다.`);
    }
  };

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onDownloadProgress((progressObj) => {
        if (progressObj && progressObj.percent) {
          setDownloadProgressPercent(Math.round(progressObj.percent));
        }
      });

      window.electronAPI.onUpdateDownloaded((info) => {
        setDownloadProgressPercent(100);
        setDownloadedUpdateVersion(info.version || '최신');
      });
    }

    // Check GitHub Releases API for new version automatically
    const checkGitHubRelease = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/karismata/store-work-hub/releases/latest');
        if (res.ok) {
          const data = await res.json();
          const latestTag = (data.tag_name || '').replace(/^v/, '').trim();
          if (latestTag && latestTag !== CURRENT_APP_VERSION) {
            const exeAsset = data.assets?.find(a => a.name.endsWith('.exe'));
            setUpdateAvailableInfo({
              version: latestTag,
              downloadUrl: exeAsset ? exeAsset.browser_download_url : data.html_url
            });
          }
        }
      } catch (err) {
        console.log('GitHub Release check note:', err);
      }
    };

    checkGitHubRelease();
  }, []);

  // Sync theme attribute & save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('store_work_hub_theme', theme);
  }, [theme]);

  // Ensure login modal is open if no user is logged in
  useEffect(() => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    }
  }, [currentUser]);

  // Persist chat data
  useEffect(() => {
    localStorage.setItem('store_work_hub_chat_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('store_work_hub_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('store_work_hub_depts', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('store_work_hub_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('store_work_hub_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('store_work_hub_requests', JSON.stringify(requests));
  }, [requests]);

  // Supabase Cloud DB Real-time Sync & Subscriptions
  useEffect(() => {
    if (!supabase) return;

    // Initial Cloud Fetch with local fallback
    const fetchCloudData = async () => {
      try {
        // Fetch Users from Supabase Cloud DB
        const { data: cloudUsers } = await supabase.from('app_users').select('*');
        if (cloudUsers && cloudUsers.length > 0) {
          setUsers(prev => {
            const map = new Map();
            INITIAL_USERS.forEach(u => map.set(u.id || u.username, u));
            prev.forEach(u => map.set(u.id || u.username, u));
            cloudUsers.forEach(u => {
              const formatted = {
                id: u.id || u.username,
                username: u.username || u.id,
                name: u.name,
                dept: u.department || u.dept,
                department: u.department || u.dept,
                role: u.role || '직원',
                status: '재직'
              };
              map.set(formatted.id, formatted);
            });
            const merged = Array.from(map.values());
            localStorage.setItem('store_work_hub_users', JSON.stringify(merged));
            return merged;
          });
        }

        // Fetch Chat Rooms from Supabase Cloud DB
        const { data: cloudRooms } = await supabase.from('chat_rooms').select('*');
        if (cloudRooms && cloudRooms.length > 0) {
          const formattedRooms = cloudRooms.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            members: typeof r.members === 'string' ? JSON.parse(r.members) : (r.members || []),
            createdAt: r.created_at || r.createdAt
          }));
          setRooms(prev => {
            const map = new Map();
            prev.forEach(r => map.set(r.id, r));
            formattedRooms.forEach(r => map.set(r.id, r));
            return Array.from(map.values());
          });
        }

        const { data: cloudMsgs } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
        if (cloudMsgs && cloudMsgs.length > 0) {
          const formattedMsgs = cloudMsgs.map(m => ({
            id: m.id,
            roomId: String(m.room_id || m.roomId || 'ROOM-1').trim(),
            senderId: m.sender_id || m.senderId,
            senderName: m.sender_name || m.senderName,
            senderDept: m.sender_dept || m.senderDept,
            content: m.content,
            isWorkRequest: m.is_work_request || m.isWorkRequest,
            category: m.category,
            storeName: m.store_name || m.storeName,
            bizNo: m.biz_no || m.bizNo,
            status: m.status,
            createdAt: m.created_at || m.createdAt
          }));
          setChatMessages(prev => {
            const map = new Map();
            prev.forEach(m => map.set(m.id, m));
            formattedMsgs.forEach(m => map.set(m.id, m));
            return Array.from(map.values());
          });
        }

        const { data: cloudReqs } = await supabase.from('work_requests').select('*').order('created_at', { ascending: false });
        if (cloudReqs && cloudReqs.length > 0) {
          setRequests(cloudReqs);
        }

        const { data: cloudStores } = await supabase.from('stores').select('*');
        if (cloudStores && cloudStores.length > 0) {
          setStores(cloudStores);
        }
      } catch (err) {
        console.warn('Supabase initial fetch note:', err.message);
      }
    };

    fetchCloudData();

    // 2-Second Fail-Safe Background Sync for instant multi-PC messaging
    const pollInterval = setInterval(() => {
      fetchCloudData();
    }, 2000);

    // Supabase Realtime Subscription Channel
    const channel = supabase
      .channel('public:realtime_store_hub')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_users' }, payload => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const u = payload.new;
          const formatted = {
            id: u.id || u.username,
            username: u.username || u.id,
            name: u.name,
            dept: u.department || u.dept,
            department: u.department || u.dept,
            role: u.role || '직원',
            status: '재직'
          };
          setUsers(prev => {
            const exists = prev.some(existing => (existing.id === formatted.id || existing.username === formatted.username));
            if (exists) {
              return prev.map(existing => (existing.id === formatted.id || existing.username === formatted.username) ? formatted : existing);
            }
            const updated = [...prev, formatted];
            localStorage.setItem('store_work_hub_users', JSON.stringify(updated));
            return updated;
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, payload => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const r = payload.new;
          const formatted = {
            id: r.id,
            name: r.name,
            description: r.description,
            members: typeof r.members === 'string' ? JSON.parse(r.members) : (r.members || []),
            createdAt: r.created_at || r.createdAt
          };
          setRooms(prev => {
            const exists = prev.some(existing => existing.id === formatted.id);
            if (exists) {
              return prev.map(existing => existing.id === formatted.id ? formatted : existing);
            }
            return [...prev, formatted];
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, payload => {
        if (payload.eventType === 'INSERT') {
          const newM = payload.new;
          const formatted = {
            id: newM.id,
            roomId: newM.room_id || newM.roomId || 'ROOM-1',
            senderId: newM.sender_id || newM.senderId,
            senderName: newM.sender_name || newM.senderName,
            senderDept: newM.sender_dept || newM.senderDept,
            content: newM.content,
            isWorkRequest: newM.is_work_request || newM.isWorkRequest,
            category: newM.category,
            storeName: newM.store_name || newM.storeName,
            bizNo: newM.biz_no || newM.bizNo,
            status: newM.status,
            createdAt: newM.created_at || newM.createdAt
          };
          setChatMessages(prev => {
            if (prev.some(m => m.id === formatted.id)) return prev;
            return [...prev, formatted];
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'work_requests' }, payload => {
        if (payload.eventType === 'INSERT') {
          const newReq = payload.new;
          setRequests(prev => {
            if (prev.some(r => r.id === newReq.id)) return prev;
            if (newReq.targetTeam && currentTeam && newReq.targetTeam.includes(currentTeam)) {
              setActivePopup(newReq);
            }
            return [newReq, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          setRequests(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
        }
      })
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [currentTeam]);

  // Chat Handlers
  const handleCreateRoom = async (newRoom) => {
    setRooms(prev => [...prev, newRoom]);
    setCurrentRoomId(newRoom.id);

    try {
      const roomPayload = {
        id: newRoom.id,
        name: newRoom.name || '업무방',
        description: newRoom.description || '',
        members: typeof newRoom.members === 'string' ? newRoom.members : JSON.stringify(newRoom.members || []),
        created_at: newRoom.createdAt || new Date().toISOString()
      };
      await supabase.from('chat_rooms').insert([roomPayload]);
    } catch (e) {
      console.warn('Cloud sync create room note:', e);
    }
  };

  const handleUpdateRoomMembers = async (roomId, newMembers) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, members: newMembers } : r));

    try {
      const existingRoom = rooms.find(r => r.id === roomId);
      const roomPayload = {
        id: roomId,
        name: existingRoom?.name || '업무방',
        description: existingRoom?.description || '',
        members: JSON.stringify(newMembers || []),
        created_at: existingRoom?.createdAt || new Date().toISOString()
      };
      await supabase.from('chat_rooms').upsert([roomPayload]);
    } catch (e) {
      console.warn('Cloud sync update room members note:', e);
    }
  };

  const handleSendMessage = async (newMsg) => {
    setChatMessages(prev => [...prev, newMsg]);

    // Async push to Supabase Cloud DB with sanitized null values
    try {
      const msgPayload = {
        id: newMsg.id,
        room_id: newMsg.roomId || 'ROOM-1',
        sender_id: newMsg.senderId || 'user',
        sender_name: newMsg.senderName || '직원',
        sender_dept: newMsg.senderDept || '일반부서',
        content: newMsg.content || '',
        is_work_request: !!newMsg.isWorkRequest,
        category: newMsg.category || null,
        store_name: newMsg.storeName || null,
        biz_no: newMsg.bizNo || null,
        status: newMsg.status || null,
        created_at: (() => {
          if (!newMsg.createdAt) return new Date().toISOString();
          try {
            const d = new Date(newMsg.createdAt);
            return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
          } catch (e) {
            return new Date().toISOString();
          }
        })()
      };

      const { error: msgErr } = await supabase.from('chat_messages').insert([msgPayload]);
      if (msgErr) {
        console.error('Cloud sync chat message error:', msgErr);
      }
    } catch (e) {
      console.warn('Cloud sync chat message note:', e);
    }

    // If it's a work request card, sync to work requests list too
    if (newMsg.isWorkRequest) {
      const storeObj = stores.find(s => s.storeName === newMsg.storeName) || stores[0];
      const newReq = {
        id: `REQ-${Date.now().toString().slice(-6)}`,
        storeId: storeObj?.id || 'ST-001',
        bizNo: newMsg.bizNo || storeObj?.bizNo || '',
        region: storeObj?.region || '강남구',
        storeName: newMsg.storeName || '가맹점',
        category: newMsg.category || 'POS 메뉴추가/수정',
        content: newMsg.content,
        contact: storeObj?.contact || '010-0000-0000',
        status: '신규',
        targetTeam: currentTeam,
        sender: `${newMsg.senderName} (${newMsg.senderId})`,
        authorName: newMsg.senderName,
        authorUserId: newMsg.senderId,
        createdAt: newMsg.createdAt,
        updatedAt: newMsg.createdAt,
        images: [],
        priority: '보통',
        isConfirmed: false
      };
      setRequests(prev => [newReq, ...prev]);

      try {
        await supabase.from('work_requests').insert([newReq]);
      } catch (e) {
        console.warn('Cloud sync work request note:', e);
      }
    }
  };

  // Auth Handlers (Session scope)
  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    sessionStorage.setItem('store_work_hub_current_user', JSON.stringify(userObj));
    setIsAuthModalOpen(false);

    // Sync logged in user into users state if not present
    setUsers(prev => {
      const uid = userObj.id || userObj.username;
      const uname = userObj.name;
      const uuser = userObj.username;
      const exists = prev.some(u => u.id === uid || u.username === uuser || u.name === uname);
      if (exists) return prev;
      const newUserItem = {
        id: uid,
        username: uuser,
        name: uname,
        dept: userObj.department || '일반부서',
        department: userObj.department || '일반부서',
        role: userObj.role || '직원',
        status: '재직'
      };
      const updated = [...prev, newUserItem];
      localStorage.setItem('store_work_hub_users', JSON.stringify(updated));
      return updated;
    });
  };

  // Handlers for Dept & User Management
  const handleAddDepartment = (newDept) => {
    setDepartments(prev => [...prev, newDept]);
  };

  const handleDeleteDepartment = (id) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const handleAddUser = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Store & Request Handlers
  const handleSaveStore = async (savedStore) => {
    setStores(prev => {
      const exists = prev.some(s => s.id === savedStore.id);
      if (exists) {
        return prev.map(s => s.id === savedStore.id ? savedStore : s);
      }
      return [savedStore, ...prev];
    });
    setEditingStore(null);
  };

  const handleViewStoreDetail = (storeObjOrId) => {
    if (!storeObjOrId) return;
    if (typeof storeObjOrId === 'string') {
      const found = stores.find(s => s.id === storeObjOrId || s.bizNo === storeObjOrId || s.storeName === storeObjOrId);
      setEditingStore(found || stores[0]);
    } else {
      setEditingStore(storeObjOrId);
    }
    setIsStoreModalOpen(true);
  };

  const handleCreateRequest = async (newReq) => {
    setRequests(prev => [newReq, ...prev]);

    if (newReq.targetTeam.includes(currentTeam)) {
      setActivePopup(newReq);
    }
  };

  const handleSaveRequestDetail = async (updatedReq) => {
    setRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
  };

  // Test popup trigger handler
  const handleTriggerTestPopup = () => {
    const randomStore = stores[Math.floor(Math.random() * stores.length)];
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

    const testReq = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      storeId: randomStore.id,
      bizNo: randomStore.bizNo,
      region: randomStore.region,
      storeName: randomStore.storeName,
      category: 'POS 메뉴추가/수정',
      content: `[실시간 팝업 테스트] ${randomStore.storeName}에서 사이드메뉴 가격 변경 및 영수증 하단 텍스트 수정 연락요청 접수.`,
      contact: randomStore.contact,
      status: '신규',
      targetTeam: currentTeam,
      sender: currentUser ? `${currentUser.name} (${currentUser.username})` : '테스트사용자',
      authorName: currentUser ? currentUser.name : '테스트사용자',
      authorUserId: currentUser ? currentUser.username : 'test',
      createdAt: formattedDate,
      updatedAt: formattedDate,
      images: [
        "https://images.unsplash.com/photo-1556742049-0a67daf407c0?auto=format&fit=crop&w=800&q=80"
      ],
      imageCount: 1,
      priority: '긴급',
      isConfirmed: false,
      processNote: '',
      processedBy: ''
    };

    handleCreateRequest(testReq);
  };

  // Compute Stats
  const stats = {
    new: requests.filter(r => r.status === '신규').length,
    processing: requests.filter(r => r.status === '진행중').length,
    done: requests.filter(r => r.status === '완료').length
  };

  return (
    <div className="app-container">
      {/* Downloading Progress Banner */}
      {downloadProgressPercent > 0 && downloadProgressPercent < 100 && (
        <div style={{
          background: 'linear-gradient(90deg, #0284c7, #0369a1)',
          color: '#ffffff',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 99999
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⏳ 웹브라우저 없이 최신 버전 패치를 앱 내부에서 백그라운드 다운로드 중입니다... ({downloadProgressPercent}%)</span>
          </div>
          <div style={{
            width: '120px',
            height: '8px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${downloadProgressPercent}%`,
              height: '100%',
              backgroundColor: '#ffffff',
              transition: 'width 0.2s'
            }} />
          </div>
        </div>
      )}

      {/* Downloaded Update 1-Click Auto Install Banner */}
      {downloadedUpdateVersion && (
        <div style={{
          background: 'linear-gradient(90deg, #059669, #10b981)',
          color: '#ffffff',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 99999
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎉 최신 버전(v{downloadedUpdateVersion}) 패치가 다운로드 완료되었습니다!</span>
          </div>
          <button 
            onClick={() => {
              if (window.electronAPI) window.electronAPI.quitAndInstall();
            }}
            style={{
              backgroundColor: '#ffffff',
              color: '#059669',
              border: 'none',
              padding: '5px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            지금 클릭하여 1초 만에 자동 교체 재시작 ➔
          </button>
        </div>
      )}

      {/* Realtime GitHub Update Banner if new release is published */}
      {updateAvailableInfo && !downloadedUpdateVersion && (
        <div style={{
          background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
          color: '#ffffff',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 99999
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🚀 새로운 최신 기능 버전(v{updateAvailableInfo.version})이 출시되었습니다! (현재 사용 중: v{CURRENT_APP_VERSION})</span>
          </div>
          <button 
            onClick={() => {
              if (window.electronAPI) {
                window.electronAPI.openExternal(updateAvailableInfo.downloadUrl);
              } else {
                window.open(updateAvailableInfo.downloadUrl, '_blank');
              }
            }}
            style={{
              backgroundColor: '#ffffff',
              color: '#2563eb',
              border: 'none',
              padding: '5px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            최신 버전 다운로드 / 즉시 업데이트 ➔
          </button>
        </div>
      )}

      {/* Top Navbar Header */}
      <Header 
        theme={theme}
        setTheme={setTheme}
        onOpenNewRequest={() => setIsRequestModalOpen(true)}
        onOpenNewStore={() => {
          setEditingStore(null);
          setIsStoreModalOpen(true);
        }}
        onOpenDeptModal={() => setIsDeptManageModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onShowSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onCheckUpdate={handleManualUpdateCheck}
      />

      {/* Main App Section */}
      <div className="main-wrapper">
        {/* Left Sidebar */}
        <Sidebar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchReset={() => setSearchQuery('')}
          onOpenNewStore={() => {
            setEditingStore(null);
            setIsStoreModalOpen(true);
          }}
          onTriggerTestPopup={handleTriggerTestPopup}
          onOpenHelpModal={() => setIsHelpModalOpen(true)}
          onOpenCidModal={() => setIsCidModalOpen(true)}
          onOpenMemoModal={() => setIsMemoModalOpen(true)}
          onOpenDeptModal={() => setIsDeptManageModalOpen(true)}
          stats={stats}
        />

        {/* Center Viewport */}
        <main className="content-viewport">
          {/* Top Tabs */}
          <div className="tabs-header-bar">
            <button 
              className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <span>💬 업무채팅방</span>
              <span className="tab-badge">{rooms.length}</span>
            </button>

            <button 
              className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveTab('status')}
            >
              <span>업무전송현황</span>
            </button>

            <button 
              className={`tab-button ${activeTab === 'stores' ? 'active' : ''}`}
              onClick={() => setActiveTab('stores')}
            >
              <span>가맹점 / 매장관리</span>
              <span className="tab-badge">{stores.length}</span>
            </button>
          </div>

          {/* Active Tab View */}
          <div className="tab-content-area" style={{ padding: activeTab === 'chat' ? 0 : '8px 10px' }}>
            {activeTab === 'chat' && (
              <ChatWorkspace 
                currentUser={currentUser}
                rooms={rooms}
                currentRoomId={currentRoomId}
                onSelectRoom={(roomId) => setCurrentRoomId(roomId)}
                onOpenCreateRoom={() => setIsCreateRoomModalOpen(true)}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                stores={stores}
                users={users}
                onOpenNewStore={() => {
                  setEditingStore(null);
                  setIsStoreModalOpen(true);
                }}
                onUpdateRoomMembers={handleUpdateRoomMembers}
              />
            )}

            {activeTab === 'status' && (
              <WorkStatusTab 
                requests={requests}
                teams={departments}
              />
            )}

            {activeTab === 'stores' && (
              <StoreManageTab 
                stores={stores}
                onOpenNewStore={() => {
                  setEditingStore(null);
                  setIsStoreModalOpen(true);
                }}
                onEditStore={(store) => {
                  setEditingStore(store);
                  setIsStoreModalOpen(true);
                }}
                onOpenNewRequest={() => setIsRequestModalOpen(true)}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </main>
      </div>

      {/* Bottom Footer Status Bar */}
      <footer className="app-footer">
        <div>
          <span>
            {currentUser ? (
              <>접속 계정: <b>{currentUser.name} ({currentUser.username})</b> | 소속: <b>{currentUser.department}</b></>
            ) : (
              <b>로그인 필요</b>
            )}
          </span>
        </div>
        <div>
          <span>Store Work Hub v3.0 Google Chat Edition (2026)</span>
        </div>
      </footer>

      {/* Floating Desktop Live Team Popup */}
      <TeamPopupNotification 
        activePopup={activePopup}
        onOpenDetail={(req) => setDetailRequest(req)}
        onDismiss={() => setActivePopup(null)}
      />

      {/* Mandatory Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen || !currentUser}
        onLoginSuccess={handleLoginSuccess}
        departments={departments}
      />

      <CreateRoomModal 
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        users={users}
        currentUser={currentUser}
        onCreateRoom={handleCreateRoom}
      />

      <SupabaseModal 
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      <StoreDetailModal 
        isOpen={isStoreModalOpen}
        onClose={() => {
          setIsStoreModalOpen(false);
          setEditingStore(null);
        }}
        store={editingStore || stores[0]}
        onSaveStore={handleSaveStore}
        requests={requests}
        onOpenNewRequest={(storeId) => {
          setIsStoreModalOpen(false);
          setIsRequestModalOpen(true);
        }}
        onOpenRequestDetail={(req) => {
          setIsStoreModalOpen(false);
          setDetailRequest(req);
        }}
      />

      <WorkRequestModal 
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        stores={stores}
        categories={CATEGORIES}
        currentUser={currentUser}
        onSubmitRequest={handleCreateRequest}
        onOpenUserSelectModal={() => setIsUserSelectModalOpen(true)}
      />

      <UserSelectModal 
        isOpen={isUserSelectModalOpen}
        onClose={() => setIsUserSelectModalOpen(false)}
        departments={departments}
        users={users}
        onConfirmSelection={(selectedText) => {
          // Handled via selection
        }}
      />

      <DepartmentManageModal 
        isOpen={isDeptManageModalOpen}
        onClose={() => setIsDeptManageModalOpen(false)}
        departments={departments}
        users={users}
        onAddDepartment={handleAddDepartment}
        onDeleteDepartment={handleDeleteDepartment}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
      />

      <RequestDetailModal 
        isOpen={!!detailRequest}
        onClose={() => setDetailRequest(null)}
        request={detailRequest}
        stores={stores}
        allRequests={requests}
        onSaveRequest={handleSaveRequestDetail}
        onOpenImageGallery={(url) => setGalleryImageUrl(url)}
        onViewStoreDetail={handleViewStoreDetail}
      />

      <ImageGalleryModal 
        isOpen={!!galleryImageUrl}
        onClose={() => setGalleryImageUrl(null)}
        imageUrl={galleryImageUrl}
      />

      <CidModal 
        isOpen={isCidModalOpen}
        onClose={() => setIsCidModalOpen(false)}
        onQuickRequestFromCid={() => setIsRequestModalOpen(true)}
      />

      <MemoModal 
        isOpen={isMemoModalOpen}
        onClose={() => setIsMemoModalOpen(false)}
      />

      <HelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <SmsModal 
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
      />
    </div>
  );
}
