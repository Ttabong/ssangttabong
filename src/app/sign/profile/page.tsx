'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)       // 프로필 로딩 상태
  const [updating, setUpdating] = useState(false)    // 수정 처리 중 상태
  const [deleting, setDeleting] = useState(false)    // 탈퇴 처리 중 상태

  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')

  const [newNickname, setNewNickname] = useState('')
  const [nicknameAvailable, setNicknameAvailable] = useState(true)  // 닉네임 중복 여부
  const [checkingNickname, setCheckingNickname] = useState(false)   // 닉네임 체크 중 상태

  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const passwordsMatch = password1.length > 0 && password1 === password2

  // 로그인한 사용자 프로필 불러오기
  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      // 현재 로그인한 사용자 정보 가져오기
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast.error('로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.')
        router.push('/sign/LoginForm')
        return
      }

      // 프로필 테이블에서 정보 가져오기 (is_deleted = false 인 경우만)
      const { data, error } = await supabase
        .from('profiles')
        .select('email, nickname, is_deleted')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        toast.error('프로필 정보를 불러올 수 없습니다.')
      } else if (data.is_deleted) {
        // 만약 soft deleted 된 계정이라면 강제로 로그아웃 처리 후 로그인 페이지로 이동
        toast.error('탈퇴 처리된 계정입니다.')
        await supabase.auth.signOut()
        router.push('/sign/LoginForm')
      } else {
        setEmail(data.email)
        setNickname(data.nickname)
        setNewNickname(data.nickname)
      }
      setLoading(false)
    }
    loadProfile()
  }, [router])

  // 닉네임 중복 체크 (새 닉네임 입력 시)
  useEffect(() => {
    if (newNickname.trim().length === 0 || newNickname === nickname) {
      setNicknameAvailable(true)
      return
    }

    const timeout = setTimeout(async () => {
      setCheckingNickname(true)
      // 동일 닉네임을 가진 활성 사용자(삭제 안된) 프로필 조회
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('nickname', newNickname)
        .eq('is_deleted', false)  // 탈퇴 사용자는 제외
        .limit(1)
        .single()
      setNicknameAvailable(!data)
      setCheckingNickname(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [newNickname, nickname])

  // 회원정보 수정 처리 함수
  const handleUpdate = async () => {
    if (!newNickname.trim()) {
      toast.error('닉네임을 입력하세요.')
      return
    }
    if (!nicknameAvailable) {
      toast.error('닉네임이 이미 사용 중입니다.')
      return
    }
    if (password1 || password2) {
      if (!passwordsMatch) {
        toast.error('비밀번호가 일치하지 않습니다.')
        return
      }
      if (password1.length < 6) {
        toast.error('비밀번호는 최소 6자 이상이어야 합니다.')
        return
      }
    }

    setUpdating(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      toast.error('로그인 상태가 아닙니다.')
      setUpdating(false)
      return
    }

    // 닉네임 업데이트
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ nickname: newNickname })
      .eq('id', user.id)
      .eq('is_deleted', false) // 탈퇴 사용자 프로필은 수정 불가

    if (profileError) {
      toast.error('닉네임 변경에 실패했습니다: ' + profileError.message)
      setUpdating(false)
      return
    }

    // 비밀번호 업데이트 (입력했을 때만)
    if (password1) {
      const { error: pwError } = await supabase.auth.updateUser({ password: password1 })
      if (pwError) {
        toast.error('비밀번호 변경에 실패했습니다: ' + pwError.message)
        setUpdating(false)
        return
      }
    }

    toast.success('회원정보가 성공적으로 변경되었습니다.')
    setNickname(newNickname)
    setPassword1('')
    setPassword2('')
    setUpdating(false)

    router.push('/')  // 수정 완료 후 메인 페이지로 이동
  }

  // 회원 탈퇴 처리 함수 (Soft Delete)
  const handleDeleteAccount = async () => {
    const confirmed = confirm('정말로 탈퇴하시겠습니까?')
    if (!confirmed) return

    setDeleting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('로그인 상태가 아닙니다.')
      setDeleting(false)
      return
    }

    // profiles 테이블에서 is_deleted=true로 업데이트 (soft delete)
    const { error } = await supabase
      .from('profiles')
      .update({ is_deleted: true })
      .eq('id', user.id)

    if (error) {
      toast.error('탈퇴 처리에 실패했습니다: ' + error.message)
      setDeleting(false)
      return
    }

    // 탈퇴 후 즉시 로그아웃 처리 및 메인 페이지 이동
    await supabase.auth.signOut()
    toast.success('회원 탈퇴가 완료되었습니다.')
    setDeleting(false)
    router.push('/')
  }

  if (loading) {
    return <div className="text-center p-8">로딩 중...</div>
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        handleUpdate()
      }}
      className="container_l max-w-md mx-auto p-8 space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-var(--color-primary-light)"
      style={{ fontFamily: 'Nanum Gothic, sans-serif' }}
    >
      <h2 className="filter_a text-3xl font-extrabold text-center text-var(--color-primary) drop-shadow-md mb-8">
        회원정보 수정
      </h2>

      <div className="h-5"></div>

      <div className="container_lc">
        {/* 이메일 - 변경 불가 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-var(--color-primary-dark) mb-2"
          >
            이메일 (변경 불가)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled
            className="w-full px-5 py-4 rounded-lg border border-var(--color-primary-light) bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="h-3"></div>

        {/* 닉네임 변경 */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-semibold text-var(--color-primary-dark) mb-2"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={newNickname}
            onChange={e => setNewNickname(e.target.value)}
            className={`w-full px-5 py-4 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition ${
              !nicknameAvailable ? 'border-red-500' : 'border-var(--color-primary-light)'
            }`}
            placeholder=" 닉네임을 입력하세요"
            required
          />
          {checkingNickname && <p className="text-sm text-gray-500 mt-1">중복 체크 중...</p>}
          {!checkingNickname && !nicknameAvailable && (
            <p className="text-sm text-red-600 mt-1">이미 사용 중인 닉네임입니다.</p>
          )}
        </div>

        <div className="h-3"></div>

        {/* 비밀번호 변경 */}
        <div>
          <label
            htmlFor="password1"
            className="block text-sm font-semibold text-var(--color-primary-dark) mb-2"
          >
            새 비밀번호 (변경 시 입력)
          </label>
          <input
            id="password1"
            type="password"
            value={password1}
            onChange={e => setPassword1(e.target.value)}
            className="w-full px-5 py-4 rounded-lg border border-var(--color-primary-light) shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition"
            placeholder=" 새 비밀번호"
            autoComplete="new-password"
          />
        </div>

        <div className="h-2"></div>

        <div className="relative">
          <label
            htmlFor="password2"
            className="block text-sm font-semibold text-var(--color-primary-dark) mb-2"
          >
            새 비밀번호 확인
          </label>
          <input
            id="password2"
            type="password"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            className={`w-full px-5 py-4 pr-24 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition ${
              password2.length > 0 && password1 !== password2 ? 'border-red-500' : 'border-var(--color-primary-light)'
            }`}
            placeholder=" 새 비밀번호 확인"
            autoComplete="new-password"
          />
          {password2.length > 0 && password1 !== password2 && (
            <span className="absolute top-12 right-4 text-sm font-semibold text-red-600">
              불일치
            </span>
          )}
        </div>

        <div className="h-5"></div>

        {/* 수정 버튼 */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={updating}
            className="btn-login w-full bg-var(--color-primary) text-var(--color-background) py-4 px-8 rounded-lg font-semibold shadow-md hover:bg-var(--color-primary-dark) transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? '수정 중...' : '회원정보 수정'}
          </button>
        </div>

        <div className="h-3"></div>

        {/* 회원 탈퇴 버튼 */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="w-full text-red-500 py-4 px-8 rounded-lg font-semibold hover:underline hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? '탈퇴 처리 중...' : '회원 탈퇴'}
          </button>
        </div>
      </div>
    </form>
  )
}
