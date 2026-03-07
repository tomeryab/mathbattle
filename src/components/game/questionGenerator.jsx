// Question generator for all math topics - Grade 3

export const TOPICS = {
  addition_subtraction_100: { label: "חיבור וחיסור עד 100", icon: "➕" },
  addition_subtraction_1000: { label: "חיבור וחיסור עד 1000", icon: "➕" },
  addition_carrying: { label: "חיבור עם העברה", icon: "➕" },
  subtraction_borrowing: { label: "חיסור עם השאלה", icon: "➖" },
  multiplication_table: { label: "לוח הכפל", icon: "✖️" },
  multiplication_2digit: { label: "כפל דו-ספרתי בחד-ספרתי", icon: "✖️" },
  division_basic: { label: "חילוק בסיסי", icon: "➗" },
  multiplication_division_relation: { label: "קשרי כפל-חילוק", icon: "🔄" },
  place_value: { label: "ערך מקומי", icon: "🔢" },
  number_comparison: { label: "השוואת מספרים", icon: "🔢" },
  rounding: { label: "עיגול מספרים", icon: "🔢" },
  even_odd: { label: "זוגי ואי-זוגי", icon: "🔢" },
  perimeter: { label: "היקף צורות", icon: "📐" },
  area_basic: { label: "שטח בסיסי", icon: "📐" },
  time: { label: "זמן", icon: "⏰" },
  money: { label: "כסף", icon: "💰" },
  fractions_basic: { label: "שברים בסיסיים", icon: "½" },
  fractions_comparison: { label: "השוואת שברים", icon: "½" },
  word_problems_1step: { label: "בעיות מילוליות חד-שלביות", icon: "🧩" },
  word_problems_2step: { label: "בעיות מילוליות דו-שלביות", icon: "🧩" },
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOptions(answer, count = 4) {
  const options = new Set([answer]);
  let attempts = 0;
  while (options.size < count && attempts < 50) {
    attempts++;
    const offset = rand(-15, 15);
    const opt = answer + offset;
    if (opt !== answer && opt >= 0) options.add(opt);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}

function generateQuestion(topic, difficulty) {
  let question, answer;

  switch (topic) {
    case "addition_subtraction_100": {
      const a = difficulty === "easy" ? rand(1, 20) : difficulty === "medium" ? rand(10, 50) : rand(20, 80);
      const b = difficulty === "easy" ? rand(1, 20) : difficulty === "medium" ? rand(10, 40) : rand(10, 99 - a);
      const isAdd = Math.random() > 0.5;
      if (isAdd) { question = `${a} + ${b} = ?`; answer = a + b; }
      else { const big = Math.max(a, b); const small = Math.min(a, b); question = `${big} - ${small} = ?`; answer = big - small; }
      break;
    }
    case "addition_subtraction_1000": {
      const a = difficulty === "easy" ? rand(100, 400) : difficulty === "medium" ? rand(100, 700) : rand(100, 900);
      const b = difficulty === "easy" ? rand(100, 300) : difficulty === "medium" ? rand(100, 500) : rand(50, 1000 - a);
      const isAdd = Math.random() > 0.5;
      if (isAdd) { question = `${a} + ${b} = ?`; answer = a + b; }
      else { const big = Math.max(a, b); const small = Math.min(a, b); question = `${big} - ${small} = ?`; answer = big - small; }
      break;
    }
    case "addition_carrying": {
      const units = rand(5, 9);
      const a = rand(1, 6) * 10 + units;
      const addUnits = rand(10 - units, 15);
      const b = addUnits;
      question = `${a} + ${b} = ?`; answer = a + b;
      break;
    }
    case "subtraction_borrowing": {
      const a = difficulty === "easy" ? rand(20, 50) : difficulty === "medium" ? rand(30, 80) : rand(50, 150);
      const bUnits = rand((a % 10) + 1, 9);
      const bTens = rand(0, Math.floor(a / 10) - 1);
      const b = bTens * 10 + bUnits;
      question = `${a} - ${b} = ?`; answer = a - b;
      break;
    }
    case "multiplication_table": {
      const tableMax = difficulty === "easy" ? 5 : difficulty === "medium" ? 8 : 10;
      const a = rand(2, tableMax);
      const b = rand(2, tableMax);
      question = `${a} × ${b} = ?`; answer = a * b;
      break;
    }
    case "multiplication_2digit": {
      const a = difficulty === "easy" ? rand(10, 20) : difficulty === "medium" ? rand(10, 30) : rand(10, 49);
      const b = difficulty === "easy" ? rand(2, 4) : difficulty === "medium" ? rand(2, 6) : rand(2, 9);
      question = `${a} × ${b} = ?`; answer = a * b;
      break;
    }
    case "division_basic": {
      const divisor = difficulty === "easy" ? rand(2, 4) : difficulty === "medium" ? rand(2, 6) : rand(2, 10);
      const quotient = difficulty === "easy" ? rand(2, 5) : difficulty === "medium" ? rand(2, 8) : rand(2, 10);
      const dividend = divisor * quotient;
      question = `${dividend} ÷ ${divisor} = ?`; answer = quotient;
      break;
    }
    case "multiplication_division_relation": {
      const a = rand(2, 8); const b = rand(2, 8);
      const product = a * b;
      const type = rand(0, 2);
      if (type === 0) { question = `${a} × ${b} = ?`; answer = product; }
      else if (type === 1) { question = `${product} ÷ ${a} = ?`; answer = b; }
      else { question = `${product} ÷ ${b} = ?`; answer = a; }
      break;
    }
    case "place_value": {
      const num = difficulty === "easy" ? rand(10, 99) : difficulty === "medium" ? rand(100, 999) : rand(1000, 9999);
      const places = difficulty === "easy" ? ["עשרות", "אחדות"] : difficulty === "medium" ? ["אחדות", "עשרות", "מאות"] : ["אחדות", "עשרות", "מאות", "אלפים"];
      const place = places[rand(0, places.length - 1)];
      question = `כמה ${place} יש במספר ${num}?`;
      if (place === "אחדות") answer = num % 10;
      else if (place === "עשרות") answer = Math.floor(num / 10) % 10;
      else if (place === "מאות") answer = Math.floor(num / 100) % 10;
      else answer = Math.floor(num / 1000) % 10;
      break;
    }
    case "number_comparison": {
      const a = rand(1, 500); const b = rand(1, 500);
      question = `מה המספר הגדול יותר: ${a} או ${b}?`;
      answer = Math.max(a, b);
      break;
    }
    case "rounding": {
      const roundTo = difficulty === "easy" ? 10 : difficulty === "medium" ? 100 : 1000;
      const num = rand(roundTo + 5, roundTo * 9 - 5);
      question = `עגל את ${num} ל${difficulty === "easy" ? "עשרת" : difficulty === "medium" ? "מאת" : "אלפית"} הקרובה`;
      answer = Math.round(num / roundTo) * roundTo;
      break;
    }
    case "even_odd": {
      const num = rand(2, 50) * 2;
      const isEven = Math.random() > 0.5;
      question = `כמה ${isEven ? "מספרים זוגיים" : "מספרים אי-זוגיים"} יש בין 1 ל-${num}?`;
      answer = isEven ? num / 2 : num / 2;
      break;
    }
    case "perimeter": {
      const side = difficulty === "easy" ? rand(2, 8) : difficulty === "medium" ? rand(3, 12) : rand(4, 15);
      question = `היקף ריבוע עם צלע ${side} ס"מ`;
      answer = 4 * side;
      break;
    }
    case "area_basic": {
      const w = difficulty === "easy" ? rand(2, 5) : difficulty === "medium" ? rand(3, 8) : rand(4, 10);
      const h = difficulty === "easy" ? rand(2, 5) : difficulty === "medium" ? rand(3, 8) : rand(4, 10);
      question = `שטח מלבן עם אורך ${w} ורוחב ${h}`;
      answer = w * h;
      break;
    }
    case "time": {
      const startHour = rand(7, 14);
      const addMins = difficulty === "easy" ? [15, 30, 45, 60][rand(0, 3)] : difficulty === "medium" ? rand(10, 90) : rand(30, 180);
      question = `השעה היא ${startHour}:00. כמה דקות יש להוסיף כדי להגיע ל-${startHour + Math.floor(addMins/60)}:${addMins%60 === 0 ? "00" : (addMins%60 < 10 ? "0"+(addMins%60) : addMins%60)}?`;
      answer = addMins;
      break;
    }
    case "money": {
      const price1 = difficulty === "easy" ? rand(1, 20) : difficulty === "medium" ? rand(5, 50) : rand(10, 80);
      const price2 = difficulty === "easy" ? rand(1, 20) : difficulty === "medium" ? rand(5, 50) : rand(10, 80);
      question = `קנית מוצר ב-₪${price1} ועוד מוצר ב-₪${price2}. כמה שילמת סה"כ?`;
      answer = price1 + price2;
      break;
    }
    case "fractions_basic": {
      const denom = [2, 3, 4][rand(0, 2)];
      const numer = rand(1, denom - 1);
      const whole = rand(2, 6) * denom;
      question = `כמה זה ${numer}/${denom} מ-${whole}?`;
      answer = (whole / denom) * numer;
      break;
    }
    case "fractions_comparison": {
      const pairs = [[1,2,1,3],[1,3,1,4],[1,2,3,4],[2,3,3,4],[1,4,1,2]];
      const [n1,d1,n2,d2] = pairs[rand(0, pairs.length-1)];
      const val1 = n1/d1; const val2 = n2/d2;
      question = `מה גדול יותר: ${n1}/${d1} או ${n2}/${d2}? (1 = הראשון, 2 = השני)`;
      answer = val1 > val2 ? 1 : val1 < val2 ? 2 : 0;
      break;
    }
    case "word_problems_1step": {
      const a = rand(5, 40); const b = rand(5, 30);
      const templates = [
        { q: `לדן יש ${a} עפרונות. הוא קיבל עוד ${b}. כמה עפרונות יש לו?`, a: a + b },
        { q: `בסל היו ${a + b} תפוחים. נלקחו ${b}. כמה נשארו?`, a: a },
        { q: `${a} ילדים שיחקו. הצטרפו עוד ${b}. כמה ילדים בסה"כ?`, a: a + b },
      ];
      const t = templates[rand(0, templates.length - 1)];
      question = t.q; answer = t.a;
      break;
    }
    case "word_problems_2step": {
      const a = rand(5, 20); const b = rand(3, 15); const c = rand(2, 8);
      const templates = [
        { q: `ענת קנתה ${a} עגבניות ו-${b} מלפפונים. נתנה לשכנה ${c}. כמה ירקות נשארו?`, a: a + b - c },
        { q: `כיתה א' גידלה ${a} צמחים, כיתה ב' גידלה ${b}. נבלו ${c}. כמה נשארו?`, a: a + b - c },
      ];
      const t = templates[rand(0, templates.length - 1)];
      question = t.q; answer = t.a;
      break;
    }
    default: {
      const a = rand(1, 20); const b = rand(1, 20);
      question = `${a} + ${b} = ?`; answer = a + b;
    }
  }

  return { question, answer, options: generateOptions(answer) };
}

export function generateQuestions(topic, difficulty, count = 10) {
  return Array.from({ length: count }, () => generateQuestion(topic, difficulty));
}