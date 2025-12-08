import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

// --- Admin imports ---
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminGuard from "./admin/AdminGuard.jsx";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import AdminProducts from "./admin/pages/AdminProducts.jsx";
import AdminCategories from "./admin/pages/AdminCategories.jsx";
import AdminOrders from "./admin/pages/AdminOrders.jsx";
import AdminSales from "./admin/pages/AdminSales.jsx";

// Shared layout for normal (non-admin) pages
function SiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* -------- Normal site routes -------- */}
      <Route
        path="/"
        element={
          <SiteLayout>
            <Home />
          </SiteLayout>
        }
      />
      <Route
        path="/products"
        element={
          <SiteLayout>
            <Products />
          </SiteLayout>
        }
      />
      <Route
        path="/products/:id"
        element={
          <SiteLayout>
            <ProductDetails />
          </SiteLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <SiteLayout>
            <Cart />
          </SiteLayout>
        }
      />
      <Route
        path="/login"
        element={
          <SiteLayout>
            <Login />
          </SiteLayout>
        }
      />
      <Route
        path="/register"
        element={
          <SiteLayout>
            <Register />
          </SiteLayout>
        }
      />

      {/* -------- Admin routes -------- */}
      {/* Admin login is public */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Everything else under /admin is protected */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="sales" element={<AdminSales />} />
      </Route>

      {/* -------- 404 -------- */}
      <Route
        path="*"
        element={
          <SiteLayout>
            <NotFound />
          </SiteLayout>
        }
      />
    </Routes>
  );
}
