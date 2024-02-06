// recipeFunctions.js 수정 필요!!

import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// 냉장고 재료 가져오기 (말 그대로 디비에 map으로 저장된 정보를 가져오는거)
const getRefrigeratorIngredients = async () => {
  const ingredientArray = await getDocs(collection(db, 'ingredients'));
  return ingredientArray.docs.map((doc) => doc.data());
};

//냉장고에서 재료 추가버튼 눌렀을때 그 선택된 재료가 들어가는 펑션
// 선택한 재료를 저장하거나 업데이트
//맵에서 정보 가져오기 (정확하게 한지는 헷갈)
const addToUsersRefrigerator = (inputId, inputGram,users_refrigerator_map, updateFirebaseUsersRefrigerator) => {
  const existingIngredientIndex = users_refrigerator_map.findIndex(ingredient => ingredient.ingredient_name === inputName);
  const existingIngredientIndex2 = existingIngredientIndex.docs.map((doc) => doc.data());
//맵 정보 가저오기 맵.get(key) 로 가져오는거라고 해서 const = 맵.get(key)로 불러오기 (맞는지는 불확실) https://stonefree.tistory.com/460 여기서 봄
  const existingIngredientName = existingIngredientIndex2.get(ingredient_name);
  const existingIngredientImage = existingIngredientIndex2.get(ingredient_image);
  const existingIngredientCategory = existingIngredientIndex2.get(ingredient_category);
  //만약에 같은 재료가 있으면 그램만 추가
  if (existingIngredientIndex !== -1) {
    users_refrigerator_map[existingIngredientIndex].ingredient_gram += parseFloat(inputGram);
  } else { //아니면 재료에 모든 정보 추가
    const newIngredient = {
      ingredient_id: inputId, //(수정필요)
      ingredient_name: existingIngredientName,
      ingredient_gram: parseFloat(inputGram),
      ingredient_image: existingIngredientImage,
      ingredient_category: existingIngredientImage
    };

    users_refrigerator_map.push(newIngredient);
  }
//이건 하영이가 만들어놔서 100퍼 잘 모르겠음
  if (updateFirebaseUsersRefrigerator) { //(수정필요)
    await updateFirebaseUsersRefrigerator(users_refrigerator_map);
  }
};

//재료 검색기능
// 검색 시 비슷한 재료 카테고리 나오게하는 함수 (필터써서 서치기능)
const ingredientSearchFilter = (searchInput) => { //searchInput=입력값
  return ingredientMap.filter((ingredient) =>
    ingredient.ingredient_name.includes(searchInput)
  );
};

//디비에 gram으로만 저장되어 있는데 레시피나 다른곳에 단위를 변환해서 보여줘야할때
// 다른 unit으로 변환하기
//디비에서 가져오고                   그램      재료   어떤 유닛 전환인지 현제 유닛
const switchUnitConversion = async (weight, ingredient, conversionType,currentUnit) => { //아 그러고 보니 currentUnit 왜 만들었더라?
  const ratioArray = await getDocs(collection(db, 'ingredients'));
  const conversionType2 = ratioArray.docs.map((doc) => doc.data());
  //switch/case구문으로 각 케이스에 걸리면 그거에 맞는값을 리턴 예) conversionType=gram_to_unit; --> return (weight * conversionType2[conversionType]).toFixed(0); 으로 단위를 바꿔주는 함수
  switch (conversionType) {
    case 'gram_to_gram':
      return weight;
    case 'gram_to_unit':
      return (weight * conversionType2[conversionType]).toFixed(0);
    case 'unit_to_gram':
      return (weight / conversionType2[conversionType]).toFixed(2);
    case 'gram_to_spoon':
      return (weight * conversionType2[conversionType]).toFixed(2);
    case 'spoon_to_gram':
      return (weight / conversionType2[conversionType]).toFixed(2);
    case 'gram_to_ml':
      return (weight * conversionType2[conversionType]).toFixed(2);
    case 'ml_to_gram':
      return (weight / conversionType2[conversionType]).toFixed(2);
    default:
      return weight;
  }
};

// 레시피에서 조리 완료시 냉장고의 재료가 줄어들도록하는 함수
const subtractIngredient = async (weight, kind, name) => {
  //ogGram은 원래 디비에서 받은값
  const ogGram = (await collection(db, 'ingredients').doc(kind).get()).data().ingredient_gram;
  const updateValue = ogGram - weight; //차감되는 함수니깐 차감

  await collection(db, 'users').doc(kind).update({ [name]: { ingredient_gram: Math.max(0, updateValue) } });
};//차감된 값을 다시 db에 넣어주는데 만약 넣어주는 값 (updateValue)가 마이너스이면 updateValue=0으로 만들어버리는 함수

// recipe 컬렉션에 레시피 추가하는 함수 (수정필요)
const addRecipeToCollection = async (recipeData) => {
  try {
    const recipeRef = await addDoc(collection(db, 'recipe'), recipeData);
    console.log('Recipe added with ID: ', recipeRef.id);
    return recipeRef.id;
  } catch (error) {
    console.error('Error adding recipe: ', error);
  }
};

// bookmark 컬렉션에 북마크 추가하는 함수
const addBookmark = async (userId, recipeId) => {
  try {
    const bookmarkRef = doc(db, 'bookmark', userId);
    await updateDoc(bookmarkRef, { [recipeId]: true });
    await addBookmarkToUser(userId, recipeId);
    console.log('Bookmark added successfully.');
  } catch (error) {
    console.error('Error adding bookmark: ', error);
  }
};

// recipeLack 컬렉션에 부족한 재료 추가하는 함수 (수정필요)
const addLackToCollection = async (lackData) => {
  try {
    const lackRef = await addDoc(collection(db, 'recipeLack'), lackData);
    console.log('Lack added with ID: ', lackRef.id);
    return lackRef.id;
  } catch (error) {
    console.error('Error adding lack: ', error);
  }
};


// 가나다순으로 정렬하는 함수
const orderByKorean = async () => {
  const koreanOrder = await db.collection('recipe').orderBy('recipeName').get();
  return koreanOrder.docs.map((doc) => doc.data());
};

// 부족한 재료 갯수가 적은 순으로 정렬하는 함수
const refrigeratorOrderByLack = async (refrigeratorIngredients) => {
  const lackOrder = await db.collection('recipe').get();

  const sortedRecipe = lackOrder.docs
    .map((recipeDoc) => {
      const recipeDocData = recipeDoc.data();
      const lack = compareIngredients(refrigeratorIngredients, recipeDocData.recipe_ingredients);

      return {
        recipeId: recipeDoc.recipeId,
        lackCount: lack.length,
      };
    })
    .sort((a, b) => a.lackCount - b.lackCount);

  return sortedRecipe.map((recipeDocData) => ({
    recipeId: recipeDocData.recipeId,
    lackCount: recipeDocData.lackCount,
  }));
};

// 북마크된 레시피의 아이디 가져오는 함수
const getBookmarkedRecipes = async (userId) => {
  const bookmarkData = await db.collection('bookmark').doc(userId).get();
  const bookmarkedRecipeIds = [];

  for (const id in bookmarkData.data() || {}) {
    if (bookmarkData.data()[id] === true) {
      bookmarkedRecipeIds.push(id);
    }
  }

  return bookmarkedRecipeIds;
};

// 레시피 추가 시 recipeCounter를 증가시켜서 레시피 아이디 생성하는 함수
let recipeCounter = 0;
const recipeIdGenerator = () => {
  recipeCounter += 1;
  return 'recipe' + recipeCounter;
};

// 북마크 토글 함수
const toggleBookmark = async (userId, recipeId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const bookmarkedRecipes = userData.bookmarkedRecipes || [];

      if (bookmarkedRecipes.includes(recipeId)) {
        // 레시피가 이미 북마크되어 있으면 제거
        const updatedBookmarkedRecipes = bookmarkedRecipes.filter(id => id !== recipeId);
        await updateDoc(userRef, { bookmarkedRecipes: updatedBookmarkedRecipes });
        console.log('Bookmark removed from user successfully.');
      } else {
        // 레시피가 북마크되어 있지 않으면 추가
        updatedBookmarkedRecipes.push(recipeId);
        await updateDoc(userRef, { bookmarkedRecipes: updatedBookmarkedRecipes });
        console.log('Bookmark added to user successfully.');
      }
    } else {
      console.error('User not found.');
    }
  } catch (error) {
    console.error('Error toggling bookmark: ', error);
  }
};


// 레시피와 냉장고에 있는 재료 비교하는 함수
const compareIngredients = (refrigeratorIngredients, recipeIngredients) => {
  const notInRef = [];
  for (let i = 0; i < recipeIngredients.length; i++) {
    const component = recipeIngredients[i];

    if (!refrigeratorIngredients.includes(component)) {
      notInRef.push(component);
    }
  }

  return notInRef;
};

// 북마크된 레시피의 아이디를 사용자 필드에 추가하는 함수
const addBookmarkToUser = async (userId, recipeId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const bookmarkedRecipes = userData.bookmarkedRecipes || [];

      if (!bookmarkedRecipes.includes(recipeId)) {
        bookmarkedRecipes.push(recipeId);
        await updateDoc(userRef, { bookmarkedRecipes });
        console.log('Bookmark added to user successfully.');
      } else {
        console.log('Recipe is already bookmarked by the user.');
      }
      
    } else {
      console.error('User not found.');
    }
    
  } catch (error) {
    console.error('Error adding bookmark to user: ', error);
  }
};

export {
  addBookmarkToUser,
  getRefrigeratorIngredients,
  addToUsersRefrigerator,
  ingredientSearchFilter,
  switchUnitConversion,
  subtractIngredient,
  addRecipeToCollection,
  addBookmark,
  addLackToCollection,
  orderByKorean,
  refrigeratorOrderByLack,
  getBookmarkedRecipes,
  recipeIdGenerator,
  compareIngredients,
};
