import { useState } from 'react';

function FamilyModule({ date, data, familySettings, onUpdate, onUpdateSettings }) {
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneText, setMilestoneText] = useState('');
  const [showActivityInput, setShowActivityInput] = useState(false);
  const [newActivity, setNewActivity] = useState('');

  const familyData = data?.family || {
    qualityTimeMinutes: 0,
    activities: []
  };

  const sonBirthDate = new Date(familySettings?.sonBirthDate || '2023-06-01');
  const today = new Date();
  const ageInMonths = (today.getFullYear() - sonBirthDate.getFullYear()) * 12 +
                      (today.getMonth() - sonBirthDate.getMonth());
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;

  const updateFamily = (updates) => {
    onUpdate(date, {
      ...data,
      family: {
        ...familyData,
        ...updates
      }
    });
  };

  const addMilestone = () => {
    if (!milestoneText.trim()) return;

    const newMilestones = [
      ...(familySettings?.milestones || []),
      {
        id: Date.now().toString(),
        date: date,
        description: milestoneText,
        ageMonths: ageInMonths
      }
    ];

    onUpdateSettings({
      ...familySettings,
      milestones: newMilestones
    });

    setMilestoneText('');
    setShowMilestone(false);
  };

  const addActivity = () => {
    if (!newActivity.trim()) return;

    updateFamily({
      activities: [...familyData.activities, newActivity]
    });

    setNewActivity('');
    setShowActivityInput(false);
  };

  const quickActivities = ['Playground', 'Reading', 'Drawing', 'Playing', 'Educational Games', 'Music'];

  const addQuickActivity = (activity) => {
    if (!familyData.activities.includes(activity)) {
      updateFamily({
        activities: [...familyData.activities, activity]
      });
    }
  };

  const targetMinutes = 90;
  const percentage = Math.min((familyData.qualityTimeMinutes / targetMinutes) * 100, 100);
  const statusColor = percentage >= 100 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  const recentMilestones = (familySettings?.milestones || []).slice(-3).reverse();

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold">👨‍👦 Family</h2>

      {/* Son's Age */}
      <div className="bg-gray-700 p-4 rounded text-center">
        <div className="text-sm text-gray-400">Son's Age</div>
        <div className="text-2xl font-bold">
          {years} year{years !== 1 ? 's' : ''}, {months} month{months !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Quality Time Tracker */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-semibold">Quality Time Today</span>
          <span className="text-sm text-gray-400">{familyData.qualityTimeMinutes}/{targetMinutes} min</span>
        </div>

        <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${statusColor} transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => updateFamily({ qualityTimeMinutes: familyData.qualityTimeMinutes + 15 })}
            className="flex-1 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
          >
            +15 min
          </button>
          <button
            onClick={() => updateFamily({ qualityTimeMinutes: familyData.qualityTimeMinutes + 30 })}
            className="flex-1 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
          >
            +30 min
          </button>
          <button
            onClick={() => updateFamily({ qualityTimeMinutes: familyData.qualityTimeMinutes + 60 })}
            className="flex-1 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
          >
            +1 hr
          </button>
        </div>

        <input
          type="number"
          value={familyData.qualityTimeMinutes}
          onChange={(e) => updateFamily({ qualityTimeMinutes: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 bg-gray-700 rounded text-center"
          placeholder="Enter minutes manually"
        />
      </div>

      {/* Activities */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Today's Activities</span>
          <button
            onClick={() => setShowActivityInput(true)}
            className="text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            + Custom
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickActivities.map(activity => (
            <button
              key={activity}
              onClick={() => addQuickActivity(activity)}
              className={`text-xs px-3 py-1 rounded ${
                familyData.activities.includes(activity)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {activity}
            </button>
          ))}
        </div>

        {familyData.activities.length > 0 && (
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-xs text-gray-400 mb-1">Selected activities:</div>
            <div className="text-sm">{familyData.activities.join(', ')}</div>
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Recent Milestones</span>
          <button
            onClick={() => setShowMilestone(true)}
            className="text-xs px-2 py-1 bg-purple-600 rounded hover:bg-purple-700"
          >
            + Add
          </button>
        </div>

        {recentMilestones.length > 0 ? (
          <div className="space-y-2">
            {recentMilestones.map(milestone => (
              <div key={milestone.id} className="bg-purple-900 p-3 rounded">
                <div className="text-sm font-semibold">{milestone.description}</div>
                <div className="text-xs text-purple-300">{milestone.date} • {Math.floor(milestone.ageMonths / 12)}y {milestone.ageMonths % 12}m old</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-xs text-center py-2">No milestones recorded yet</p>
        )}
      </div>

      {/* Add Milestone Modal */}
      {showMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Milestone</h3>
            <textarea
              value={milestoneText}
              onChange={(e) => setMilestoneText(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded"
              rows="3"
              placeholder="What milestone did your son achieve?"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={addMilestone}
                className="flex-1 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowMilestone(false);
                  setMilestoneText('');
                }}
                className="flex-1 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showActivityInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Custom Activity</h3>
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded"
              placeholder="Activity name"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={addActivity}
                className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowActivityInput(false);
                  setNewActivity('');
                }}
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

export default FamilyModule;
