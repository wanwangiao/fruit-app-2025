
"use client";

import React, { useState, useMemo } from 'react';
import InputModal from '@/components/InputModal';
import Modal from '@/components/Modal'; // 引入通用 Modal 組件

// 模擬商品庫存資料，現在包含批次資訊
const initialInventory = [
  { 
    id: 1, 
    name: '高麗菜', 
    minStock: 50, 
    batches: [
      { quantity: 80, unitCost: 25, purchaseDate: '2025-08-01' },
      { quantity: 20, unitCost: 30, purchaseDate: '2025-08-05' },
      { quantity: 10, unitCost: 28, purchaseDate: '2025-08-07' },
    ]
  },
  { 
    id: 2, 
    name: '蘋果', 
    minStock: 30, 
    batches: [
      { quantity: 50, unitCost: 60, purchaseDate: '2025-08-02' },
      { quantity: 15, unitCost: 62, purchaseDate: '2025-08-06' },
    ]
  },
  { 
    id: 3, 
    name: '豬五花', 
    minStock: 20, 
    batches: [
      { quantity: 30, unitCost: 90, purchaseDate: '2025-08-03' },
    ]
  },
  { 
    id: 4, 
    name: '鮭魚片', 
    minStock: 10, 
    batches: [
      { quantity: 15, unitCost: 200, purchaseDate: '2025-08-04' },
    ]
  },
  { 
    id: 5, 
    name: '香菇貢丸', 
    minStock: 40, 
    batches: [
      { quantity: 80, unitCost: 70, purchaseDate: '2025-08-01' },
    ]
  },
  { 
    id: 6, 
    name: '金針菇', 
    minStock: 60, 
    batches: [
      { quantity: 120, unitCost: 20, purchaseDate: '2025-08-02' },
    ]
  },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // 控制歷史模態框
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [historyFilter, setHistoryFilter] = useState('all'); // all, day, week, month

  // 計算每個商品的當前總庫存
  const inventoryWithCurrentStock = useMemo(() => {
    return inventory.map(item => ({
      ...item,
      currentStock: item.batches.reduce((sum, batch) => sum + batch.quantity, 0)
    }));
  }, [inventory]);

  // 計算總庫存金額
  const totalInventoryValue = useMemo(() => {
    return inventory.reduce((total, item) => {
      return total + item.batches.reduce((sum, batch) => sum + (batch.quantity * batch.unitCost), 0);
    }, 0);
  }, [inventory]);

  const lowStockItems = useMemo(() => {
    return inventoryWithCurrentStock.filter(item => item.currentStock <= item.minStock);
  }, [inventoryWithCurrentStock]);

  const filteredInventory = useMemo(() => {
    return inventoryWithCurrentStock.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventoryWithCurrentStock, searchTerm]);

  // 處理入庫提交
  const handleReceiveSubmit = (data: any) => {
    const { quantity, unitCost, totalCost, purchaseDate } = data;
    const finalQuantity = Number(quantity);
    let finalUnitCost = Number(unitCost);

    if (totalCost && !unitCost) { // 如果只輸入了總金額和數量，計算單價
      finalUnitCost = Number(totalCost) / finalQuantity;
    } else if (unitCost && !totalCost) { // 如果只輸入了單價和數量，計算總金額
      // totalCost = finalQuantity * finalUnitCost; // 這裡不需要更新 totalCost，因為它不是狀態
    } else if (!unitCost && !totalCost) {
      alert('請輸入單品成本或總金額。');
      return;
    }

    setInventory(prev => prev.map(item => 
      item.id === selectedProduct.id 
        ? { 
            ...item, 
            batches: [...item.batches, { quantity: finalQuantity, unitCost: finalUnitCost, purchaseDate: purchaseDate || new Date().toISOString().split('T')[0] }]
          }
        : item
    ));
    alert(`已為 ${selectedProduct.name} 入庫 ${finalQuantity} 個。`);
  };

  // 處理出庫提交 (FIFO邏輯)
  const handleDispatchSubmit = (data: any) => {
    const { quantity } = data;
    let qtyToDispatch = Number(quantity);

    setInventory(prev => prev.map(item => {
      if (item.id === selectedProduct.id) {
        const newBatches = [...item.batches].sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()); // 按日期排序確保FIFO
        const updatedBatches: any[] = [];
        let remainingQty = qtyToDispatch;

        for (const batch of newBatches) {
          if (remainingQty <= 0) {
            updatedBatches.push(batch);
            continue;
          }

          if (batch.quantity <= remainingQty) {
            remainingQty -= batch.quantity;
          } else {
            updatedBatches.push({ ...batch, quantity: batch.quantity - remainingQty });
            remainingQty = 0;
          }
        }

        if (remainingQty > 0) {
          alert(`出庫數量超過庫存！實際出庫 ${qtyToDispatch - remainingQty} 個。`);
        }

        return { ...item, batches: updatedBatches.filter(b => b.quantity > 0) };
      }
      return item;
    }));
    alert(`已為 ${selectedProduct.name} 出庫 ${qtyToDispatch} 個。`);
  };

  // 篩選歷史記錄
  const filteredHistory = useMemo(() => {
    if (!selectedProduct) return [];
    const now = new Date();
    let startDate = new Date();

    switch (historyFilter) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - now.getDay()); // 本週日
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'all':
      default:
        return selectedProduct.batches; // 顯示所有批次
    }

    return selectedProduct.batches.filter((batch: any) => {
      const batchDate = new Date(batch.purchaseDate);
      return batchDate >= startDate && batchDate <= now;
    });
  }, [selectedProduct, historyFilter]);

  // 計算篩選後歷史記錄的總成本
  const filteredHistoryTotalCost = useMemo(() => {
    return filteredHistory.reduce((sum: number, batch: any) => sum + (batch.quantity * batch.unitCost), 0);
  }, [filteredHistory]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">庫存管理</h1>

      {/* 總庫存金額顯示 */}
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
        <p className="font-bold">目前總庫存金額</p>
        <p className="text-3xl font-bold mt-2">NT$ {totalInventoryValue.toLocaleString()}</p>
      </div>

      {/* 低庫存警示 */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">低庫存警示！</p>
          <p>以下商品庫存量低於最低庫存設定：</p>
          <ul className="list-disc list-inside">
            {lowStockItems.map(item => (
              <li key={item.id}>{item.name} (目前庫存: {item.currentStock})</li>
            ))}
          </ul>
        </div>
      )}

      {/* 搜尋 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="搜尋商品名稱..."
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 庫存列表 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名稱</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">目前庫存</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最低庫存</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map(item => (
              <tr key={item.id} className={item.currentStock <= item.minStock ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.minStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => { setSelectedProduct(item); setIsReceiveModalOpen(true); }}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    入庫
                  </button>
                  <button 
                    onClick={() => { setSelectedProduct(item); setIsDispatchModalOpen(true); }}
                    className="text-orange-600 hover:text-orange-900 mr-4"
                  >
                    出庫
                  </button>
                  <button 
                    onClick={() => { setSelectedProduct(item); setIsHistoryModalOpen(true); setHistoryFilter('all'); }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    歷史
                  </button>
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  沒有找到符合條件的庫存商品。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 入庫模態框 */}
      {selectedProduct && (
        <InputModal
          isOpen={isReceiveModalOpen}
          onClose={() => setIsReceiveModalOpen(false)}
          title={`為 ${selectedProduct.name} 入庫`}
          onSubmit={handleReceiveSubmit}
          fields={[
            { name: 'quantity', label: '入庫數量', type: 'number', placeholder: '例如: 50' },
            { name: 'unitCost', label: '單品成本', type: 'number', placeholder: '例如: 25' },
            { name: 'totalCost', label: '總金額', type: 'number', placeholder: '例如: 1250' },
            { name: 'purchaseDate', label: '入庫日期', type: 'date', initialValue: new Date().toISOString().split('T')[0] },
          ]}
          submitText="確認入庫"
        />
      )}

      {/* 出庫模態框 */}
      {selectedProduct && (
        <InputModal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          title={`為 ${selectedProduct.name} 出庫`}
          onSubmit={handleDispatchSubmit}
          fields={[
            { name: 'quantity', label: '出庫數量', type: 'number', placeholder: '例如: 10' },
          ]}
          submitText="確認出庫"
        />
      )}

      {/* 庫存歷史模態框 */}
      {selectedProduct && (
        <Modal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          title={`${selectedProduct.name} - 庫存歷史`}
        >
          <div className="mb-4 flex justify-center space-x-2">
            <button 
              onClick={() => setHistoryFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                historyFilter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              全部
            </button>
            <button 
              onClick={() => setHistoryFilter('day')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                historyFilter === 'day' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              今天
            </button>
            <button 
              onClick={() => setHistoryFilter('week')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                historyFilter === 'week' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              本週
            </button>
            <button 
              onClick={() => setHistoryFilter('month')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                historyFilter === 'month' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              本月
            </button>
          </div>

          <div className="mb-4 text-right text-lg font-semibold text-gray-800">
            篩選後總成本: NT$ {filteredHistoryTotalCost.toLocaleString()}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">類型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">數量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">單品成本</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">總價</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((batch: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.purchaseDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">入庫</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+{batch.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">NT$ {batch.unitCost}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">NT$ {(batch.quantity * batch.unitCost).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">沒有找到符合篩選條件的歷史記錄。</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 銷售金額與利潤 (未來整合訂單數據後顯示) */}
          <div className="mt-6 p-4 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">銷售與利潤概覽 (未來功能)</h4>
            <p className="text-gray-600">此處將顯示篩選時間範圍內的銷售金額和毛利。</p>
            <p className="text-gray-600">需要整合訂單管理功能後才能提供。</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
