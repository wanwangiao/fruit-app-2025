"use client";

import React from 'react';
import { getFrontendProducts } from '@/data/mockDatabase';

export default function Home() {
  const categoriesWithProducts = getFrontendProducts();

  // 根據 sortOrder 排序分類
  const sortedCategories = [...categoriesWithProducts].sort((a, b) => a.sortOrder - b.sortOrder);

  // 診斷用：印出高麗菜的 isPriceByWeight 屬性
  const cabbageCategory = sortedCategories.find(cat => cat.categoryName === '蔬菜類');
  const cabbageProduct = cabbageCategory?.products.find(p => p.name === '高麗菜');
  if (cabbageProduct) {
    console.log('高麗菜 isPriceByWeight:', cabbageProduct.isPriceByWeight);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">鮮到家</h1>
        </div>
      </header>

      {/* 分類快速導覽 - 也作為一個 sticky header */}
      <nav className="bg-white border-b border-gray-200 sticky top-[72px] z-10"> {/* 72px 是大約的 header 高度 */}
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto space-x-4 py-2">
            {sortedCategories.map(categoryGroup => (
              <a 
                key={categoryGroup.categoryName} 
                href={`#${categoryGroup.categoryName}`}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white"
              >
                {categoryGroup.categoryName}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {
          sortedCategories.map(categoryGroup => (
            // 為 section 加上 id，讓錨點連結可以跳轉到這裡
            <section key={categoryGroup.categoryName} id={categoryGroup.categoryName} className="mb-8 scroll-mt-24"> {/* scroll-mt-24 是為了避免被 sticky header 擋住 */}
              <h2 className="text-2xl font-bold text-center text-gray-800 py-4 mb-4 border-b-2 border-green-500">
                {categoryGroup.categoryName}
              </h2>
              {/* 商品網格 */}
              <div className="grid grid-cols-2 gap-4">
                {categoryGroup.products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-gray-600 mt-1">
                        {product.isPriceByWeight ? '時價' : `NT$ ${product.price}`}
                      </p>
                      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                        加入購物車
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        }
      </main>
    </div>
  );
}