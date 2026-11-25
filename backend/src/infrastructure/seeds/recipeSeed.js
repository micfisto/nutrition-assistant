import { Ingredient } from "../../domain/entities/Ingredient.js";
import { Recipe } from "../../domain/entities/Recipe.js";

const ing = (id, name, calories, proteins, fats, carbs) =>
  Ingredient.restore({
    id,
    name,
    caloriesPer100g: calories,
    proteinsPer100g: proteins,
    fatsPer100g: fats,
    carbsPer100g: carbs,
  });

const chicken = ing("ing-chicken", "Куриная грудка", 165, 31, 3.6, 0);
const rice = ing("ing-rice", "Рис", 130, 2.7, 0.3, 28);
const broccoli = ing("ing-broccoli", "Брокколи", 34, 2.8, 0.4, 7);
const oats = ing("ing-oats", "Овсяные хлопья", 389, 16.9, 6.9, 66);
const milk = ing("ing-milk", "Молоко", 42, 3.4, 1, 5);
const egg = ing("ing-egg", "Яйцо", 155, 13, 11, 1.1);
const salmon = ing("ing-salmon", "Лосось", 208, 20, 13, 0);
const potato = ing("ing-potato", "Картофель", 77, 2, 0.1, 17);
const yogurt = ing("ing-yogurt", "Йогурт натуральный", 59, 10, 0.4, 3.6);
const banana = ing("ing-banana", "Банан", 89, 1.1, 0.3, 23);
const tomato = ing("ing-tomato", "Помидор", 18, 0.9, 0.2, 3.9);
const bread = ing("ing-bread", "Зёрновой хлеб", 250, 9, 3, 45);
const cheese = ing("ing-cheese", "Сыр 30%", 260, 22, 18, 2);
const semolina = ing("ing-semolina", "Манная крупа", 360, 10, 1, 74);
const pasta = ing("ing-pasta", "Лапша яичная", 371, 13, 1.5, 75);
const carrot = ing("ing-carrot", "Морковь", 41, 0.9, 0.2, 9.6);
const onion = ing("ing-onion", "Лук репчатый", 40, 1.1, 0.1, 9);
const eggplant = ing("ing-eggplant", "Баклажан", 24, 1, 0.2, 6);
const zucchini = ing("ing-zucchini", "Цукини", 17, 1.2, 0.3, 3);
const bellPepper = ing("ing-bell-pepper", "Болгарский перец", 31, 1, 0.3, 6);
const cod = ing("ing-cod", "Треска", 82, 18, 0.7, 0);
const cauliflower = ing("ing-cauliflower", "Цветная капуста", 25, 2, 0.3, 5);
const walnut = ing("ing-walnut", "Грецкий орех", 654, 15, 65, 14);
const raisin = ing("ing-raisin", "Изюм", 299, 3, 0.5, 66);
const honey = ing("ing-honey", "Мёд", 304, 0.8, 0, 82);
const oliveOil = ing("ing-olive-oil", "Оливковое масло", 884, 0, 100, 0);
const blueberry = ing("ing-blueberry", "Черника", 57, 0.7, 0.3, 14);
const turkey = ing("ing-turkey", "Индейка", 104, 20, 2, 0);
const cabbage = ing("ing-cabbage", "Капуста белая", 25, 1.3, 0.1, 5);
const beetroot = ing("ing-beetroot", "Свёкла", 43, 1.6, 0.2, 9.5);
const cucumber = ing("ing-cucumber", "Огурец", 15, 0.7, 0.1, 3.6);
const feta = ing("ing-feta", "Фета", 264, 14, 21, 4);
const olives = ing("ing-olives", "Маслины", 115, 0.8, 10.7, 6);
const lemon = ing("ing-lemon", "Лимон", 29, 1.1, 0.3, 9);
const tuna = ing("ing-tuna", "Тунец консервированный", 116, 25, 1, 0);
const romaine = ing("ing-romaine", "Листья салата романо", 17, 1.2, 0.3, 3);
const cherryTomato = ing("ing-cherry-tomato", "Помидоры черри", 18, 0.9, 0.2, 3.9);
const parmesan = ing("ing-parmesan", "Пармезан", 392, 38, 25, 4);
const greekYogurt = ing("ing-greek-yogurt", "Греческий йогурт", 59, 10, 0, 3.6);
const wholeGrainCroutons = ing("ing-croutons", "Сухарики из цельнозернового хлеба", 350, 10, 3, 70);
const pumpkin = ing("ing-pumpkin", "Тыква", 26, 1, 0.1, 6.5);
const beefBroth = ing("ing-beef-broth", "Говяжий бульон (нежирный)", 30, 3, 1.5, 1);
const sourCream10 = ing("ing-sour-cream-10", "Сметана 10%", 118, 3, 10, 3);
const mushrooms = ing("ing-mushrooms", "Шампиньоны", 22, 3.1, 0.3, 3.3);
const cream10 = ing("ing-cream-10", "Сливки 10%", 120, 3, 10, 4);
const quinoa = ing("ing-quinoa", "Киноа", 368, 14, 6, 64);
const shrimp = ing("ing-shrimp", "Креветки", 99, 21, 1, 0.9);
const mackerel = ing("ing-mackerel", "Скумбрия", 205, 18, 14, 0);
const dorado = ing("ing-dorado", "Дорадо", 97, 20, 2, 0);
const cottageCheese = ing("ing-cottage-cheese", "Творог 5%", 120, 16, 5, 3);
const chiaSeeds = ing("ing-chia-seeds", "Семена чиа", 486, 17, 31, 42);
const coconutMilk = ing("ing-coconut-milk", "Кокосовое молоко", 230, 2.3, 23.8, 5.5);
const mango = ing("ing-mango", "Манго", 60, 0.8, 0.4, 15);
const chickpeas = ing("ing-chickpeas", "Нут", 364, 19, 6, 61);
const tahini = ing("ing-tahini", "Тахини", 595, 18, 53, 21);
const celery = ing("ing-celery", "Сельдерей", 16, 0.7, 0.2, 3);
const avocado = ing("ing-avocado", "Авокадо", 160, 2, 15, 9);
const breadWholeGrain = ing("ing-bread-whole-grain", "Цельнозерновой хлеб", 247, 13, 3.4, 41);
const apple = ing("ing-apple", "Яблоко", 52, 0.3, 0.2, 14);

const recipe = (id, title, description, servings, items, imageUrl = null, mealTypes = [], cookingMethod = null) =>
  Recipe.restore({
    id,
    title,
    description,
    servings,
    ingredients: items.map(([ingredient, amountInGrams]) => ({
      ingredient,
      amountInGrams,
    })),
    imageUrl,
    mealTypes,
    cookingMethod,
  });

export const recipeSeed = [
  recipe("rec-oatmeal", "Овсянка с бананом", "Овсянка на молоке с бананом", 1, [
    [oats, 60],
    [milk, 200],
    [banana, 100],
  ], null, ["breakfast"], "Варка"),
  recipe("rec-omelette", "Омлет", "Омлет с молоком", 1, [
    [egg, 150],
    [milk, 50],
  ], null, ["breakfast"], "Жарка"),
  recipe(
    "rec-chicken-rice",
    "Курица с рисом и брокколи",
    "Классический обед",
    2,
    [
      [chicken, 300],
      [rice, 200],
      [broccoli, 200],
    ],
    null,
    ["lunch", "dinner"],
    "Запекание"
  ),
  recipe("rec-salmon", "Лосось с картофелем", "Запечённый лосось", 2, [
    [salmon, 200],
    [potato, 300],
  ], null, ["dinner"], "Запекание"),
  recipe("rec-yogurt", "Йогурт с бананом", "Лёгкий перекус", 1, [
    [yogurt, 200],
    [banana, 100],
  ], null, ["snack"], null),
  recipe("rec-lunch-chicken-burger", "Куриный бургер", "Отбивная из курицы в булке с овощами", 1, [
    [chicken, 150],
    [bread, 60],
    [cheese, 30],
    [tomato, 50],
  ], null, ["lunch"], "Жарка"),
  recipe("rec-lunch-chicken-plov", "Плов с курицей", "Рис с курицей, морковью и луком", 1, [
    [rice, 150],
    [chicken, 150],
    [carrot, 80],
    [onion, 60],
    [oliveOil, 15],
  ], null, ["lunch", "dinner"], "Обжарить лук и морковь на оливковом масле 5 минут, добавить курицу, обжарить ещё 7 минут. Добавить рис, залить водой и варить на медленном огне 20 минут под крышкой."),
  recipe("rec-salad-greek", "Греческий салат", "Свежие овощи, фета, маслины и оливковое масло", 1, [
    [cucumber, 150],
    [tomato, 150],
    [onion, 50],
    [bellPepper, 50],
    [feta, 80],
    [olives, 30],
    [oliveOil, 15],
    [lemon, 20],
  ], null, ["lunch", "dinner"], "Огурцы, помидоры, лук и перец нарезать кубиками. Добавить кубики феты и маслины. Заправить оливковым маслом и соком лимона. Аккуратно перемешать и дать настояться 10 минут."),
  recipe("rec-salad-tuna-egg", "Салат с тунцом и яйцом", "Консервированный тунец, листья салата, огурец, черри, яйцо", 1, [
    [romaine, 100],
    [tuna, 100],
    [egg, 100],
    [cucumber, 100],
    [cherryTomato, 100],
    [oliveOil, 10],
    [lemon, 15],
  ], null, ["lunch", "dinner"], "Яйцо отварить 8 минут, остудить и очистить. Листья салата порвать руками, огурец и черри нарезать пополам. Тунец размять вилкой. Смешать все ингредиенты, заправить оливковым маслом и лимонным соком."),
  recipe("rec-salad-chicken-avocado", "Тёплый салат с куриной грудкой и авокадо", "Микс-салат, запечённое филе, авокадо, черри и лимонная заправка", 1, [
    [chicken, 150],
    [avocado, 100],
    [romaine, 100],
    [cherryTomato, 80],
    [oliveOil, 15],
    [lemon, 20],
  ], null, ["lunch", "dinner"], "Куриную грудку отбить, посолить, поперчить и запечь при 180°C 20 минут. Остудить и нарезать ломтиками. Авокадо очистить и нарезать дольками. Листья салата и черри вымыть. Собрать салат, заправить смесью оливкового масла и лимонного сока."),
  recipe("rec-salad-caesar-pp", "Салат «Цезарь» в ПП-версии", "Куриная грудка, романо, черри, пармезан, сухарики и соус на греческом йогурте", 1, [
    [chicken, 120],
    [romaine, 100],
    [cherryTomato, 80],
    [parmesan, 20],
    [wholeGrainCroutons, 20],
    [greekYogurt, 50],
    [lemon, 15],
  ], null, ["lunch", "dinner"], "Курицу отварить или запечь, нарезать полосками. Листья романо порвать руками. Черри нарезать пополам. Для соуса смешать греческий йогурт с лимонным соком, солью и перцем. Собрать салат, посыпать пармезаном и сухариками, полить соусом."),
  recipe("rec-soup-pumpkin", "Тыквенный крем-суп", "Нежный суп-пюре из тыквы и моркови с тыквенными семечками", 1, [
    [pumpkin, 300],
    [carrot, 100],
    [onion, 60],
    [beefBroth, 300],
    [cream10, 30],
    [walnut, 20],
  ], null, ["lunch", "dinner"], "Тыкву и морковь нарезать кубиками, лук полукольцами. Обжарить лук, добавить овощи, залить бульоном и варить 25 минут до мягкости. Смешать в пюре блендером, добавить сливки, соль и перец. Посыпть измельчёнными тыквенными семечками."),
  recipe("rec-soup-borscht", "Борщ с говядиной", "Классический суп на нежирном бульоне со сметаной 10%", 1, [
    [beefBroth, 400],
    [cabbage, 150],
    [beetroot, 150],
    [carrot, 80],
    [potato, 150],
    [onion, 60],
    [sourCream10, 30],
  ], null, ["lunch", "dinner"], "Отварить говядину до мягкости, вынуть и нарезать. В бульон добавить нарезанную капусту, свёклу, картофель, морковь и лук. Варить 30 минут. Вернуть говядину, посолить, поперчить. Подать со сметаной."),
  recipe("rec-soup-mushroom", "Грибной крем-суп", "Суп-пюре из шампиньонов с нежирными сливками", 1, [
    [mushrooms, 250],
    [potato, 200],
    [onion, 60],
    [beefBroth, 400],
    [cream10, 50],
  ], null, ["lunch", "dinner"], "Шампиньоны и лук обжарить 5 минут. Добавить нарезанный картофель, залить бульоном и варить 20 минут. Смешать в пюре, добавить сливки, соль и перец. Довести до кипения и снять с огня."),
  recipe("rec-dinner-quinoa-shrimp", "Киноа с креветками и овощами", "Белковый и лёгкий вариант на ужин", 1, [
    [quinoa, 100],
    [shrimp, 150],
    [zucchini, 150],
    [bellPepper, 80],
    [tomato, 80],
    [oliveOil, 10],
  ], null, ["dinner"], "Киноа отварить 15 минут. Креветки обжарить на оливковом масле 3 минуты. Кабачок, перец и помидор нарезать кубиками, обжарить 7 минут. Смешать все ингредиенты, посолить и поперчить."),
  recipe("rec-dinner-pasta-turkey", "Паста с индейкой и томатами", "Сытный обед со сложными углеводами", 1, [
    [pasta, 100],
    [turkey, 150],
    [tomato, 150],
    [onion, 60],
    [oliveOil, 10],
  ], null, ["lunch", "dinner"], "Пасту отварить al dente 9 минут. Индейку нарезать полосками, обжарить 6 минут. Лук и помидоры нарезать кубиками, потушить 5 минут. Смешать пасту, индейку и овощи, добавить соль и сушеные травы."),
  recipe("rec-dinner-mackerel", "Стейк из скумбрии на гриле с лимоном", "Источник полезных омега-3 жиров", 1, [
    [mackerel, 180],
    [lemon, 30],
    [oliveOil, 10],
  ], null, ["dinner"], "Скумбрию посолить, поперчить, полить лимонным соком и оливковым маслом. Оставить мариноваться 15 минут. Обжарить на гриле или сковороде без масла по 4 минуты с каждой стороны. Подать с дольками лимона."),
  recipe("rec-dinner-zucchini-pancakes", "Кабачковые оладьи со сметаной", "Лёгкий овощной вариант", 1, [
    [zucchini, 250],
    [egg, 50],
    [breadWholeGrain, 40],
    [sourCream10, 30],
  ], null, ["dinner"], "Кабачок натереть на крупной тёрке, отжать сок. Добавить яйцо, сухарики из цельнозернового хлеба, соль. Обжарить оладьи на сковороде с минимальным количеством масла по 3 минуты с каждой стороны. Подать со сметаной."),
  recipe("rec-breakfast-avocado-egg", "Тост с авокадо и яйцом пашот", "Популярный ПП-завтрак на цельнозерновом хлебе", 1, [
    [breadWholeGrain, 60],
    [avocado, 80],
    [egg, 50],
    [lemon, 10],
  ], null, ["breakfast"], "Тост подсушить в тостере. Авокадо размять вилкой с лимонным соком и солью. Яйцо приготовить «пашот»: сварить воду, сделать воронку ложкой, аккуратно вбить яйцо и варить 3 минуты. Смазать тост авокадо, выложить яйцо сверху."),
  recipe("rec-breakfast-syrniki-oven", "Сырники в духовке с греческим йогуртом", "Альтернатива запеканке, удобно брать с собой", 1, [
    [cottageCheese, 200],
    [egg, 50],
    [breadWholeGrain, 30],
    [greekYogurt, 50],
  ], null, ["breakfast", "snack"], "Творог смешать с яйцом и сухариками. Сформировать сырники, выложить на противень с пергаментом. Запечь при 180°C 15 минут. Подать с греческим йогуртом."),
  recipe("rec-snack-chia-pudding", "Чиа-пудинг на кокосовом молоке с манго", "Лёгкий десерт или перекус", 1, [
    [chiaSeeds, 25],
    [coconutMilk, 200],
    [mango, 80],
    [honey, 10],
  ], null, ["snack", "dessert"], "Смешать семена чиа с кокосовым молоком и мёдом. Оставить в холодильнике на 4 часа или ночь до загустения. Перед подачей добавить нарезанное манго."),
  recipe("rec-snack-hummus", "Хумус с овощными палочками", "Хрустящий несладкий перекус", 1, [
    [chickpeas, 100],
    [tahini, 15],
    [lemon, 20],
    [oliveOil, 10],
    [cucumber, 100],
    [carrot, 100],
    [celery, 50],
  ], null, ["snack"], "Нут отварить или взять консервированный, смешать с тахини, лимонным соком, оливковым маслом, солью. Взбить блендером в пюре. Овощи нарезать палочками. Подать хумус с овощными палочками для макания."),
  recipe("rec-breakfast-eggs-benedict", "Яйца Бенедикт с лососем", "ПП-завтрак с яйцом пашот и лососем", 1, [
    [breadWholeGrain, 60],
    [salmon, 80],
    [egg, 50],
    [greekYogurt, 40],
    [lemon, 10],
  ], null, ["breakfast"], "Тост подсушить. Лосось lightly обжарить 2 минуты с каждой стороны. Яйцо приготовить пашот (варить в кипятке 3 минуты). Смешать греческий йогурт с лимонным соком. Собрать: тост, лосось, яйцо, полить соусом."),
  recipe("rec-lunch-beef-stroganoff", "Говядина по-строгановски (ПП версия)", "Нежная говядина в соусе из греческого йогурта с грибами", 1, [
    [beefBroth, 200],
    [mushrooms, 100],
    [onion, 60],
    [greekYogurt, 50],
  ], null, ["lunch", "dinner"], "Говядину нарезать полосками, обжарить 5 минут. Добавить лук и грибы, обжарить ещё 5 минут. Добавить бульон, греческий йогурт, соль и перец. Тушить 15 минут на медленном огне."),
  recipe("rec-dinner-salmon-baked", "Лосось запечённый с брокколи", "Полезный ужин с омега-3", 1, [
    [salmon, 180],
    [broccoli, 200],
    [lemon, 20],
    [oliveOil, 10],
  ], null, ["dinner"], "Лосось посолить, поперчить, полить лимонным соком. Брокколи разделить на соцветия. Выложить на противень, полить оливковым маслом. Запекать при 180°C 18-20 минут."),
  recipe("rec-snack-protein-bar", "Белковый батончик с орехами и сухофруктами", "Полезный перекус между приёмами пищи", 1, [
    [walnut, 30],
    [raisin, 30],
    [chiaSeeds, 10],
    [honey, 20],
    [cottageCheese, 50],
  ], null, ["snack"], "Орехи и изюм нарубить. Смешать с творогом, семенами чиа и мёдом. Выложить в форму, уплотнить. Поставить в холодильник на 1 час, затем нарезать на батончики."),
  recipe("rec-breakfast-protein-shake", "Белковый коктейль с ягодами", "Быстрый завтрак или после тренировки", 1, [
    [cottageCheese, 150],
    [milk, 200],
    [blueberry, 80],
    [banana, 50],
    [chiaSeeds, 10],
  ], null, ["breakfast", "snack"], "Все ингредиенты смешать в блендере до однородности. Подать сразу."),
  recipe("rec-lunch-turkey-cutlet", "Отбивная из индейки под соусом", "Нежная индейка с грибным соусом", 1, [
    [turkey, 150],
    [mushrooms, 80],
    [onion, 50],
    [cream10, 50],
  ], null, ["lunch", "dinner"], "Индейку отбить, посолить, поперчить, обжарить 4 минуты с каждой стороны. Грибы и лук нарезать, обжарить 5 минут. Добавить сливки, тушить 5 минут. Полить индейку соусом."),
  recipe("rec-dinner-tuna-casserole", "Запеканка с тунцом и макаронами", "Сытный ужин с тунецом и томатами", 1, [
    [tuna, 100],
    [pasta, 80],
    [tomato, 100],
    [cheese, 30],
    [greekYogurt, 30],
  ], null, ["dinner"], "Макароны отварить. Тунец размять, помидоры нарезать кубиками. Смешать все ингредиенты с греческим йогуртом, посыпать сыром. Запекать при 180°C 15 минут."),
  recipe("rec-snack-fruit-salad", "Фруктовый салат с мёдом", "Свежие фрукты с мёдом и мятой", 1, [
    [banana, 80],
    [apple, 100],
    [mango, 80],
    [honey, 15],
  ], null, ["snack", "dessert"], "Все фрукты очистить и нарезать кубиками. Смешать, полить мёдом и аккуратно перемешать."),
  recipe("rec-breakfast-pumpkin-porridge", "Тыквенная каша на молоке", "Сладкий и сытный завтрак", 1, [
    [pumpkin, 200],
    [oats, 50],
    [milk, 200],
    [honey, 15],
  ], null, ["breakfast"], "Тыкву натереть на тёрке. Смешать с овсянкой и молоком, варить 15 минут. Подать с мёдом."),
  recipe("rec-dinner-stuffed-zucchini", "Фаршированные кабачки", "Кабачки с фаршем из индейки и рисом", 1, [
    [zucchini, 200],
    [turkey, 120],
    [rice, 50],
    [onion, 50],
    [tomato, 80],
  ], null, ["dinner"], "Кабачок разрезать пополам, удалить семяча. Фарш из индейки смешать с отварным рисом, нарезанным луком и томатами. Наполнить кабачки, запечь при 180°C 25 минут."),
];

export const seedRecipes = async (recipeRepo) => {
  const existing = await recipeRepo.findAll();
  if (existing.length > 0) {
    console.log(`Seeds already loaded (${existing.length} recipes). Skipping...`);
    return;
  }

  for (const recipe of recipeSeed) {
    await recipeRepo.save(recipe);
  }
  console.log(`Seeded ${recipeSeed.length} recipes`);
};
