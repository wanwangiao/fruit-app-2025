
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊導覽列 */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold">
          後台管理
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <a href="/admin" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
            儀表板
          </a>
          <a href="/admin/products" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
            商品管理
          </a>
          <a href="/admin/categories" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
            分類管理
          </a>
          <a href="/admin/orders" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
            訂單管理
          </a>
          <a href="/admin/inventory" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
            庫存管理
          </a>
        </nav>
      </aside>

      {/* 主要內容區 */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b">
          {/* 可以在這裡放使用者資訊或登出按鈕 */}
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
