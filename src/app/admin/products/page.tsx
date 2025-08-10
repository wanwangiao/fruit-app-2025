"use client";

import React, { useState, useMemo } from 'react';
import Modal from '@/components/Modal';
import ProductForm from '@/components/ProductForm';
import { getProducts, addProduct, updateProduct, deleteProduct, getCategories } from '@/data/mockDatabase';

export default function ProductsPage() {
  const [products, setProducts] = useState(getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('所有分類');
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模態框顯示
  const [editingProduct, setEditingProduct] = useState(null); // 儲存正在編輯的商品資料

  // 從 mockDatabase 獲取分類資料
  const categories = ['所有分類', ...getCategories().map(cat => cat.name)];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '所有分類' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleDeleteProduct = (id: number, name: string) => {
    if (window.confirm(`確定要刪除商品 '${name}' 嗎？這將無法復原！`)) {
      deleteProduct(id); // 從 mockDatabase 刪除
      setProducts(getProducts()); // 從 mockDatabase 重新獲取最新列表
      alert(`商品 '${name}' 已刪除！`);
    }
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      // 編輯現有商品
      updateProduct(productData); // 更新到 mockDatabase
      alert('商品更新成功！');
    } else {
      // 新增商品
      addProduct(productData); // 新增到 mockDatabase
      alert('商品新增成功！');
    }
    setProducts(getProducts()); // 從 mockDatabase 重新獲取最新列表
    setIsModalOpen(false); // 關閉模態框
    setEditingProduct(null); // 清除編輯狀態
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">商品管理</h1>
        <button 
          onClick={() => { setIsModalOpen(true); setEditingProduct(null); }} // 打開模態框，清除編輯狀態
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          + 新增商品
        </button>
      </div>

      {/* 篩選與搜尋 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="搜尋商品名稱..."
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 商品列表 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">圖片</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名稱</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分類</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">價格</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">庫存</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-full object-cover" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NT$ {product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    編輯
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="text-red-600 hover:text-red-900"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  沒有找到符合條件的商品。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 新增/編輯商品的模態框 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? '編輯商品' : '新增商品'}
      >
        <ProductForm 
          initialData={editingProduct} 
          onSave={handleSaveProduct} 
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
