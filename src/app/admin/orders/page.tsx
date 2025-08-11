"use client";

import React, { useState, useMemo } from 'react';
import Modal from '@/components/Modal';
import { getOrders, updateOrderStatus, updateOrder } from '@/data/mockDatabase'; // 引入 updateOrder

export default function OrdersPage() {
  const [orders, setOrders] = useState(getOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('所有狀態');
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // 模態框中編輯的訂單副本

  const orderStatuses = ['所有狀態', '待處理', '已確認', '配送中', '已完成', '已取消'];

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm);
      const matchesStatus = filterStatus === '所有狀態' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, filterStatus]);

  const handleViewDetails = (order: any) => {
    setSelectedOrder({ ...order }); // 傳遞訂單的副本到模態框，避免直接修改原始狀態
    setIsOrderDetailsModalOpen(true);
  };

  const handleUpdateStatus = (orderId: number, newStatus: string) => {
    updateOrderStatus(orderId, newStatus); // 更新到 mockDatabase
    setOrders(getOrders()); // 從 mockDatabase 重新獲取最新列表
    alert(`訂單 ${orderId} 狀態已更新為 ${newStatus}`);
  };

  // 處理模態框中商品價格的變動
  const handleModalOrderItemPriceChange = (itemIndex: number, newUnitPrice: number) => {
    setSelectedOrder(prevSelectedOrder => {
      if (!prevSelectedOrder || !prevSelectedOrder.items) {
        return prevSelectedOrder;
      }
      const updatedItems = prevSelectedOrder.items.map((item: any, idx: number) => {
        if (idx === itemIndex) {
          return { ...item, unitPrice: newUnitPrice };
        }
        return item;
      });
      const newTotalAmount = updatedItems.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0);
      return { ...prevSelectedOrder, items: updatedItems, totalAmount: newTotalAmount };
    });
  };

  // 儲存模態框中修改後的訂單
  const handleSaveOrderChanges = () => {
    if (selectedOrder) {
      updateOrder(selectedOrder); // 將修改後的訂單保存到 mockDatabase
      setOrders(getOrders()); // 從 mockDatabase 重新獲取最新列表
      setIsOrderDetailsModalOpen(false); // 關閉模態框
      alert(`訂單 #${selectedOrder.id} 已更新！`);
    }
  };

  // 模擬地圖圖片 URL (將所有訂單地址拼接成一個字串作為地圖查詢參數)
  const mapImageUrl = useMemo(() => {
    const addresses = filteredOrders.map(order => order.deliveryAddress).join('|');
    if (!addresses) return '';
    // 這裡使用一個假的靜態地圖服務URL，實際應用中會替換為Google Maps Static API等
    // 為了簡化，這裡只是一個示意圖，不會真的顯示所有地址的標記
    return `https://via.placeholder.com/600x300?text=訂單配送地圖\n${encodeURIComponent(addresses)}`;
  }, [filteredOrders]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">訂單管理</h1>

      {/* 訂單地圖概覽 (原型) */}
      {mapImageUrl && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">訂單配送地圖概覽</h2>
          <img src={mapImageUrl} alt="訂單配送地圖" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-gray-500 mt-2">此為模擬地圖，實際應用中將整合地圖服務顯示精確位置。</p>
        </div>
      )}

      {/* 篩選與搜尋 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="搜尋客戶姓名、電話或地址..."
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {orderStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* 訂單列表 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訂單號</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客戶</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地址</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">總金額</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訂單日期</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.deliveryAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NT$ {order.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                    order.status === '待處理' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === '已確認' ? 'bg-blue-100 text-blue-800' :
                    order.status === '配送中' ? 'bg-purple-100 text-purple-800' :
                    order.status === '已完成' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleViewDetails(order)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    詳情
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="border border-gray-300 p-1 rounded-md text-gray-900 text-sm"
                  >
                    {orderStatuses.filter(s => s !== '所有狀態').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  沒有找到符合條件的訂單。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 訂單詳情模態框 */}
      {selectedOrder && (
        <Modal
          isOpen={isOrderDetailsModalOpen}
          onClose={() => setIsOrderDetailsModalOpen(false)}
          title={`訂單 #${selectedOrder.id} 詳情`}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">客戶姓名: <span className="font-medium text-gray-900">{selectedOrder.customerName}</span></p>
              <p className="text-sm text-gray-600">客戶電話: <span className="font-medium text-gray-900">{selectedOrder.customerPhone}</span></p>
              <p className="text-sm text-gray-600">配送地址: <span className="font-medium text-gray-900">{selectedOrder.deliveryAddress}</span></p>
              <p className="text-sm text-gray-600">訂單日期: <span className="font-medium text-gray-900">{selectedOrder.orderDate}</span></p>
              <p className="text-sm text-gray-600">訂單狀態: <span className="font-medium text-gray-900">{selectedOrder.status}</span></p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">商品明細</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">數量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">單價</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">小計</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedOrder.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                      {item.options && item.options.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {item.options.map((opt: any, optIdx: number) => (
                            <span key={optIdx}>{opt.groupName}: {opt.value} </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.isPriceByWeight ? (
                        <input
                          type="number"
                          value={item.unitPrice === 0 ? '' : item.unitPrice} // 如果是0顯示空白
                          onChange={(e) => handleModalOrderItemPriceChange(index, Number(e.target.value))} // 呼叫新的更新函數
                          className="w-24 border border-gray-300 p-1 rounded-md text-gray-900"
                          placeholder="輸入單價"
                        />
                      ) : (
                        `NT$ ${item.unitPrice}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NT$ {(item.unitPrice * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right text-lg font-bold text-gray-800 mt-4">
              訂單總金額: NT$ {selectedOrder.totalAmount.toLocaleString()}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveOrderChanges}
              className="bg-green-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              儲存訂單
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
