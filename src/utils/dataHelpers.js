import { format, parseISO, differenceInDays, differenceInMonths } from 'date-fns';

export const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDefaultDailyData = () => ({
  fitness: {
    steps: 0,
    exerciseMinutes: 0,
    caloriesConsumed: 0,
    streak: 0
  },
  religious: {
    prayers: {
      subuh: { scheduled: '', completed: '', status: '', isCongregational: false },
      zohor: { scheduled: '', completed: '', status: '', isCongregational: false },
      asar: { scheduled: '', completed: '', status: '', isCongregational: false },
      maghrib: { scheduled: '', completed: '', status: '', isCongregational: false },
      isyak: { scheduled: '', completed: '', status: '', isCongregational: false }
    },
    goodDeeds: [],
    moods: { morning: null, afternoon: null, night: null }
  },
  finance: {
    dailySpending: 0
  },
  family: {
    qualityTimeMinutes: 0,
    activities: []
  }
});

export const calculateVibeScore = (dailyData) => {
  if (!dailyData) return 0;

  let fitnessScore = 0;
  if (dailyData.fitness) {
    const stepScore = dailyData.fitness.steps > 10000 ? 100 : (dailyData.fitness.steps / 10000) * 100;
    const exerciseScore = dailyData.fitness.exerciseMinutes > 45 ? 100 : (dailyData.fitness.exerciseMinutes / 45) * 100;
    fitnessScore = (stepScore + exerciseScore) / 2;
  }

  let religiousScore = 0;
  if (dailyData.religious) {
    const prayerCount = Object.values(dailyData.religious.prayers || {}).filter(p => p.completed).length;
    religiousScore = (prayerCount / 5) * 100;
  }

  let financeScore = 100;

  return Math.round((fitnessScore * 0.4) + (religiousScore * 0.3) + (financeScore * 0.3));
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  return format(typeof date === 'string' ? parseISO(date) : date, 'dd/MM/yyyy');
};

export const calculateAge = (birthDate) => {
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  const today = new Date();
  const months = differenceInMonths(today, birth);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return { years, months: remainingMonths, totalMonths: months };
};

export const getDaysSince = (date) => {
  const startDate = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(new Date(), startDate);
};
