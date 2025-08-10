
"use client";

import React, { useState, useEffect } from 'react';
import { getCategories } from '@/data/mockDatabase'; // 從 mockDatabase 獲取分類

interface ProductFormProps {
  initialData?: any; // 用於編輯模式，可選
  onSave: (productData: any) => void;
  onCancel: () => void;
}

export default function ProductForm({ initialData, onSave, onCancel }: ProductFormProps) {
  const [product, setProduct] = useState(initialData || {
    name: '',
    category: '',
    price: '',
    isPriceByWeight: false, // 是否為時價/秤重商品
    imageUrl: '',
    description: '',
    stock: '',
    options: [] // 商品選項結構: [{ groupName: '甜度', type: 'single' | 'multiple', required: true, values: ['微糖', '半糖'] }]
  });

  const categories = getCategories(); // 從 mockDatabase 獲取最新分類

  // 初始化時，如果 initialData 有 options，則使用它
  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setProduct(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- 選項管理邏輯 --- //
  const handleAddOptionGroup = () => {
    setProduct(prev => ({
      ...prev,
      options: [...prev.options, { groupName: '', type: 'single', required: true, values: [] }] // 預設為單選必填
    }));
  };

  const handleOptionGroupNameChange = (index: number, newName: string) => {
    const newOptions = [...product.options];
    newOptions[index].groupName = newName;
    setProduct(prev => ({ ...prev, options: newOptions }));
  };

  const handleOptionGroupTypeChange = (index: number, newType: 'single' | 'multiple') => {
    const newOptions = [...product.options];
    newOptions[index].type = newType;
    setProduct(prev => ({ ...prev, options: newOptions }));
  };

  const handleOptionGroupRequiredChange = (index: number, isRequired: boolean) => {
    const newOptions = [...product.options];
    newOptions[index].required = isRequired;
    setProduct(prev => ({ ...prev, options: newOptions }));
  };

  const handleRemoveOptionGroup = (index: number) => {
    const newOptions = product.options.filter((_, i) => i !== index);
    setProduct(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddOptionValue = (groupIndex: number) => {
    const newOptions = [...product.options];
    newOptions[groupIndex].values.push(''); // 新增一個空的選項值
    setProduct(prev => ({ ...prev, options: newOptions }));
  };

  const handleOptionValueChange = (groupIndex: number, valueIndex: number, newValue: string) => {
    const newOptions = [...product.options];
    newOptions[groupIndex].values[valueIndex] = newValue;
    setProduct(prev => ({ ...prev, options: newOptions }));
  };

  const handleRemoveOptionValue = (groupIndex: number, valueIndex: number) => {
    const newOptions = [...product.options];
    newOptions[groupIndex].values = newOptions[groupIndex].values.filter((_, i) => i !== valueIndex);
    setProduct(prev => ({ ...prev, options: newOptions }));
  };
  // --- 選項管理邏輯結束 --- //

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">商品名稱</label>
        <input
          type="text"
          name="name"
          id="name"
          value={product.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">所屬分類</label>
        <select
          name="category"
          id="category"
          value={product.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
          required
        >
          <option value="">請選擇分類</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">價格</label>
        <input
          type="number"
          name="price"
          id="price"
          value={product.isPriceByWeight ? '' : product.price} // 修正：時價時顯示空白
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
          disabled={product.isPriceByWeight} // 如果是時價，則禁用價格輸入
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isPriceByWeight"
          id="isPriceByWeight"
          checked={product.isPriceByWeight}
          onChange={handleChange}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="isPriceByWeight" className="ml-2 block text-sm text-gray-900">此商品為時價/秤重商品 (價格將於訂單更新)</label>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">商品圖片 URL</label>
        <input
          type="text"
          name="imageUrl"
          id="imageUrl"
          value={product.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">商品描述</label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={product.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
        ></textarea>
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">庫存數量</label>
        <input
          type="number"
          name="stock"
          id="stock"
          value={product.stock}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
        />
      </div>

      {/* 商品選項管理區塊 */}
      <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">商品選項</h3>
        {product.options.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4 p-3 border border-gray-300 rounded-lg bg-white">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                placeholder="選項組名稱 (例如: 甜度)"
                value={group.groupName}
                onChange={(e) => handleOptionGroupNameChange(groupIndex, e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded-md text-gray-900"
              />
              <button
                type="button"
                onClick={() => handleRemoveOptionGroup(groupIndex)}
                className="ml-2 text-red-500 hover:text-red-700 text-sm"
              >
                刪除此組
              </button>
            </div>
            
            {/* 新增：選項組類型 (單選/複選) */}
            <div className="flex items-center space-x-4 mb-2">
              <label className="text-sm font-medium text-gray-700">選擇類型:</label>
              <select
                value={group.type}
                onChange={(e) => handleOptionGroupTypeChange(groupIndex, e.target.value as 'single' | 'multiple')}
                className="border border-gray-300 p-1 rounded-md text-gray-900 text-sm"
              >
                <option value="single">單選 (只能選一個)</option>
                <option value="multiple">複選 (可選多個)</option>
              </select>
              <input
                type="checkbox"
                checked={group.required}
                onChange={(e) => handleOptionGroupRequiredChange(groupIndex, e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-900">是否必選</label>
            </div>

            <div className="space-y-2">
              {group.values.map((value, valueIndex) => (
                <div key={valueIndex} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="選項值 (例如: 微糖)"
                    value={value}
                    onChange={(e) => handleOptionValueChange(groupIndex, valueIndex, e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-md text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOptionValue(groupIndex, valueIndex)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    刪除
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddOptionValue(groupIndex)}
              className="mt-3 w-full bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600 text-sm"
            >
              + 新增選項值
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOptionGroup}
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors mt-4"
        >
          + 新增選項組
        </button>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          儲存商品
        </button>
      </div>
    </form>
  );
}
