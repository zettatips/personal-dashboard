import { useState } from 'react';

function MortgageTracker({ mortgage, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(mortgage || {
    principal: 0,
    monthlyPayment: 0,
    remainingYears: 0,
    nextPaymentDate: ''
  });

  const handleSave = () => {
    onUpdate(editData);
    setShowEdit(false);
  };

  if (!mortgage) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🏠 Mortgage Tracker</h2>
        <p className="text-gray-400 text-sm mb-4">Track your apartment mortgage payments</p>
        <button
          onClick={() => setShowEdit(true)}
          className="w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          + Add Mortgage Details
        </button>

        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">Mortgage Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Total Principal (RM)</label>
                  <input
                    type="number"
                    value={editData.principal}
                    onChange={(e) => setEditData({...editData, principal: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="350000"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Monthly Payment (RM)</label>
                  <input
                    type="number"
                    value={editData.monthlyPayment}
                    onChange={(e) => setEditData({...editData, monthlyPayment: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="1850"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Remaining Years</label>
                  <input
                    type="number"
                    value={editData.remainingYears}
                    onChange={(e) => setEditData({...editData, remainingYears: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="28"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Next Payment Date</label>
                  <input
                    type="date"
                    value={editData.nextPaymentDate}
                    onChange={(e) => setEditData({...editData, nextPaymentDate: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEdit(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const totalPayable = mortgage.monthlyPayment * mortgage.remainingYears * 12;
  const totalPaid = mortgage.principal - (totalPayable - (mortgage.monthlyPayment * mortgage.remainingYears * 12));
  const percentagePaid = ((totalPaid / mortgage.principal) * 100) || 0;

  const nextPayment = mortgage.nextPaymentDate ? new Date(mortgage.nextPaymentDate) : null;
  const today = new Date();
  const daysUntilPayment = nextPayment ? Math.ceil((nextPayment - today) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🏠 Mortgage</h2>
        <button
          onClick={() => {
            setEditData(mortgage);
            setShowEdit(true);
          }}
          className="text-sm px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          Edit
        </button>
      </div>

      <div className="bg-gray-700 p-4 rounded space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Principal</span>
          <span className="font-semibold">RM {mortgage.principal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Monthly Payment</span>
          <span className="font-semibold">RM {mortgage.monthlyPayment.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Remaining Years</span>
          <span className="font-semibold">{mortgage.remainingYears} years</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="font-semibold">{percentagePaid.toFixed(1)}%</span>
        </div>
        <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-green-500 transition-all"
            style={{ width: `${percentagePaid}%` }}
          />
        </div>
      </div>

      {nextPayment && (
        <div className="bg-blue-900 p-3 rounded">
          <div className="text-sm text-blue-200">Next Payment</div>
          <div className="font-bold text-lg">{nextPayment.toLocaleDateString()}</div>
          <div className="text-sm text-blue-300">
            {daysUntilPayment > 0 ? `${daysUntilPayment} days away` : 'Due today!'}
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Mortgage</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Total Principal (RM)</label>
                <input
                  type="number"
                  value={editData.principal}
                  onChange={(e) => setEditData({...editData, principal: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Monthly Payment (RM)</label>
                <input
                  type="number"
                  value={editData.monthlyPayment}
                  onChange={(e) => setEditData({...editData, monthlyPayment: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Remaining Years</label>
                <input
                  type="number"
                  value={editData.remainingYears}
                  onChange={(e) => setEditData({...editData, remainingYears: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Next Payment Date</label>
                <input
                  type="date"
                  value={editData.nextPaymentDate}
                  onChange={(e) => setEditData({...editData, nextPaymentDate: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MortgageTracker;
