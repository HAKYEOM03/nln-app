const KEYS = {
  USERS: 'makepro_users',
  NOTICES: 'makepro_notices',
  SUBMISSIONS: 'makepro_submissions',
  CODE_FILES: 'makepro_code_files',
}

function getStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

const ADMIN_ACCOUNT = {
  id: 'admin',
  username: 'admin',
  password: 'admin123',
  name: '관리자',
  role: 'admin',
  permissions: ['all'],
  createdAt: '2024-01-01T00:00:00',
}

export function initDB() {
  const users = getStore(KEYS.USERS)
  if (!users.find((u) => u.username === 'admin')) {
    setStore(KEYS.USERS, [ADMIN_ACCOUNT, ...users])
  }
}

export function getUsers() {
  return getStore(KEYS.USERS)
}

export function getUser(username) {
  return getStore(KEYS.USERS).find((u) => u.username === username)
}

export function registerUser(userData) {
  const users = getStore(KEYS.USERS)
  if (users.find((u) => u.username === userData.username)) {
    throw new Error('이미 존재하는 아이디입니다.')
  }
  if (users.find((u) => u.email === userData.email)) {
    throw new Error('이미 등록된 이메일입니다.')
  }
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    role: 'user',
    permissions: [],
    createdAt: new Date().toISOString(),
  }
  setStore(KEYS.USERS, [...users, newUser])
  return newUser
}

export function loginUser(username, password) {
  const user = getStore(KEYS.USERS).find(
    (u) => u.username === username && u.password === password
  )
  if (!user) throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
  return user
}

export function updateUser(userId, updates) {
  const users = getStore(KEYS.USERS)
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) throw new Error('사용자를 찾을 수 없습니다.')
  users[idx] = { ...users[idx], ...updates }
  setStore(KEYS.USERS, users)
  return users[idx]
}

export function deleteUser(userId) {
  const users = getStore(KEYS.USERS).filter((u) => u.id !== userId)
  setStore(KEYS.USERS, users)
}

export function getNotices() {
  return getStore(KEYS.NOTICES).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function addNotice(notice) {
  const notices = getStore(KEYS.NOTICES)
  const newNotice = {
    id: Date.now().toString(),
    ...notice,
    createdAt: new Date().toISOString(),
  }
  setStore(KEYS.NOTICES, [...notices, newNotice])
  return newNotice
}

export function updateNotice(noticeId, updates) {
  const notices = getStore(KEYS.NOTICES)
  const idx = notices.findIndex((n) => n.id === noticeId)
  if (idx === -1) return
  notices[idx] = { ...notices[idx], ...updates }
  setStore(KEYS.NOTICES, notices)
}

export function deleteNotice(noticeId) {
  setStore(KEYS.NOTICES, getStore(KEYS.NOTICES).filter((n) => n.id !== noticeId))
}

export function getSubmissions() {
  return getStore(KEYS.SUBMISSIONS).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function addSubmission(submission) {
  const subs = getStore(KEYS.SUBMISSIONS)
  const newSub = {
    id: Date.now().toString(),
    ...submission,
    createdAt: new Date().toISOString(),
  }
  setStore(KEYS.SUBMISSIONS, [...subs, newSub])
  return newSub
}

export function getCodeFiles(userId) {
  return getStore(KEYS.CODE_FILES)
    .filter((f) => f.userId === userId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function getAllCodeFiles() {
  return getStore(KEYS.CODE_FILES).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function saveCodeFile(fileData) {
  const files = getStore(KEYS.CODE_FILES)
  const existing = files.findIndex(
    (f) => f.userId === fileData.userId && f.fileName === fileData.fileName
  )
  const entry = {
    id: existing >= 0 ? files[existing].id : Date.now().toString(),
    ...fileData,
    updatedAt: new Date().toISOString(),
    history: existing >= 0
      ? [...(files[existing].history || []), { date: new Date().toISOString(), action: '리뉴얼' }]
      : [{ date: new Date().toISOString(), action: '최초 업로드' }],
  }
  if (existing >= 0) {
    files[existing] = entry
  } else {
    files.push(entry)
  }
  setStore(KEYS.CODE_FILES, files)
  return entry
}
