// =====================================================
// SPEEDRUN x ISRAEL — Google Apps Script Backend
// =====================================================
// SETUP:
// 1. Create a new Google Sheet
// 2. Rename "Sheet1" to "Registrations"
// 3. Add a second sheet called "IntroRequests"
// 4. In "Registrations" row 1 add headers:
//    Timestamp | Company | Founder | Email | LinkedIn | Blurb | Materials
// 5. In "IntroRequests" row 1 add headers:
//    ID | Date | Company | Founder | LinkedIn | OneLiner | Materials | TargetVC | TargetVCName | WhyThisFund | IntroNotes | Status
// 6. Go to Extensions > Apps Script
// 7. Paste this entire code and click Save
// 8. Click Deploy > New deployment
// 9. Type: Web app, Execute as: Me, Who has access: Anyone
// 10. Copy the deployment URL and paste it into the dashboard config
// =====================================================

function doGet(e) {
  var action = e.parameter.action;

  if (action === 'getRegistrations') {
    return getRegistrations();
  } else if (action === 'getRequests') {
    return getRequests();
  }

  return ContentService.createTextOutput(JSON.stringify({ error: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = data.action;

  if (action === 'register') {
    return registerFounder(data);
  } else if (action === 'introRequest') {
    return addIntroRequest(data);
  } else if (action === 'updateRequestStatus') {
    return updateRequestStatus(data);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function registerFounder(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Registrations');

  // Check if company already registered (update if so)
  var existing = sheet.getDataRange().getValues();
  for (var i = 1; i < existing.length; i++) {
    if (existing[i][1] === data.company && existing[i][3] === data.email) {
      // Update existing row
      sheet.getRange(i + 1, 1, 1, 7).setValues([[
        new Date().toISOString(),
        data.company,
        data.name,
        data.email,
        data.linkedIn,
        data.blurb,
        data.materials || ''
      ]]);
      return ContentService.createTextOutput(JSON.stringify({ success: true, updated: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // New registration
  sheet.appendRow([
    new Date().toISOString(),
    data.company,
    data.name,
    data.email,
    data.linkedIn,
    data.blurb,
    data.materials || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function addIntroRequest(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('IntroRequests');

  sheet.appendRow([
    data.id,
    data.date,
    data.company,
    data.founder,
    data.linkedIn,
    data.oneLiner,
    data.materials || '',
    data.targetVC,
    data.targetVCName,
    data.whyThisFund || '',
    data.introNotes || '',
    data.status || 'Pending'
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateRequestStatus(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('IntroRequests');
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sheet.getRange(i + 1, 12).setValue(data.status); // Column L = Status
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Request not found' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRegistrations() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Registrations');
  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var result = [];
  for (var i = 1; i < data.length; i++) {
    result.push({
      timestamp: data[i][0],
      company: data[i][1],
      name: data[i][2],
      email: data[i][3],
      linkedIn: data[i][4],
      blurb: data[i][5],
      materials: data[i][6]
    });
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRequests() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('IntroRequests');
  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var result = [];
  for (var i = 1; i < data.length; i++) {
    result.push({
      id: data[i][0],
      date: data[i][1],
      company: data[i][2],
      founder: data[i][3],
      linkedIn: data[i][4],
      oneLiner: data[i][5],
      materials: data[i][6],
      targetVC: data[i][7],
      targetVCName: data[i][8],
      whyThisFund: data[i][9],
      introNotes: data[i][10],
      status: data[i][11]
    });
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
