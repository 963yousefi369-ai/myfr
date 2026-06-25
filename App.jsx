import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'

// صفحات اصلی
import Home           from './pages/Home.jsx'
import NotFound       from './pages/NotFound.jsx'

// فاز ۳
import Products       from './pages/Products.jsx'
import ProductDetail  from './pages/ProductDetail.jsx'

// فاز ۴
import Login          from './pages/Login.jsx'
import Register       from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

// فاز ۵
import Cart           from './pages/Cart.jsx'
import Checkout       from './pages/Checkout.jsx'
import PaymentResult  from './pages/PaymentResult.jsx'

// فاز ۶
import Profile        from './pages/Profile.jsx'
import Orders         from './pages/Orders.jsx'
import OrderDetail    from './pages/OrderDetail.jsx'
import Addresses      from './pages/Addresses.jsx'
import ChangePassword from './pages/ChangePassword.jsx'

// فاز ۷
import Software       from './pages/Software.jsx'
import Blog           from './pages/Blog.jsx'
import BlogPost       from './pages/BlogPost.jsx'
import About          from './pages/About.jsx'
import Contact        from './pages/Contact.jsx'

// فاز ۸ — ادمین
import AdminLogin     from './pages/admin/AdminLogin.jsx'
import AdminLayout    from './components/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminBanners   from './pages/admin/AdminBanners.jsx'
import AdminProductsUI from './pages/admin/AdminProductsUI.jsx'
import AdminPartners  from './pages/admin/AdminPartners.jsx'
import AdminBlog      from './pages/admin/AdminBlog.jsx'
import AdminBlogEdit  from './pages/admin/AdminBlogEdit.jsx'
import AdminSiteConfig from './pages/admin/AdminSiteConfig.jsx'
import AdminGuard     from './components/admin/AdminGuard.jsx'

export default function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* ─── ادمین (خارج از Layout اصلی) ─── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index                element={<AdminDashboard />} />
          <Route path="banners"       element={<AdminBanners />} />
          <Route path="products-ui"   element={<AdminProductsUI />} />
          <Route path="partners"      element={<AdminPartners />} />
          <Route path="blog"          element={<AdminBlog />} />
          <Route path="blog/:id"      element={<AdminBlogEdit />} />
          <Route path="site-config"   element={<AdminSiteConfig />} />
        </Route>

        {/* ─── سایت اصلی ─── */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products"           element={<Products />} />
          <Route path="products/:id"       element={<ProductDetail />} />
          <Route path="software"           element={<Software />} />
          <Route path="blog"               element={<Blog />} />
          <Route path="blog/:slug"         element={<BlogPost />} />
          <Route path="about"              element={<About />} />
          <Route path="contact"            element={<Contact />} />
          <Route path="login"              element={<Login />} />
          <Route path="register"           element={<Register />} />
          <Route path="forgot-password"    element={<ForgotPassword />} />
          <Route path="payment/result"     element={<PaymentResult />} />

          <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="profile/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="profile/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="profile/addresses" element={<PrivateRoute><Addresses /></PrivateRoute>} />
          <Route path="profile/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}
