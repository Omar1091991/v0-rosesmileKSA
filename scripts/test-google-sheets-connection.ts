/**
 * سكريبت اختبار اتصال Google Sheets
 * هذا السكريبت يختبر جميع جوانب اتصال Google Sheets ويوفر تشخيص كامل
 */

import { google } from 'googleapis';

async function testGoogleSheetsConnection() {
  console.log('🔍 بدء اختبار اتصال Google Sheets...\n');

  // 1. التحقق من المتغيرات البيئية
  console.log('📋 الخطوة 1: التحقق من المتغيرات البيئية');
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const folderId = process.env.GOOGLE_FOLDER_ID;

  if (!email) {
    console.error('❌ GOOGLE_SERVICE_ACCOUNT_EMAIL غير موجود');
    return;
  }
  console.log(`✅ Service Account Email: ${email}`);

  if (!privateKey) {
    console.error('❌ GOOGLE_PRIVATE_KEY غير موجود');
    return;
  }
  console.log('✅ Private Key موجود');

  if (!sheetId) {
    console.log('⚠️  GOOGLE_SHEET_ID غير موجود (اختياري)');
  } else {
    console.log(`✅ Sheet ID: ${sheetId}`);
  }

  if (!folderId) {
    console.log('⚠️  GOOGLE_FOLDER_ID غير موجود (اختياري)');
  } else {
    console.log(`✅ Folder ID: ${folderId}`);
  }

  console.log('\n');

  // 2. إنشاء Auth Client
  console.log('📋 الخطوة 2: إنشاء Auth Client');
  let auth;
  try {
    auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
    console.log('✅ Auth Client تم إنشاؤه بنجاح');
  } catch (error: any) {
    console.error('❌ فشل في إنشاء Auth Client:', error.message);
    return;
  }

  console.log('\n');

  // 3. اختبار Google Sheets API
  console.log('📋 الخطوة 3: اختبار Google Sheets API');
  const sheets = google.sheets({ version: 'v4', auth });

  if (sheetId) {
    try {
      // محاولة قراءة بيانات الجدول
      const response = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      });
      console.log(`✅ نجح الوصول إلى Google Sheet: "${response.data.properties?.title}"`);
      
      // محاولة قراءة البيانات
      try {
        const dataResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: 'A1:Z1',
        });
        console.log(`✅ نجح قراءة البيانات من الجدول`);
        if (dataResponse.data.values) {
          console.log(`   الأعمدة: ${dataResponse.data.values[0]?.join(', ')}`);
        }
      } catch (error: any) {
        console.error(`❌ فشل في قراءة البيانات: ${error.message}`);
      }

      // محاولة الكتابة إلى الجدول
      try {
        const testData = [['Test', new Date().toISOString()]];
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: 'A:B',
          valueInputOption: 'RAW',
          requestBody: {
            values: testData,
          },
        });
        console.log('✅ نجح الكتابة إلى الجدول');
      } catch (error: any) {
        console.error(`❌ فشل في الكتابة إلى الجدول: ${error.message}`);
        if (error.message.includes('403')) {
          console.error('   السبب: Service Account لا يملك صلاحيات الكتابة');
          console.error(`   الحل: شارك الجدول مع ${email} بصلاحية "محرر"`);
        }
      }
    } catch (error: any) {
      console.error(`❌ فشل في الوصول إلى Google Sheet: ${error.message}`);
      if (error.message.includes('403')) {
        console.error('   السبب: Service Account لا يملك صلاحيات الوصول');
        console.error(`   الحل: شارك الجدول مع ${email} بصلاحية "محرر"`);
      } else if (error.message.includes('404')) {
        console.error('   السبب: الجدول غير موجود أو تم حذفه');
      }
    }
  } else {
    console.log('⚠️  تخطي اختبار Google Sheet (لا يوجد Sheet ID)');
  }

  console.log('\n');

  // 4. اختبار Google Drive API
  console.log('📋 الخطوة 4: اختبار Google Drive API');
  const drive = google.drive({ version: 'v3', auth });

  // محاولة إنشاء جدول جديد
  try {
    const newSheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `Test Sheet - ${new Date().toISOString()}`,
        },
        sheets: [
          {
            properties: {
              title: 'Sheet1',
            },
          },
        ],
      },
    });
    console.log(`✅ نجح إنشاء جدول جديد: ${newSheet.data.spreadsheetId}`);
    console.log(`   الرابط: https://docs.google.com/spreadsheets/d/${newSheet.data.spreadsheetId}`);

    // حذف الجدول التجريبي
    try {
      await drive.files.delete({
        fileId: newSheet.data.spreadsheetId!,
      });
      console.log('✅ تم حذف الجدول التجريبي');
    } catch (error) {
      console.log('⚠️  لم يتم حذف الجدول التجريبي (يمكنك حذفه يدوياً)');
    }
  } catch (error: any) {
    console.error(`❌ فشل في إنشاء جدول جديد: ${error.message}`);
    if (error.message.includes('403')) {
      console.error('   السبب: Service Account لا يملك صلاحيات إنشاء جداول');
      console.error('   الحل: تحقق من تفعيل Google Sheets API و Google Drive API');
    }
  }

  console.log('\n');

  // 5. اختبار المجلد
  if (folderId) {
    console.log('📋 الخطوة 5: اختبار الوصول إلى المجلد');
    try {
      const folder = await drive.files.get({
        fileId: folderId,
        fields: 'id, name, permissions',
      });
      console.log(`✅ نجح الوصول إلى المجلد: "${folder.data.name}"`);

      // محاولة إنشاء جدول في المجلد
      try {
        const newSheetInFolder = await sheets.spreadsheets.create({
          requestBody: {
            properties: {
              title: `Test Sheet in Folder - ${new Date().toISOString()}`,
            },
            sheets: [
              {
                properties: {
                  title: 'Sheet1',
                },
              },
            ],
          },
        });

        // نقل الجدول إلى المجلد
        await drive.files.update({
          fileId: newSheetInFolder.data.spreadsheetId!,
          addParents: folderId,
          fields: 'id, parents',
        });

        console.log(`✅ نجح إنشاء جدول في المجلد: ${newSheetInFolder.data.spreadsheetId}`);

        // حذف الجدول التجريبي
        try {
          await drive.files.delete({
            fileId: newSheetInFolder.data.spreadsheetId!,
          });
          console.log('✅ تم حذف الجدول التجريبي من المجلد');
        } catch (error) {
          console.log('⚠️  لم يتم حذف الجدول التجريبي من المجلد');
        }
      } catch (error: any) {
        console.error(`❌ فشل في إنشاء جدول في المجلد: ${error.message}`);
        if (error.message.includes('403')) {
          console.error('   السبب: Service Account لا يملك صلاحيات الكتابة في المجلد');
          console.error(`   الحل: شارك المجلد مع ${email} بصلاحية "محرر"`);
        }
      }
    } catch (error: any) {
      console.error(`❌ فشل في الوصول إلى المجلد: ${error.message}`);
      if (error.message.includes('403')) {
        console.error('   السبب: Service Account لا يملك صلاحيات الوصول للمجلد');
        console.error(`   الحل: شارك المجلد مع ${email} بصلاحية "محرر"`);
      } else if (error.message.includes('404')) {
        console.error('   السبب: المجلد غير موجود أو تم حذفه');
      }
    }
  } else {
    console.log('📋 الخطوة 5: تخطي اختبار المجلد (لا يوجد Folder ID)');
  }

  console.log('\n');

  // 6. النتيجة النهائية
  console.log('=' .repeat(60));
  console.log('📊 النتيجة النهائية');
  console.log('=' .repeat(60));
  console.log('\n✨ إذا رأيت رسائل خطأ أعلاه، اتبع الحلول المقترحة:');
  console.log('\n1. تأكد من مشاركة Google Sheet مع Service Account:');
  console.log(`   - افتح: https://docs.google.com/spreadsheets/d/${sheetId}`);
  console.log('   - اضغط "مشاركة"');
  console.log(`   - أضف: ${email}`);
  console.log('   - اختر صلاحية: "محرر"');
  console.log('\n2. تأكد من مشاركة المجلد مع Service Account:');
  console.log(`   - افتح: https://drive.google.com/drive/folders/${folderId}`);
  console.log('   - اضغط "مشاركة"');
  console.log(`   - أضف: ${email}`);
  console.log('   - اختر صلاحية: "محرر"');
  console.log('\n3. تأكد من تفعيل APIs:');
  console.log('   - Google Sheets API: https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=rosesmile-booking');
  console.log('   - Google Drive API: https://console.cloud.google.com/apis/library/drive.googleapis.com?project=rosesmile-booking');
  console.log('\n');
}

testGoogleSheetsConnection().catch((error) => {
  console.error('❌ خطأ غير متوقع:', error);
});
