# Bugs Found in AFI Next Project

## 1. Blog Image URL Construction Bug

**File**: `src/app/(main)/blog/page.tsx` (lines 30-34)

**Issue**: The `coverSrc` construction logic incorrectly handles empty strings and absolute paths, potentially creating invalid image URLs.

**Code**:
```typescript
const coverSrc = post.featured_image
  ? post.featured_image.startsWith('http')
    ? post.featured_image
    : `${apiBase}${post.featured_image}`
  : null
```

**Problems**:
- If `post.featured_image` is an empty string (`""`):
  - It's truthy (passes first check)
  - Doesn't start with 'http' (goes to else branch)
  - Results in `${apiBase}${""}` = `http://localhost:8000` (invalid image URL)
- If `post.featured_image` starts with "/" (absolute path):
  - Results in `${apiBase}${"/image.jpg"}` = `http://localhost:8000//image.jpg` (double slash)

**Impact**: Broken images in blog listings when featured_image is empty or an absolute path.

**Fix**:
```typescript
const coverSrc = post.featured_image && post.featured_image.trim() !== ''
  ? post.featured_image.startsWith('http')
    ? post.featured_image
    : post.featured_image.startsWith('/')
      ? `${apiBase}${post.featured_image}`
      : `${apiBase}/${post.featured_image}`
  : null
```

---

## 2. Misleading Error Message in OTP Verification

**File**: `src/components/auth/OtpForm.tsx` (lines 82-94)

**Issue**: When OTP verification succeeds but fetching the user profile fails, the user sees a misleading error message suggesting the OTP was wrong or expired.

**Code**:
```typescript
try {
  const { access } = await verifyOtp(phone, otp)
  const user = await getProfile(access)
  // ... success handling
} catch {
  toast.error('کد وارد شده اشتباه یا منقضی شده است')  // Shown for BOTH failures
}
```

**Impact**: Users may retry OTP verification unnecessarily when the actual issue is a profile fetch failure (network error, server issue, etc.).

**Fix**: Separate error handling or provide more specific messages:
```typescript
try {
  const { access } = await verifyOtp(phone, otp)
  try {
    const user = await getProfile(access)
    // ... success handling
  } catch (profileError) {
    toast.error('خطا در دریافت اطلاعات کاربری. لطفاً دوباره تلاش کنید.')
    // Optionally: clear OTP field to force re-entry
    setOtp('')
  }
} catch (otpError) {
  toast.error('کد وارد شده اشتباه یا منقضی شده است')
  setOtp('')
}
```

---

## 3. Missing Cookie Security Attributes

**File**: `src/lib/store/auth.ts` (lines 28, 32)

**Issue**: Authentication cookies are missing the `SameSite` attribute, which increases vulnerability to CSRF attacks.

**Code**:
```typescript
setAuth: (token, user) => {
  document.cookie = `afi_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}`
  set({ token, user })
},
logout: () => {
  document.cookie = 'afi_token=; path=/; max-age=0'
  set({ token: null, user: null })
},
```

**Impact**: Without `SameSite` attribute, the cookie may be sent with cross-site requests, potentially enabling CSRF attacks depending on how the backend validates requests.

**Fix**: Add `SameSite=Lax` (or `Strict` if appropriate for your use case):
```typescript
setAuth: (token, user) => {
  document.cookie = `afi_token=${token}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`
  set({ token, user })
},
logout: () => {
  document.cookie = 'afi_token=; path=/; SameSite=Lax; max-age=0'
  set({ token: null, user: null })
},
```

**Note**: Cannot use `HttpOnly` because the client-side JavaScript needs to read/delete the cookie for the logout functionality to work properly.