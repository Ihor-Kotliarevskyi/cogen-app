import React, { useState } from 'react';
import Header from './components/Header.jsx';
import TabBar from './components/TabBar.jsx';
import ParamsScreen from './components/ParamsScreen.jsx';
import DashboardScreen from './components/DashboardScreen.jsx';
import BalanceScreen from './components/BalanceScreen.jsx';
import CashflowScreen from './components/CashflowScreen.jsx';
import ScenariosScreen from './components/ScenariosScreen.jsx';

const TABS = [
  { key: 'params', label: 'Параметри' },
  { key: 'dash', label: 'Результат' },
  { key: 'balance', label: 'Баланси' },
  { key: 'cf', label: 'CF / Графік' },
  { key: 'sc', label: 'Сценарії' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('params');

  return (
    <div className="app">
      <Header />
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <div className="content">
        {activeTab === 'params' && <ParamsScreen />}
        {activeTab === 'dash' && <DashboardScreen />}
        {activeTab === 'balance' && <BalanceScreen />}
        {activeTab === 'cf' && <CashflowScreen />}
        {activeTab === 'sc' && <ScenariosScreen />}
      </div>
    </div>
  );
}
