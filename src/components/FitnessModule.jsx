import { useState } from 'react';

function FitnessModule({ date, data, settings, onUpdate, onUpdateSettings }) {
  const [showMealPresets, setShowMealPresets] = useState(false);
  const [showEditTarget, setShowEditTarget] = useState(false);
  const [editCalorieTarget, setEditCalorieTarget] = useState(1500);

  const fitnessData = data?.fitness || {
    steps: 0,
    exerciseMinutes: 0,
    caloriesConsumed: 0,
    streak: 0
  };

  const calorieTarget = settings?.calorieTarget || 1500;

  const mealPresets = [
    { name: 'Nasi Lemak', calories: 450 },
    { name: 'Roti Canai (2pcs)', calories: 300 },
    { name: 'Nasi Kandar', calories: 650 },
    { name: 'Mee Goreng', calories: 520 },
    { name: 'Teh Tarik', calories: 120 },
    { name: 'Nasi Ayam', calories: 550 },
    { name: 'Char Kuey Teow', calories: 600 }
  ];

  const updateFitness = (field, value) => {
    onUpdate(date, {
      ...data,
      fitness: {
        ...fitnessData,
        [field]: value
      }
    });
  };

  const addCalories = (amount) => {
    updateFitness('caloriesConsumed', fitnessData.caloriesConsumed + amount);
  };

  const addMealPreset = (calories) => {
    addCalories(calories);
    setShowMealPresets(false);
  };

  // Calculations
  const caloriesBurnedFromSteps = fitnessData.steps * 0.04;
  const caloriesBurnedFromExercise = fitnessData.exerciseMinutes * 5;
  const totalCaloriesBurned = caloriesBurnedFromSteps + caloriesBurnedFromExercise;
  const netCalorieBalance = totalCaloriesBurned - fitnessData.caloriesConsumed;

  // Scoring
  const getStepScore = (steps) => {
    if (steps >= 10000) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-900' };
    if (steps >= 8000) return { label: 'Good', color: 'text-green-300', bg: 'bg-green-800' };
    if (steps >= 5000) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-900' };
  };

  const getExerciseScore = (minutes) => {
    if (minutes >= 45) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-900' };
    if (minutes >= 30) return { label: 'Good', color: 'text-green-300', bg: 'bg-green-800' };
    if (minutes >= 15) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-900' };
  };

  const getCalorieBalanceScore = (consumed, target) => {
    const percentageOfTarget = (consumed / target) * 100;

    if (percentageOfTarget <= 100) return { label: 'On Target', color: 'text-green-400', bg: 'bg-green-900' };
    if (percentageOfTarget <= 120) return { label: 'Slightly Over', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    return { label: 'Over Target', color: 'text-red-400', bg: 'bg-red-900' };
  };

  const stepScore = getStepScore(fitnessData.steps);
  const exerciseScore = getExerciseScore(fitnessData.exerciseMinutes);
  const balanceScore = getCalorieBalanceScore(fitnessData.caloriesConsumed, calorieTarget);

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold">🏃 Fitness</h2>

      {/* Steps Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold">Steps Today</label>
          <span className={`text-xs px-2 py-1 rounded ${stepScore.bg} ${stepScore.color}`}>
            {stepScore.label}
          </span>
        </div>
        <input
          type="number"
          value={fitnessData.steps}
          onChange={(e) => updateFitness('steps', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 bg-gray-700 rounded text-2xl font-bold text-center"
          placeholder="0"
        />
        <div className="text-xs text-gray-400 text-center">
          Calories burned: {caloriesBurnedFromSteps.toFixed(0)} cal
        </div>
      </div>

      {/* Exercise Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold">Exercise (minutes)</label>
          <span className={`text-xs px-2 py-1 rounded ${exerciseScore.bg} ${exerciseScore.color}`}>
            {exerciseScore.label}
          </span>
        </div>
        <input
          type="number"
          value={fitnessData.exerciseMinutes}
          onChange={(e) => updateFitness('exerciseMinutes', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 bg-gray-700 rounded text-2xl font-bold text-center"
          placeholder="0"
        />
        <div className="text-xs text-gray-400 text-center">
          Calories burned: {caloriesBurnedFromExercise.toFixed(0)} cal
        </div>
      </div>

      {/* Calories Consumed Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold">Calories Consumed</label>
            <button
              onClick={() => {
                setEditCalorieTarget(calorieTarget);
                setShowEditTarget(true);
              }}
              className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
              title="Edit daily calorie target"
            >
              ⚙️
            </button>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${balanceScore.bg} ${balanceScore.color}`}>
            {balanceScore.label}
          </span>
        </div>

        <div className="text-xs text-gray-400 text-center mb-1">
          Daily Target: {calorieTarget} cal
        </div>

        <input
          type="number"
          value={fitnessData.caloriesConsumed}
          onChange={(e) => updateFitness('caloriesConsumed', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 bg-gray-700 rounded text-2xl font-bold text-center"
          placeholder="0"
        />

        {/* Quick Add Buttons */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => addCalories(100)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
          >
            +100
          </button>
          <button
            onClick={() => addCalories(250)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
          >
            +250
          </button>
          <button
            onClick={() => addCalories(500)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
          >
            +500
          </button>
        </div>

        {/* Malaysian Meal Presets Button */}
        <button
          onClick={() => setShowMealPresets(!showMealPresets)}
          className="w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm"
        >
          🍽️ Malaysian Meals
        </button>

        {/* Meal Presets Grid */}
        {showMealPresets && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {mealPresets.map(meal => (
              <button
                key={meal.name}
                onClick={() => addMealPreset(meal.calories)}
                className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 text-xs text-left"
              >
                <div className="font-semibold">{meal.name}</div>
                <div className="text-gray-400">{meal.calories} cal</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gray-700 p-4 rounded space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Burned</span>
          <span className="font-semibold text-green-400">{totalCaloriesBurned.toFixed(0)} cal</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Consumed</span>
          <span className="font-semibold text-orange-400">{fitnessData.caloriesConsumed} cal</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Daily Target</span>
          <span className="font-semibold text-blue-400">{calorieTarget} cal</span>
        </div>
        <div className="border-t border-gray-600 pt-2 flex justify-between">
          <span className="text-gray-400">vs Target</span>
          <span className={`font-bold text-lg ${
            fitnessData.caloriesConsumed <= calorieTarget ? 'text-green-400' : 'text-red-400'
          }`}>
            {fitnessData.caloriesConsumed <= calorieTarget ? '✓ ' : ''}
            {fitnessData.caloriesConsumed - calorieTarget > 0 ? '+' : ''}
            {fitnessData.caloriesConsumed - calorieTarget} cal
          </span>
        </div>
        <div className="border-t border-gray-600 pt-2 flex justify-between">
          <span className="text-gray-400">Net Balance</span>
          <span className={`font-bold text-lg ${netCalorieBalance > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {netCalorieBalance > 0 ? '+' : ''}{netCalorieBalance.toFixed(0)} cal
          </span>
        </div>
      </div>

      {/* Streak Display */}
      {fitnessData.streak > 0 && (
        <div className="bg-orange-900 p-3 rounded text-center">
          <div className="text-2xl">🔥</div>
          <div className="text-sm text-orange-200">
            {fitnessData.streak} day streak of 8K+ steps!
          </div>
        </div>
      )}

      {/* Edit Calorie Target Modal */}
      {showEditTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Daily Calorie Target</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-400">
                  Set your daily calorie intake target (from MyFitnessPal)
                </label>
                <input
                  type="number"
                  value={editCalorieTarget}
                  onChange={(e) => setEditCalorieTarget(parseInt(e.target.value) || 1500)}
                  className="w-full px-4 py-3 bg-gray-700 rounded text-center text-2xl font-bold"
                  placeholder="1500"
                />
                <div className="text-xs text-gray-400 mt-2 text-center">
                  Recommended: 1500 cal/day for weight loss
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  onUpdateSettings({
                    ...settings,
                    calorieTarget: editCalorieTarget
                  });
                  setShowEditTarget(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Save Target
              </button>
              <button
                onClick={() => setShowEditTarget(false)}
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

export default FitnessModule;
