//alarmFunction.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const schedule = require('node-schedule');

admin.initializeApp();

exports.scheduleNotifications = functions.firestore.document('alarms/{alarmId}')
  .onCreate(async (snapshot, context) => {
    try {
      const alarmData = snapshot.data();
      const { days, time, userId } = alarmData;
      const [hour, minute] = time.split(':');
      
      const scheduledDate = new Date();
      scheduledDate.setUTCHours(Number(hour));
      scheduledDate.setUTCMinutes(Number(minute));
      const dayOfWeek = days.map(day => ['일', '월', '화', '수', '목', '금', '토'].indexOf(day));
      
      const rule = new schedule.RecurrenceRule();
      rule.dayOfWeek = dayOfWeek;
      rule.hour = scheduledDate.getUTCHours();
      rule.minute = scheduledDate.getUTCMinutes();

      const job = schedule.scheduleJob(rule, async () => {
        try {
          const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
          const user = userSnapshot.data();
          const userFCMToken = user.fcmToken;

          const message = {
            notification: {
              title: 'Truffle',
              body: '지금까지의 소비를 확인해보세요',
            },
            token: userFCMToken,
            android: {
              priority: 'high',
              notification: {
                click_action: 'YOUR_ACTION_ACTIVITY', // 여기 부분에 그 알람 푸쉬 누르면 어디로 갈지 결정해서 설정 해야함.
              },
            },
          };

          const response = await admin.messaging().send(message);
          console.log('알림이 성공적으로 전송되었습니다:', response);
        } catch (error) {
          console.error('알림 전송 중 오류 발생:', error);
        }
      });

      console.log('알람이 예약되었습니다.');
    } catch (error) {
      console.error('알람 예약 중 오류 발생:', error);
    }

    return null;
  });


    console.log('알람이 예약되었습니다.');

    return null;
  });
