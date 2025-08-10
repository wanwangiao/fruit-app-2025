
"use client";

import React, { useEffect, useState } from 'react';
import { getOrders, getProducts } from '@/data/mockDatabase';

// 定義訂單和商品的類型，以便在組件中使用
interface Order {
  id: number;
  status: string;
  totalAmount: number;
  orderDate: string;
}

interface Product {
  id: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 從 mockDatabase 獲取數據
    const fetchedOrders = getOrders();
    const fetchedProducts = getProducts();
    setOrders(fetchedOrders);
    setProducts(fetchedProducts);
  }, []);

  // 計算儀表板數據
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.orderDate.startsWith(today));
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === '待處理').length;
  const totalProducts = products.length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">儀表板</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 摘要卡片 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">今日訂單數</h2>
          <p className="text-4xl font-bold text-gray-800 mt-2">{todayOrders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">今日營業額</h2>
          <p className="text-4xl font-bold text-gray-800 mt-2">${todayRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">待處理訂單</h2>
          <p className="text-4xl font-bold text-orange-500 mt-2">{pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">商品總數</h2>
          <p className="text-4xl font-bold text-gray-800 mt-2">{totalProducts}</p>
        </div>
      </div>
    </div>
  );
}
