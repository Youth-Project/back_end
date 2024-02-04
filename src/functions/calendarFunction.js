// Import necessary Firebase functions
import { db } from './firebaseConfig'

//주간 달력을 가져오는 함수 input값으로 selectedData, 즉 선택한 날짜를 받음
const getWeeklyCalendar = async (selectedDate) => {
  try {
    // Find the start and end dates of the week containing the selected date
    const selectedDateObject = new Date(selectedDate);
    const startDate = new Date(selectedDateObject);
    startDate.setDate(selectedDateObject.getDate() - selectedDateObject.getDay() + (selectedDateObject.getDay() === 0 ? -6 : 1));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Format dates to match the document ID in the collection
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // Retrieve the weekly calendar data
    const calendarSnapshot = await db.collection('weeklyCalendars').doc(`${formattedStartDate}_${formattedEndDate}`).get();
    const calendarData = calendarSnapshot.data();

    console.log('Weekly calendar retrieved successfully');
    return calendarData;
  } catch (error) {
    console.error('Error getting weekly calendar:', error);
    return null;
  }
};

// '2024-02-01'식의 format으로 바꿔주는 함수, 위에 있는 함수를 보조해주려고 만든 함수
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

//그래프 데이터 설정하기
//selectedPeriod는 그 꺾은선 그래프가 어떤식으로 보일지 정할때 들어갈 변수, graphdata는 그 그래프 그릴때 설정한 데이터를 db에서 받을꺼임.
const setGraphData = async (selectedPeriod, graphData) => {
  try {
    const graphDataRef = db.collection('graphData');

    // 도넛 그래프 데이터 설정 (1개월 단위)
    await graphDataRef.doc('monthlyDonutGraph').set(graphData.donutGraphData);

    if (selectedPeriod === 'monthly6Months' || selectedPeriod === 'monthly1Year') {
      // 꺾은선 그래프 데이터 설정
      await graphDataRef.doc(`${selectedPeriod}LineGraph`).set(graphData.lineGraphData);
    } else {
      console.error('Invalid selectedPeriod:', selectedPeriod);
      return false;
    }

    console.log('Graph data set successfully');
    return true;
  } catch (error) {
    console.error('Error setting graph data:', error);
    return false;
  }
};

// addDailyExpense
// 날짜의 하루 지출 추가 input으로는 선택한 날짜랑 그 날짜에 작성한 소비 데이터를 받음.
const addDailyExpense = async (date, expenseData) => {
  try {
    const dailyExpenseRef = db.collection('dailyExpenses').doc(date);
    await dailyExpenseRef.set(expenseData);
    console.log('Daily expense added successfully');
    return true;
  } catch (error) {
    console.error('Error adding daily expense:', error);
    return false;
  }
};

//getDailyExpense
// 그 선택한 날짜의 소비 내역을 불러오는 함수로 인풋으로는 날짜를 받음.
const getDailyExpense = async (date) => {
  try {
    const expenseSnapshot = await db.collection('dailyExpenses').doc(date).get();
    const expenseData = expenseSnapshot.data();
    console.log('Daily expense retrieved successfully');
    return expenseData;
  } catch (error) {
    console.error('Error getting daily expense:', error);
    return null;
  }
};

//도넛, 꺾은선 그래프 가져오기 
//인풋으로 그 기간 선택(1개월, 6개월, 1년)을 받음
const getGraphData = async (selectedPeriod) => {
  try {
    const graphDataRef = db.collection('graphData');

    // 도넛 그래프 데이터 가져오기
    const donutGraphSnapshot = await graphDataRef.doc('monthlyDonutGraph').get();
    const donutGraphData = donutGraphSnapshot.data();

    if (selectedPeriod === 'monthly6Months') {
      // 꺾은선 그래프 데이터 가져오기
      const lineGraphSnapshot = await graphDataRef.doc('monthly6MonthsLineGraph').get();
      const lineGraphData = lineGraphSnapshot.data();

      return { donutGraphData, lineGraphData };
    } else if (selectedPeriod === 'monthly1Year') {
      // 꺾은선 그래프 데이터 가져오기
      const lineGraphSnapshot = await graphDataRef.doc('monthly1YearLineGraph').get();
      const lineGraphData = lineGraphSnapshot.data();

      return { donutGraphData, lineGraphData };
    } else if (selectedPeriod === 'monthly1Month') {
      // 꺾은선 그래프 데이터 가져오기
      const lineGraphSnapshot = await graphDataRef.doc('monthly1MonthLineGraph').get();
      const lineGraphData = lineGraphSnapshot.data();

      return { donutGraphData, lineGraphData };
    } else {
      console.error('Invalid selectedPeriod:', selectedPeriod);
      return null;
    }
  } catch (error) {
    console.error('Error getting graph data:', error);
    return null;
  }
};

export {
  formatDate,
  getWeeklyCalendar,
  setGraphData,
  addDailyExpense,
  getDailyExpense,
  getGraphData,
};
