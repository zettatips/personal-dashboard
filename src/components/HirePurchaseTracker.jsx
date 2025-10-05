import { useState } from 'react';

function HirePurchaseTracker({ hirePurchase, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(hirePurchase || {
    vehicleName: '',
    principal: 0,
    monthlyInstallment: 0,
    remainingMonths: 0,
    interestRate: 0,
    nextPaymentDate: '',
    startDate: ''
  });

  const handleSave = () => {
    onUpdate(editData);
    setShowEdit(false);
  };

  if (!hirePurchase) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🚗 Hire Purchase</h2>
        <p className="text-gray-400 text-sm mb-4">Track your vehicle loan (Proton S70)</p>
        <button
          onClick={() => setShowEdit(true)}
          className="w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          + Add HP Details
        </button>

        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Hire Purchase Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    value={editData.vehicleName}
                    onChange={(e) => setEditData({...editData, vehicleName: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="Proton S70 Flagship X"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Loan Amount / Principal (RM)</label>
                  <input
                    type="number"
                    value={editData.principal}
                    onChange={(e) => setEditData({...editData, principal: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="80000"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Monthly Installment (RM)</label>
                  <input
                    type="number"
                    value={editData.monthlyInstallment}
                    onChange={(e) => setEditData({...editData, monthlyInstallment: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="1200"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Remaining Months</label>
                  <input
                    type="number"
                    value={editData.remainingMonths}
                    onChange={(e) => setEditData({...editData, remainingMonths: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="84"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Interest Rate (% per annum)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editData.interestRate}
                    onChange={(e) => setEditData({...editData, interestRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="3.5"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Loan Start Date</label>
                  <input
                    type="date"
                    value={editData.startDate}
                    onChange={(e) => setEditData({...editData, startDate: e.target.value})}
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

  // Calculations
  const totalPayable = hirePurchase.monthlyInstallment * hirePurchase.remainingMonths;
  const totalLoanTenure = Math.round((hirePurchase.principal / hirePurchase.monthlyInstallment) *
                          (1 + (hirePurchase.interestRate / 100)));
  const monthsPaid = totalLoanTenure - hirePurchase.remainingMonths;
  const percentagePaid = ((monthsPaid / totalLoanTenure) * 100) || 0;
  const totalInterest = (hirePurchase.monthlyInstallment * totalLoanTenure) - hirePurchase.principal;

  const nextPayment = hirePurchase.nextPaymentDate ? new Date(hirePurchase.nextPaymentDate) : null;
  const today = new Date();
  const daysUntilPayment = nextPayment ? Math.ceil((nextPayment - today) / (1000 * 60 * 60 * 24)) : 0;

  const startDate = hirePurchase.startDate ? new Date(hirePurchase.startDate) : null;
  const endDate = startDate ? new Date(startDate.setMonth(startDate.getMonth() + totalLoanTenure)) : null;

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🚗 Hire Purchase</h2>
          <p className="text-sm text-gray-400">{hirePurchase.vehicleName}</p>
        </div>
        <button
          onClick={() => {
            setEditData(hirePurchase);
            setShowEdit(true);
          }}
          className="text-sm px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          Edit
        </button>
      </div>

      {/* Key Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-700 p-3 rounded">
          <div className="text-xs text-gray-400">Monthly Installment</div>
          <div className="text-xl font-bold text-green-400">RM {hirePurchase.monthlyInstallment.toLocaleString()}</div>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <div className="text-xs text-gray-400">Remaining Months</div>
          <div className="text-xl font-bold text-yellow-400">{hirePurchase.remainingMonths}</div>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <div className="text-xs text-gray-400">Interest Rate</div>
          <div className="text-xl font-bold text-blue-400">{hirePurchase.interestRate}% p.a.</div>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <div className="text-xs text-gray-400">Total Remaining</div>
          <div className="text-xl font-bold text-red-400">RM {totalPayable.toLocaleString()}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Loan Progress</span>
          <span className="font-semibold">{percentagePaid.toFixed(1)}%</span>
        </div>
        <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-600 to-green-500 transition-all"
            style={{ width: `${percentagePaid}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{monthsPaid} months paid</span>
          <span>{hirePurchase.remainingMonths} months left</span>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-gray-700 p-4 rounded space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Original Loan</span>
          <span className="font-semibold">RM {hirePurchase.principal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Interest</span>
          <span className="font-semibold text-orange-400">RM {totalInterest.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-600 pt-2">
          <span className="text-gray-400">Total Payable</span>
          <span className="font-bold text-lg">RM {(hirePurchase.principal + totalInterest).toLocaleString()}</span>
        </div>
      </div>

      {/* Next Payment Alert */}
      {nextPayment && (
        <div className={`p-3 rounded ${daysUntilPayment <= 7 ? 'bg-red-900' : 'bg-blue-900'}`}>
          <div className="text-sm text-gray-200">Next Payment Due</div>
          <div className="font-bold text-lg">{nextPayment.toLocaleDateString('en-MY')}</div>
          <div className={`text-sm ${daysUntilPayment <= 7 ? 'text-red-300' : 'text-blue-300'}`}>
            {daysUntilPayment > 0
              ? `${daysUntilPayment} day${daysUntilPayment > 1 ? 's' : ''} away`
              : daysUntilPayment === 0
              ? '⚠️ Due TODAY!'
              : `${Math.abs(daysUntilPayment)} day${Math.abs(daysUntilPayment) > 1 ? 's' : ''} OVERDUE!`
            }
          </div>
        </div>
      )}

      {/* Loan Timeline */}
      {startDate && endDate && (
        <div className="bg-gray-700 p-3 rounded text-sm">
          <div className="flex justify-between text-gray-400 mb-1">
            <span>Loan Period</span>
            <span>{totalLoanTenure} months ({(totalLoanTenure / 12).toFixed(1)} years)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">
              Start: {new Date(hirePurchase.startDate).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
            </span>
            <span className="text-xs text-gray-500">
              End: {endDate.toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit HP Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Vehicle Name</label>
                <input
                  type="text"
                  value={editData.vehicleName}
                  onChange={(e) => setEditData({...editData, vehicleName: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Loan Amount / Principal (RM)</label>
                <input
                  type="number"
                  value={editData.principal}
                  onChange={(e) => setEditData({...editData, principal: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Monthly Installment (RM)</label>
                <input
                  type="number"
                  value={editData.monthlyInstallment}
                  onChange={(e) => setEditData({...editData, monthlyInstallment: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Remaining Months</label>
                <input
                  type="number"
                  value={editData.remainingMonths}
                  onChange={(e) => setEditData({...editData, remainingMonths: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Interest Rate (% per annum)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editData.interestRate}
                  onChange={(e) => setEditData({...editData, interestRate: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Loan Start Date</label>
                <input
                  type="date"
                  value={editData.startDate}
                  onChange={(e) => setEditData({...editData, startDate: e.target.value})}
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

export default HirePurchaseTracker;
