import { useState } from 'react';

function FinanceModule({ accounts, transactions, dailyBudget, selectedDate, onUpdateAccounts, onAddTransaction }) {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');

  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food & Dining');
  const [expenseAccount, setExpenseAccount] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');

  const categories = [
    'Food & Dining',
    'Groceries (Tesco/Aeon)',
    'Petrol (Proton S70)',
    'Toll & Parking',
    "Son's Needs",
    'Utilities (TNB/Water)',
    'Telco (Celcom/Maxis/Digi)',
    'ASB/Tabung Haji',
    'e-Wallet Top-up (TNG/Boost)',
    'Others'
  ];

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!newAccountName || !newAccountBalance) return;

    const newAccount = {
      id: Date.now().toString(),
      name: newAccountName,
      balance: parseFloat(newAccountBalance)
    };

    console.log('Creating new account:', newAccount);
    onUpdateAccounts([...accounts, newAccount]);

    setNewAccountName('');
    setNewAccountBalance('');
    setShowAddAccount(false);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseAmount || !expenseAccount) return;

    const amount = parseFloat(expenseAmount);
    const expense = {
      date: selectedDate,
      type: 'expense',
      amount: amount,
      category: expenseCategory,
      accountId: expenseAccount,
      notes: expenseNotes
    };

    console.log('Creating expense:', expense);
    onAddTransaction(expense);

    const updatedAccounts = accounts.map(acc =>
      acc.id === expenseAccount
        ? { ...acc, balance: acc.balance - amount }
        : acc
    );

    console.log('Updating accounts after expense:', updatedAccounts);
    onUpdateAccounts(updatedAccounts);

    setExpenseAmount('');
    setExpenseNotes('');
    setShowAddExpense(false);
  };

  const todayTransactions = transactions.filter(t => t.date === selectedDate);
  const todaySpending = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetPercentage = (todaySpending / dailyBudget) * 100;
  const budgetColor = budgetPercentage > 100 ? 'red' : budgetPercentage > 80 ? 'yellow' : 'green';

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">💰 Finance</h2>
        <button
          onClick={() => setShowAddAccount(true)}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          + Add Account
        </button>
      </div>

      {/* Accounts Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Bank Accounts ({accounts.length})</h3>
        {accounts.length === 0 ? (
          <p className="text-gray-400">No accounts yet. Add your first account!</p>
        ) : (
          <div className="grid gap-3">
            {accounts.map(account => (
              <div key={account.id} className="bg-gray-700 p-4 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{account.name}</p>
                  <p className="text-2xl text-green-400">RM {account.balance.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budget Progress */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Today's Budget</h3>
          <span className="text-sm text-gray-400">RM {dailyBudget.toFixed(2)}</span>
        </div>
        <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all ${
              budgetColor === 'green' ? 'bg-green-500' :
              budgetColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>Spent: RM {todaySpending.toFixed(2)}</span>
          <span>Remaining: RM {(dailyBudget - todaySpending).toFixed(2)}</span>
        </div>
      </div>

      {/* Add Expense Button */}
      <button
        onClick={() => setShowAddExpense(true)}
        disabled={accounts.length === 0}
        className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        + Add Expense
      </button>

      {/* Today's Transactions */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Today's Transactions ({todayTransactions.length})</h3>
        {todayTransactions.length === 0 ? (
          <p className="text-gray-400 text-sm">No transactions today</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {todayTransactions.map(transaction => {
              const account = accounts.find(a => a.id === transaction.accountId);
              return (
                <div key={transaction.id} className="bg-gray-700 p-3 rounded text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">{transaction.category}</span>
                    <span className="text-red-400">-RM {transaction.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {account?.name} • {new Date(transaction.timestamp).toLocaleTimeString()}
                  </div>
                  {transaction.notes && (
                    <div className="text-gray-400 text-xs mt-1">{transaction.notes}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add New Account</h3>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Account Name</label>
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  placeholder="e.g., Maybank Savings"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Initial Balance (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newAccountBalance}
                  onChange={(e) => setNewAccountBalance(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                  Add Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Amount (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Account</label>
                <select
                  value={expenseAccount}
                  onChange={(e) => setExpenseAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Notes (optional)</label>
                <textarea
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  rows="2"
                  placeholder="Add notes..."
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-red-600 rounded hover:bg-red-700">
                  Add Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinanceModule;
