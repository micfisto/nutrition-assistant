export const ACTIVITY_LEVELS = [
  { value: 1.2, label: "Сидячий образ жизни" },
  { value: 1.375, label: "Лёгкая активность (1–3 тренировки в неделю)" },
  { value: 1.55, label: "Умеренная активность (3–5 тренировок)" },
  { value: 1.725, label: "Высокая активность (6–7 тренировок)" },
  { value: 1.9, label: "Очень высокая (физический труд + тренировки)" },
];

export const DEFAULT_ACTIVITY = 1.55;

// factor: множитель к TDEE, proteinPerKg: г белка на кг веса
export const GOALS = {
  LOSE_WEIGHT: { label: "Похудение", factor: 0.85, proteinPerKg: 2.0 },
  MAINTAIN: { label: "Поддержание веса", factor: 1, proteinPerKg: 1.6 },
  GAIN_MUSCLE: { label: "Набор массы", factor: 1.1, proteinPerKg: 1.8 },
};

const FAT_PER_KG = 0.9;

export function calcAge(birthDate, today = new Date()) {
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function validateInput({ birthDate, weight, height }) {
  const errors = {};

  if (!birthDate) {
    errors.birthDate = "Укажите дату рождения";
  } else {
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) {
      errors.birthDate = "Некорректная дата рождения";
    } else if (birth > new Date()) {
      errors.birthDate = "Дата рождения не может быть в будущем";
    } else {
      const age = calcAge(birthDate);
      if (age < 12 || age > 120) {
        errors.birthDate = "Возраст должен быть от 12 до 120 лет";
      }
    }
  }

  if (weight === null) {
    errors.weight = "Укажите вес";
  } else if (!(weight >= 30 && weight <= 300)) {
    errors.weight = "Вес должен быть от 30 до 300 кг";
  }

  if (height === null) {
    errors.height = "Укажите рост";
  } else if (!(height >= 100 && height <= 250)) {
    errors.height = "Рост должен быть от 100 до 250 см";
  }

  return errors;
}

export function calcTargets({ gender, birthDate, weight, height, activityLevel, goal }) {
  const age = calcAge(birthDate);

  // формула Миффлина-Сан Жеора
  const genderShift = gender === "male" ? 5 : -161;
  const bmr = 10 * weight + 6.25 * height - 5 * age + genderShift;
  const tdee = bmr * activityLevel;

  const goalInfo = GOALS[goal];
  const calories = tdee * goalInfo.factor;

  const protein = goalInfo.proteinPerKg * weight;
  const fat = FAT_PER_KG * weight;
  
  const carbs = Math.max(0, (calories - protein * 4 - fat * 9) / 4);

  return {
    age,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: Math.round(calories),
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs),
  };
}