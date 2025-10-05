import { useState, useEffect } from 'react';

function ReligiousModule({ date, data, settings, onUpdate }) {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGoodDeedModal, setShowGoodDeedModal] = useState(false);
  const [newGoodDeed, setNewGoodDeed] = useState('');

  const religiousData = data?.religious || {
    prayers: {
      subuh: { scheduled: '', completed: '', status: '', isCongregational: false },
      zohor: { scheduled: '', completed: '', status: '', isCongregational: false },
      asar: { scheduled: '', completed: '', status: '', isCongregational: false },
      maghrib: { scheduled: '', completed: '', status: '', isCongregational: false },
      isyak: { scheduled: '', completed: '', status: '', isCongregational: false }
    },
    goodDeeds: [],
    moods: { morning: null, afternoon: null, night: null }
  };

  // Fetch prayer times from JAKIM API
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        // Using official Malaysia e-Solat API
        const response = await fetch(`https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${settings.prayerZone}`);
        const result = await response.json();

        if (result && result.prayerTime && result.prayerTime.length > 0) {
          const times = result.prayerTime[0];
          setPrayerTimes({
            subuh: times.fajr,
            zohor: times.dhuhr,
            asar: times.asr,
            maghrib: times.maghrib,
            isyak: times.isha
          });
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        // Fallback to hardcoded times for SGR01 (Semenyih) if API fails
        setPrayerTimes({
          subuh: '05:45',
          zohor: '13:08',
          asar: '16:28',
          maghrib: '19:16',
          isyak: '20:28'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [settings.prayerZone, date]);

  const updateReligious = (updates) => {
    onUpdate(date, {
      ...data,
      religious: {
        ...religiousData,
        ...updates
      }
    });
  };

  const togglePrayer = (prayerName) => {
    const prayer = religiousData.prayers[prayerName];
    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    if (!prayer.completed) {
      // Mark as completed with current time as default
      const status = calculatePrayerStatus(prayerTimes[prayerName], now);
      updateReligious({
        prayers: {
          ...religiousData.prayers,
          [prayerName]: {
            ...prayer,
            scheduled: prayerTimes[prayerName],
            completed: now,
            status: status
          }
        }
      });
    } else {
      // Unmark
      updateReligious({
        prayers: {
          ...religiousData.prayers,
          [prayerName]: {
            ...prayer,
            completed: '',
            status: ''
          }
        }
      });
    }
  };

  const toggleJemaah = (prayerName) => {
    updateReligious({
      prayers: {
        ...religiousData.prayers,
        [prayerName]: {
          ...religiousData.prayers[prayerName],
          isCongregational: !religiousData.prayers[prayerName].isCongregational
        }
      }
    });
  };

  const updatePrayerTime = (prayerName, newTime) => {
    const status = calculatePrayerStatus(prayerTimes[prayerName], newTime);
    updateReligious({
      prayers: {
        ...religiousData.prayers,
        [prayerName]: {
          ...religiousData.prayers[prayerName],
          completed: newTime,
          status: status
        }
      }
    });
  };

  const calculatePrayerStatus = (scheduledTime, completedTime) => {
    if (!scheduledTime || !completedTime) return 'unknown';

    const scheduled = new Date(`2000-01-01 ${scheduledTime}`);
    const completed = new Date(`2000-01-01 ${completedTime}`);
    const diffMinutes = (completed - scheduled) / 1000 / 60;

    if (diffMinutes <= 30) return 'on-time';
    if (diffMinutes <= 120) return 'in-window';
    return 'qada';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time': return 'text-green-400 bg-green-900';
      case 'in-window': return 'text-yellow-400 bg-yellow-900';
      case 'qada': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'on-time': return 'On Time';
      case 'in-window': return 'In Window';
      case 'qada': return 'Qada';
      default: return '';
    }
  };

  const setMood = (period, value) => {
    updateReligious({
      moods: {
        ...religiousData.moods,
        [period]: value
      }
    });
  };

  const addGoodDeed = () => {
    if (!newGoodDeed.trim()) return;

    updateReligious({
      goodDeeds: [
        ...religiousData.goodDeeds,
        {
          id: Date.now().toString(),
          description: newGoodDeed,
          timestamp: new Date().toISOString()
        }
      ]
    });

    setNewGoodDeed('');
    setShowGoodDeedModal(false);
  };

  const removeGoodDeed = (id) => {
    updateReligious({
      goodDeeds: religiousData.goodDeeds.filter(deed => deed.id !== id)
    });
  };

  // Calculate scores
  const completedPrayers = Object.values(religiousData.prayers).filter(p => p.completed).length;
  const onTimePrayers = Object.values(religiousData.prayers).filter(p => p.status === 'on-time').length;
  const jemaahPrayers = Object.values(religiousData.prayers).filter(p => p.isCongregational).length;

  const getPrayerScore = () => {
    if (completedPrayers === 5 && onTimePrayers === 5 && jemaahPrayers >= 3) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-900' };
    if (completedPrayers === 5 && onTimePrayers >= 4) return { label: 'Good', color: 'text-green-300', bg: 'bg-green-800' };
    if (completedPrayers >= 4) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    return { label: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-900' };
  };

  const getGoodDeedsScore = () => {
    const count = religiousData.goodDeeds.length;
    if (count >= 5) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-900' };
    if (count >= 3) return { label: 'Good', color: 'text-green-300', bg: 'bg-green-800' };
    if (count >= 1) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-900' };
  };

  const moods = Object.values(religiousData.moods).filter(m => m !== null);
  const averageMood = moods.length > 0 ? (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1) : 0;

  const prayerScore = getPrayerScore();
  const goodDeedsScore = getGoodDeedsScore();

  const moodEmojis = ['😞', '😐', '🙂', '😊', '😄'];

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold">🕌 Religious</h2>

      {/* Prayer Times Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Prayer Tracker</h3>
          <span className={`text-xs px-2 py-1 rounded ${prayerScore.bg} ${prayerScore.color}`}>
            {prayerScore.label}
          </span>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-4">Loading prayer times...</div>
        ) : !prayerTimes ? (
          <div className="text-center text-red-400 py-4">Failed to load prayer times</div>
        ) : (
          <div className="space-y-2">
            {Object.entries(prayerTimes).map(([name, time]) => {
              const prayer = religiousData.prayers[name];
              const isCompleted = !!prayer.completed;

              return (
                <div key={name} className={`p-3 rounded ${isCompleted ? 'bg-gray-700' : 'bg-gray-900'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => togglePrayer(name)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold capitalize">{name}</div>
                        <div className="text-xs text-gray-400">Scheduled: {time}</div>
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(prayer.status)}`}>
                          {getStatusLabel(prayer.status)}
                        </span>
                        <button
                          onClick={() => toggleJemaah(name)}
                          className={`text-xs px-2 py-1 rounded ${prayer.isCongregational ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                          {prayer.isCongregational ? '👥 Jemaah' : 'Solo'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Manual Time Input - Only show when checked */}
                  {isCompleted && (
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-xs text-gray-400">Completed at:</label>
                      <input
                        type="time"
                        value={prayer.completed}
                        onChange={(e) => updatePrayerTime(name, e.target.value)}
                        className="px-2 py-1 bg-gray-800 rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-gray-700 p-3 rounded text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Completed:</span>
            <span className="font-semibold">{completedPrayers}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">On Time:</span>
            <span className="font-semibold text-green-400">{onTimePrayers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Jemaah:</span>
            <span className="font-semibold text-blue-400">{jemaahPrayers}</span>
          </div>
        </div>
      </div>

      {/* Good Deeds Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Good Deeds</h3>
          <span className={`text-xs px-2 py-1 rounded ${goodDeedsScore.bg} ${goodDeedsScore.color}`}>
            {goodDeedsScore.label}
          </span>
        </div>

        <button
          onClick={() => setShowGoodDeedModal(true)}
          className="w-full px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          + Add Good Deed
        </button>

        {religiousData.goodDeeds.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {religiousData.goodDeeds.map(deed => (
              <div key={deed.id} className="bg-gray-700 p-3 rounded flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm">{deed.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(deed.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => removeGoodDeed(deed.id)}
                  className="text-red-400 hover:text-red-300 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-2">No good deeds logged yet</p>
        )}
      </div>

      {/* Mood Tracker Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Mood Tracker</h3>

        {['morning', 'afternoon', 'night'].map(period => (
          <div key={period} className="space-y-2">
            <label className="text-sm capitalize text-gray-400">
              {period} {religiousData.moods[period] ? `(${religiousData.moods[period]}/5)` : ''}
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  onClick={() => setMood(period, value)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    religiousData.moods[period] === value ? 'scale-125' : 'opacity-40'
                  }`}
                >
                  {moodEmojis[value - 1]}
                </button>
              ))}
            </div>
          </div>
        ))}

        {moods.length > 0 && (
          <div className="bg-gray-700 p-3 rounded text-center">
            <div className="text-sm text-gray-400">Average Mood Today</div>
            <div className="text-3xl">{moodEmojis[Math.round(averageMood) - 1]}</div>
            <div className="text-xl font-bold">{averageMood}/5</div>
          </div>
        )}
      </div>

      {/* Good Deed Modal */}
      {showGoodDeedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Good Deed</h3>
            <textarea
              value={newGoodDeed}
              onChange={(e) => setNewGoodDeed(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded"
              rows="3"
              placeholder="What good deed did you do?"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={addGoodDeed}
                className="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowGoodDeedModal(false);
                  setNewGoodDeed('');
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

export default ReligiousModule;
