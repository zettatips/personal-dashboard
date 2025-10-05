import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_STATE, STORAGE_KEY } from './utils/constants';
import { getTodayKey, getDefaultDailyData } from './utils/dataHelpers';
import FitnessModule from './components/FitnessModule';
import FinanceModule from './components/FinanceModule';
import ReligiousModule from './components/ReligiousModule';
import MortgageTracker from './components/MortgageTracker';
import FamilyModule from './components/FamilyModule';
import HirePurchaseTracker from './components/HirePurchaseTracker';
import { calculateVibeScore } from './utils/dataHelpers';

function App() {
  const [appState, setAppState] = useLocalStorage(STORAGE_KEY, INITIAL_STATE);
  const [selectedDate, setSelectedDate] = useState(getTodayKey());

  const vibeScore = appState.dailyData[selectedDate]
    ? calculateVibeScore(appState.dailyData[selectedDate])
    : 0;

  const getVibeScoreColor = (score) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    if (score >= 40) return 'bg-orange-600';
    return 'bg-red-600';
  };

  if (!appState.dailyData[selectedDate]) {
    setAppState(prev => ({
      ...prev,
      dailyData: {
        ...prev.dailyData,
        [selectedDate]: getDefaultDailyData()
      }
    }));
  }

  const updateState = (updater) => {
    setAppState(prev => {
      const newState = typeof updater === 'function' ? updater(prev) : updater;
      console.log('State updated:', newState);
      return newState;
    });
  };

  const updateDailyData = (date, updates) => {
    updateState(prev => ({
      ...prev,
      dailyData: {
        ...prev.dailyData,
        [date]: {
          ...prev.dailyData[date],
          ...updates
        }
      }
    }));
  };

  const updateAccounts = (newAccounts) => {
    console.log('Updating accounts:', newAccounts);
    updateState(prev => ({
      ...prev,
      accounts: newAccounts
    }));
  };

  const addTransaction = (transaction) => {
    console.log('Adding transaction:', transaction);
    updateState(prev => ({
      ...prev,
      transactions: [...prev.transactions, {
        ...transaction,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      }]
    }));
  };

  const updateMortgage = (mortgageData) => {
    updateState(prev => ({
      ...prev,
      mortgage: mortgageData
    }));
  };

  const updateHirePurchase = (hpData) => {
    updateState(prev => ({
      ...prev,
      hirePurchase: hpData
    }));
  };

  const updateFamilySettings = (newSettings) => {
    updateState(prev => ({
      ...prev,
      family: newSettings
    }));
  };

  const updateSettings = (newSettings) => {
    updateState(prev => ({
      ...prev,
      settings: newSettings
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `za-dashboard-backup-${getTodayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Data exported successfully!');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        if (!imported.settings || !imported.accounts || !imported.dailyData) {
          alert('Invalid backup file structure');
          return;
        }

        if (confirm('This will replace all current data. Continue?')) {
          setAppState(imported);
          alert('Data imported successfully!');
        }
      } catch (error) {
        alert('Error reading file: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    if (date <= new Date()) {
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">ZA's Life Dashboard</h1>
            <div className={`${getVibeScoreColor(vibeScore)} px-4 py-2 rounded-lg`}>
              <div className="text-xs text-white opacity-80">Vibe Score</div>
              <div className="text-2xl font-bold text-white">{vibeScore}/100</div>
            </div>
          </div>

          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={goToPreviousDay}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              >
                ← Prev
              </button>
              <span className="px-3 py-1 bg-gray-700 rounded">{selectedDate}</span>
              <button
                onClick={goToNextDay}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                disabled={selectedDate === getTodayKey()}
              >
                Next →
              </button>
            </div>

            <button onClick={exportData} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">
              📥 Export
            </button>
            <label className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 cursor-pointer">
              📤 Import
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Column 1: Fitness & Family */}
          <div className="space-y-4">
            <FitnessModule
              date={selectedDate}
              data={appState.dailyData[selectedDate]}
              settings={appState.settings}
              onUpdate={updateDailyData}
              onUpdateSettings={updateSettings}
            />

            <FamilyModule
              date={selectedDate}
              data={appState.dailyData[selectedDate]}
              familySettings={appState.family}
              onUpdate={updateDailyData}
              onUpdateSettings={updateFamilySettings}
            />
          </div>

          {/* Column 2: Religious & Finance */}
          <div className="space-y-4">
            <ReligiousModule
              date={selectedDate}
              data={appState.dailyData[selectedDate]}
              settings={appState.settings}
              onUpdate={updateDailyData}
            />

            <FinanceModule
              accounts={appState.accounts}
              transactions={appState.transactions}
              dailyBudget={appState.settings.dailyBudget}
              selectedDate={selectedDate}
              onUpdateAccounts={updateAccounts}
              onAddTransaction={addTransaction}
            />
          </div>

          {/* Column 3: Mortgage & Hire Purchase */}
          <div className="space-y-4">
            <MortgageTracker
              mortgage={appState.mortgage}
              onUpdate={updateMortgage}
            />

            <HirePurchaseTracker
              hirePurchase={appState.hirePurchase}
              onUpdate={updateHirePurchase}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
