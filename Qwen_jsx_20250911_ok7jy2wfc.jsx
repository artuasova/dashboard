import React, { useState, useEffect } from "react";

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [salesData, setSalesData] = useState([]);
  const [newSale, setNewSale] = useState({
    name: "",
    article: "",
    purchasePrice: "",
    sellingPrice: "",
    commission: "",
    logistics: "",
    deliveryToMV: "",
    advertising: "",
    taxRate: "0.97",
    date: new Date().toISOString().split('T')[0],
    quantity: 1,
    marketplace: "Яндекс"
  });
  const [filters, setFilters] = useState({
    period: "all",
    marketplace: "all",
    category: "all"
  });
  const [taxSystem, setTaxSystem] = useState("1%");

  // Mock data for initial display
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "мыло DALAN Traditional Морская свежесть",
        article: "maximum11310004",
        purchasePrice: 209,
        sellingPrice: 894,
        commission: 434,
        logistics: 0,
        deliveryToMV: 0,
        advertising: 0.98,
        taxRate: 0.97,
        quantity: 1,
        date: "2025-07-29",
        marketplace: "Яндекс",
        profit: 206,
        margin: 99
      },
      {
        id: 2,
        name: "аэратор для смесителя РЫЖИЙ КОТ",
        article: "maximum12358223",
        purchasePrice: 33,
        sellingPrice: 588,
        commission: 326,
        logistics: 0,
        deliveryToMV: 0,
        advertising: 0.98,
        taxRate: 0.97,
        quantity: 1,
        date: "2025-07-29",
        marketplace: "Яндекс",
        profit: 200,
        margin: 605
      },
      {
        id: 3,
        name: "бумага шлифовальная Mirox",
        article: "maximum9366048",
        purchasePrice: 114,
        sellingPrice: 898,
        commission: 426,
        logistics: 0,
        deliveryToMV: 0,
        advertising: 0.98,
        taxRate: 0.97,
        quantity: 1,
        date: "2025-07-29",
        marketplace: "Яндекс",
        profit: 313,
        margin: 275
      }
    ];
    setSalesData(mockData);
  }, []);

  const calculateProfit = (sale) => {
    const revenue = sale.sellingPrice * sale.quantity;
    const totalCost = (sale.purchasePrice + sale.commission + sale.logistics + sale.deliveryToMV) * sale.quantity;
    const advertisingCost = sale.advertising * revenue;
    const taxCost = (1 - sale.taxRate) * revenue;
    return revenue - totalCost - advertisingCost - taxCost;
  };

  const calculateMargin = (sale) => {
    const profit = calculateProfit(sale);
    return Math.round((profit / (sale.sellingPrice * sale.quantity)) * 100);
  };

  const handleAddSale = () => {
    if (!newSale.name || !newSale.article || !newSale.purchasePrice || !newSale.sellingPrice) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    const sale = {
      id: Date.now(),
      ...newSale,
      purchasePrice: parseFloat(newSale.purchasePrice),
      sellingPrice: parseFloat(newSale.sellingPrice),
      commission: parseFloat(newSale.commission) || 0,
      logistics: parseFloat(newSale.logistics) || 0,
      deliveryToMV: parseFloat(newSale.deliveryToMV) || 0,
      advertising: parseFloat(newSale.advertising) || 0,
      quantity: parseInt(newSale.quantity) || 1,
      profit: calculateProfit(newSale),
      margin: calculateMargin(newSale)
    };

    setSalesData([sale, ...salesData]);
    setNewSale({
      name: "",
      article: "",
      purchasePrice: "",
      sellingPrice: "",
      commission: "",
      logistics: "",
      deliveryToMV: "",
      advertising: "0.98",
      taxRate: "0.97",
      date: new Date().toISOString().split('T')[0],
      quantity: 1,
      marketplace: "Яндекс"
    });
  };

  const filteredData = salesData.filter(sale => {
    if (filters.marketplace !== "all" && sale.marketplace !== filters.marketplace) return false;
    if (filters.period !== "all") {
      const saleDate = new Date(sale.date);
      const now = new Date();
      let startDate;
      
      if (filters.period === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (filters.period === "quarter") {
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
      }
      
      if (startDate && saleDate < startDate) return false;
    }
    return true;
  });

  const totalRevenue = filteredData.reduce((sum, sale) => sum + (sale.sellingPrice * sale.quantity), 0);
  const totalCost = filteredData.reduce((sum, sale) => sum + ((sale.purchasePrice + sale.commission + sale.logistics + sale.deliveryToMV) * sale.quantity), 0);
  const totalAdvertising = filteredData.reduce((sum, sale) => sum + (sale.advertising * sale.sellingPrice * sale.quantity), 0);
  const totalTax = filteredData.reduce((sum, sale) => sum + ((1 - sale.taxRate) * sale.sellingPrice * sale.quantity), 0);
  const totalProfit = filteredData.reduce((sum, sale) => sum + sale.profit, 0);
  const averageMargin = filteredData.length > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Система учета продаж и прибыли
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Управляйте своими продажами, отслеживайте прибыль и анализируйте эффективность
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Дашборд" },
              { id: "sales", label: "Добавить продажу" },
              { id: "analytics", label: "Аналитика" },
              { id: "reports", label: "Отчеты" },
              { id: "settings", label: "Настройки" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Общая выручка</h3>
                <p className="text-3xl font-bold">{totalRevenue.toLocaleString()} ₽</p>
                <p className="text-green-100 mt-1">за выбранный период</p>
              </div>
              <div className="bg-gradient-to-r from-red-400 to-red-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Общие расходы</h3>
                <p className="text-3xl font-bold">{(totalCost + totalAdvertising + totalTax).toLocaleString()} ₽</p>
                <p className="text-red-100 mt-1">включая налоги</p>
              </div>
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Чистая прибыль</h3>
                <p className="text-3xl font-bold">{totalProfit.toLocaleString()} ₽</p>
                <p className="text-blue-100 mt-1">за выбранный период</p>
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Рентабельность</h3>
                <p className="text-3xl font-bold">{averageMargin}%</p>
                <p className="text-purple-100 mt-1">средняя за период</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Фильтры</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Период</label>
                  <select 
                    value={filters.period} 
                    onChange={(e) => setFilters({...filters, period: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Все время</option>
                    <option value="month">Текущий месяц</option>
                    <option value="quarter">Текущий квартал</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Маркетплейс</label>
                  <select 
                    value={filters.marketplace} 
                    onChange={(e) => setFilters({...filters, marketplace: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Все маркетплейсы</option>
                    <option value="Яндекс">Яндекс Маркет</option>
                    <option value="Озон">Озон</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                  <select 
                    value={filters.category} 
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Все категории</option>
                    <option value="garden">Садовые товары</option>
                    <option value="building">Строительные товары</option>
                    <option value="household">Бытовые товары</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Последние продажи</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Маркетплейс</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Выручка</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Прибыль</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Маржа</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.slice(0, 10).map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.marketplace}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(sale.sellingPrice * sale.quantity).toLocaleString()} ₽
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.profit.toLocaleString()} ₽
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={sale.margin > 50 ? "text-green-600 font-medium" : sale.margin > 20 ? "text-yellow-600 font-medium" : "text-red-600 font-medium"}>
                            {sale.margin}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Добавить новую продажу</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Название товара *</label>
                  <input
                    type="text"
                    value={newSale.name}
                    onChange={(e) => setNewSale({...newSale, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите название товара"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Артикул *</label>
                  <input
                    type="text"
                    value={newSale.article}
                    onChange={(e) => setNewSale({...newSale, article: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите артикул"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Маркетплейс</label>
                  <select
                    value={newSale.marketplace}
                    onChange={(e) => setNewSale({...newSale, marketplace: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Яндекс">Яндекс Маркет</option>
                    <option value="Озон">Озон</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Цена закупки (₽) *</label>
                  <input
                    type="number"
                    value={newSale.purchasePrice}
                    onChange={(e) => setNewSale({...newSale, purchasePrice: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Цена продажи (₽) *</label>
                  <input
                    type="number"
                    value={newSale.sellingPrice}
                    onChange={(e) => setNewSale({...newSale, sellingPrice: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Комиссия маркетплейса (₽)</label>
                  <input
                    type="number"
                    value={newSale.commission}
                    onChange={(e) => setNewSale({...newSale, commission: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Логистика (₽)</label>
                  <input
                    type="number"
                    value={newSale.logistics}
                    onChange={(e) => setNewSale({...newSale, logistics: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Доставка до МВ (₽)</label>
                  <input
                    type="number"
                    value={newSale.deliveryToMV}
                    onChange={(e) => setNewSale({...newSale, deliveryToMV: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">РК + Эквайринг (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSale.advertising}
                    onChange={(e) => setNewSale({...newSale, advertising: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.98"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Налог (%)</label>
                  <select
                    value={newSale.taxRate}
                    onChange={(e) => setNewSale({...newSale, taxRate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="0.99">1% (УСН Доходы)</option>
                    <option value="0.93">7% (УСН Доходы)</option>
                    <option value="0.85">15% (УСН Доходы-Расходы)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Количество</label>
                  <input
                    type="number"
                    value={newSale.quantity}
                    onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дата продажи</label>
                  <input
                    type="date"
                    value={newSale.date}
                    onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handleAddSale}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Добавить продажу
                </button>
              </div>
            </div>
            
            {/* Profit Calculator */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Калькулятор прибыли</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800">Выручка</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {((parseFloat(newSale.sellingPrice) || 0) * (parseInt(newSale.quantity) || 1)).toLocaleString()} ₽
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800">Расходы</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {(
                      ((parseFloat(newSale.purchasePrice) || 0) + (parseFloat(newSale.commission) || 0) + (parseFloat(newSale.logistics) || 0) + (parseFloat(newSale.deliveryToMV) || 0)) * (parseInt(newSale.quantity) || 1) +
                      (parseFloat(newSale.advertising) || 0) * (parseFloat(newSale.sellingPrice) || 0) * (parseInt(newSale.quantity) || 1) +
                      (1 - (parseFloat(newSale.taxRate) || 0.97)) * (parseFloat(newSale.sellingPrice) || 0) * (parseInt(newSale.quantity) || 1)
                    ).toLocaleString()} ₽
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800">Прибыль</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {calculateProfit(newSale).toLocaleString()} ₽
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-800">Маржа</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {calculateMargin(newSale)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Аналитика продаж</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Продажи по маркетплейсам</h3>
                  <div className="space-y-4">
                    {["Яндекс", "Озон"].map((marketplace) => {
                      const marketplaceData = salesData.filter(sale => sale.marketplace === marketplace);
                      const marketplaceRevenue = marketplaceData.reduce((sum, sale) => sum + (sale.sellingPrice * sale.quantity), 0);
                      const marketplaceProfit = marketplaceData.reduce((sum, sale) => sum + sale.profit, 0);
                      const percentage = totalRevenue > 0 ? Math.round((marketplaceRevenue / totalRevenue) * 100) : 0;
                      
                      return (
                        <div key={marketplace} className="bg-white p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-900">{marketplace}</h4>
                            <span className="text-sm text-gray-500">{percentage}% от общей выручки</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Выручка:</span>
                              <span className="font-medium text-gray-900">{marketplaceRevenue.toLocaleString()} ₽</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Прибыль:</span>
                              <span className="font-medium text-green-600">{marketplaceProfit.toLocaleString()} ₽</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{width: `${percentage}%`}}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Топ-5 самых прибыльных товаров</h3>
                  <div className="space-y-3">
                    {salesData
                      .sort((a, b) => b.profit - a.profit)
                      .slice(0, 5)
                      .map((sale, index) => (
                        <div key={sale.id} className="bg-white p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900 truncate" title={sale.name}>
                                {index + 1}. {sale.name}
                              </h4>
                              <p className="text-sm text-gray-500">{sale.article}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{sale.profit.toLocaleString()} ₽</p>
                              <p className="text-sm text-gray-500">{sale.margin}% маржа</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Динамика продаж по месяцам</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Месяц</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Выручка</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Расходы</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Прибыль</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Рентабельность</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество продаж</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {["Апрель 2025", "Май 2025", "Июнь 2025", "Июль 2025"].map((month, index) => {
                        const monthData = salesData.filter(sale => {
                          const saleMonth = new Date(sale.date).getMonth();
                          return saleMonth === index + 3; // April is month 3 (0-indexed)
                        });
                        
                        const monthRevenue = monthData.reduce((sum, sale) => sum + (sale.sellingPrice * sale.quantity), 0);
                        const monthCost = monthData.reduce((sum, sale) => sum + ((sale.purchasePrice + sale.commission + sale.logistics + sale.deliveryToMV) * sale.quantity), 0);
                        const monthAdvertising = monthData.reduce((sum, sale) => sum + (sale.advertising * sale.sellingPrice * sale.quantity), 0);
                        const monthTax = monthData.reduce((sum, sale) => sum + ((1 - sale.taxRate) * sale.sellingPrice * sale.quantity), 0);
                        const monthProfit = monthData.reduce((sum, sale) => sum + sale.profit, 0);
                        const monthMargin = monthRevenue > 0 ? Math.round((monthProfit / monthRevenue) * 100) : 0;
                        
                        return (
                          <tr key={month}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{monthRevenue.toLocaleString()} ₽</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(monthCost + monthAdvertising + monthTax).toLocaleString()} ₽</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{monthProfit.toLocaleString()} ₽</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{monthMargin}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{monthData.length}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Финансовые отчеты</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Период отчета</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option>1 квартал 2025</option>
                    <option>2 квартал 2025</option>
                    <option>3 квартал 2025</option>
                    <option>4 квартал 2025</option>
                    <option>Январь 2025</option>
                    <option>Февраль 2025</option>
                    <option>Март 2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Формат экспорта</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Отчет о прибылях и убытках</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статья</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма (₽)</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Выручка</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">{totalRevenue.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">100%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-8">Садовые товары</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{totalRevenue.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">100%</td>
                      </tr>
                      <tr className="bg-red-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Прямые расходы</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">{(totalCost + totalAdvertising + totalTax).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{Math.round(((totalCost + totalAdvertising + totalTax) / totalRevenue) * 100)}%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-8">Закупка товаров</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{totalCost.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{Math.round((totalCost / totalRevenue) * 100)}%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-8">Комиссия платформ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{totalAdvertising.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{Math.round((totalAdvertising / totalRevenue) * 100)}%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-8">Налоги</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{totalTax.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{Math.round((totalTax / totalRevenue) * 100)}%</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Чистая прибыль</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">{totalProfit.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">{averageMargin}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Скачать отчет (PDF)
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Экспорт в Excel
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Печать
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Настройки системы</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Система налогообложения</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="taxSystem"
                          value="1%"
                          checked={taxSystem === "1%"}
                          onChange={(e) => setTaxSystem(e.target.value)}
                          className="mr-2"
                        />
                        <span>УСН Доходы (1%)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="taxSystem"
                          value="7%"
                          checked={taxSystem === "7%"}
                          onChange={(e) => setTaxSystem(e.target.value)}
                          className="mr-2"
                        />
                        <span>УСН Доходы (7%)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="taxSystem"
                          value="15%"
                          checked={taxSystem === "15%"}
                          onChange={(e) => setTaxSystem(e.target.value)}
                          className="mr-2"
                        />
                        <span>УСН Доходы-Расходы (15%)</span>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Выберите систему налогообложения для автоматического расчета налогов
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Настройки комиссий</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Яндекс Маркет</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Стандартная комиссия (%)</label>
                          <input type="number" step="0.01" defaultValue="0.15" className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Эквайринг (%)</label>
                          <input type="number" step="0.01" defaultValue="0.02" className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Озон</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Стандартная комиссия (%)</label>
                          <input type="number" step="0.01" defaultValue="0.10" className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Эквайринг (%)</label>
                          <input type="number" step="0.01" defaultValue="0.02" className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Категории товаров</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input type="text" placeholder="Название категории" className="flex-1 p-2 border border-gray-300 rounded-md" />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                          Добавить
                        </button>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded">
                          <span>Садовые товары</span>
                          <button className="text-red-600 hover:text-red-800 text-sm">Удалить</button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded">
                          <span>Строительные товары</span>
                          <button className="text-red-600 hover:text-red-800 text-sm">Удалить</button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded">
                          <span>Бытовые товары</span>
                          <button className="text-red-600 hover:text-red-800 text-sm">Удалить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                    Сохранить настройки
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;