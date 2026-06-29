import { db } from './firebase'
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy
} from 'firebase/firestore'

const COL = {
  USERS: 'users',
  NOTICES: 'notices',
  SUBMISSIONS: 'submissions',
  CODE_FILES: 'code_files',
}

export async function initDB() {
  const q = query(collection(db, COL.USERS), where('username', '==', 'admin'))
  const snap = await getDocs(q)
  if (snap.empty) {
    await addDoc(collection(db, COL.USERS), {
      username: 'admin',
      password: 'admin123',
      name: '관리자',
      role: 'admin',
      permissions: ['all'],
      createdAt: '2024-01-01T00:00:00',
    })
  }
}

export async function getUsers() {
  const snap = await getDocs(collection(db, COL.USERS))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getUser(username) {
  const q = query(collection(db, COL.USERS), where('username', '==', username))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function registerUser(userData) {
  const users = await getUsers()
  if (users.find(u => u.username === userData.username)) {
    throw new Error('이미 존재하는 아이디입니다.')
  }
  if (users.find(u => u.email === userData.email)) {
    throw new Error('이미 등록된 이메일입니다.')
  }
  const newUser = {
    ...userData,
    role: 'user',
    permissions: [],
    createdAt: new Date().toISOString(),
  }
  const ref = await addDoc(collection(db, COL.USERS), newUser)
  return { id: ref.id, ...newUser }
}

export async function loginUser(username, password) {
  const q = query(
    collection(db, COL.USERS),
    where('username', '==', username),
    where('password', '==', password)
  )
  const snap = await getDocs(q)
  if (snap.empty) throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function updateUser(userId, updates) {
  const ref = doc(db, COL.USERS, userId)
  await updateDoc(ref, updates)
  return { id: userId, ...updates }
}

export async function deleteUser(userId) {
  await deleteDoc(doc(db, COL.USERS, userId))
}

export async function getNotices() {
  const snap = await getDocs(collection(db, COL.NOTICES))
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function addNotice(notice) {
  const newNotice = { ...notice, createdAt: new Date().toISOString() }
  const ref = await addDoc(collection(db, COL.NOTICES), newNotice)
  return { id: ref.id, ...newNotice }
}

export async function deleteNotice(noticeId) {
  await deleteDoc(doc(db, COL.NOTICES, noticeId))
}

export async function getSubmissions() {
  const snap = await getDocs(collection(db, COL.SUBMISSIONS))
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function addSubmission(submission) {
  const newSub = { ...submission, createdAt: new Date().toISOString() }
  const ref = await addDoc(collection(db, COL.SUBMISSIONS), newSub)
  return { id: ref.id, ...newSub }
}

export async function getCodeFiles(userId) {
  const q = query(collection(db, COL.CODE_FILES), where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export async function getAllCodeFiles() {
  const snap = await getDocs(collection(db, COL.CODE_FILES))
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export async function saveCodeFile(fileData) {
  const q = query(
    collection(db, COL.CODE_FILES),
    where('userId', '==', fileData.userId),
    where('fileName', '==', fileData.fileName)
  )
  const snap = await getDocs(q)

  if (!snap.empty) {
    const existing = snap.docs[0]
    const old = existing.data()
    const updated = {
      ...fileData,
      updatedAt: new Date().toISOString(),
      history: [...(old.history || []), { date: new Date().toISOString(), action: '리뉴얼' }],
    }
    await updateDoc(doc(db, COL.CODE_FILES, existing.id), updated)
    return { id: existing.id, ...updated }
  } else {
    const entry = {
      ...fileData,
      updatedAt: new Date().toISOString(),
      history: [{ date: new Date().toISOString(), action: '최초 업로드' }],
    }
    const ref = await addDoc(collection(db, COL.CODE_FILES), entry)
    return { id: ref.id, ...entry }
  }
}
