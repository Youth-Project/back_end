//alarmFunction.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const schedule = require('node-schedule');

admin.initializeApp();

// Firestore 'alarms' 컬렉션에 문서가 생성될 때 실행되는 함수
exports.scheduleNotifications = functions.firestore.document('alarms/{alarmId}')
  .onCreate(async (snapshot, context) => {
    // 알람 데이터 가져오기
    const alarmData = snapshot.data();

    // 푸시 알림을 예약할 날짜 및 시간 설정
    const { days, time, userId } = alarmData;
    const [hour, minute] = time.split(':');
    const scheduledDate = new Date();
    scheduledDate.setUTCHours(Number(hour));
    scheduledDate.setUTCMinutes(Number(minute));
    const dayOfWeek = days.map(day => ['일', '월', '화', '수', '목', '금', '토'].indexOf(day));
    
    // 예약 조건 설정 (요일, 시간)
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = dayOfWeek;
    rule.hour = scheduledDate.getUTCHours();
    rule.minute = scheduledDate.getUTCMinutes();

    // 예약된 작업 생성
    const job = schedule.scheduleJob(rule, async () => {
      try {
        // 알림 메시지 구성
        const message = {
          notification: {
            title: 'Truffle',
            body: '지금까지의 소비를 확인해보세요',
          },
        };
        
        // 사용자의 FCM 토큰 가져오기
        const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
        const user = userSnapshot.data();
        const userFCMToken = user.fcmToken;

        // FCM을 통해 알림 메시지 전송
        const response = await admin.messaging().sendToDevice(userFCMToken, message);
        console.log('알림이 성공적으로 전송되었습니다:', response);
      } catch (error) {
        console.error('알림 전송 중 오류 발생:', error);
      }
    });

    console.log('알람이 예약되었습니다.');

    return null;
  });
