"use client";

import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory, updateCategoryOrder } from '@/data/mockDatabase';

// 定義分類的類型
interface Category {
  id: number;
  name: string;
  sortOrder: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    // 初始化時載入分類
    const loadedCategories = getCategories();
    // 根據 sortOrder 排序
    loadedCategories.sort((a, b) => a.sortOrder - b.sortOrder);
    setCategories(loadedCategories);
  }, []);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    addCategory(newCategoryName.trim());
    const loadedCategories = getCategories();
    loadedCategories.sort((a, b) => a.sortOrder - b.sortOrder);
    setCategories(loadedCategories);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: number) => {
    deleteCategory(id);
    const loadedCategories = getCategories();
    loadedCategories.sort((a, b) => a.sortOrder - b.sortOrder);
    setCategories(loadedCategories);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">分類管理</h1>

      {/* 新增分類 */}
      <div className="mb-4 flex">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="輸入新分類名稱"
          className="border p-2 rounded-l-md flex-grow"
        />
        <button onClick={handleAddCategory} className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">
          新增
        </button>
      </div>

      {/* 分類列表 */}
      <div className="bg-white shadow-md rounded-lg">
        <ul>
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
              <span className="text-gray-800">{category.name}</span>
              <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-700">
                刪除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
