export const INITIAL_STATE = {
  settings: {
    dailyBudget: 75,
    prayerZone: "SGR01",
    theme: "dark",
    calorieTarget: 1500
  },
  accounts: [],
  transactions: [],
  dailyData: {},
  mortgage: null,
  hirePurchase: null,
  family: {
    sonBirthDate: "2023-06-01",
    milestones: []
  }
};

export const STORAGE_KEY = 'za-dashboard-data';
