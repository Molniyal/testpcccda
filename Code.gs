/**
 * PCCC ERP CORE CONTROLLER
 * This file handles routing and coordination between modules.
 */

function doGet(e) {
  var action = e.parameter.action;
  if (action === "getDashboardData") return getDashboardData(e);
  if (action === "getEmployee") return ContentService.createTextOutput(JSON.stringify(getEmployeeInfo(e.parameter.maNV))).setMimeType(ContentService.MimeType.JSON);
  if (action === "getDevice") return ContentService.createTextOutput(JSON.stringify(getDevice(e))).setMimeType(ContentService.MimeType.JSON);
  if (action === "reportBrokenQR") return ContentService.createTextOutput(JSON.stringify(reportBrokenQR(e))).setMimeType(ContentService.MimeType.JSON);
  
  // GAS Template include helper (for modular HTML)
  return HtmlService.createTemplateFromFile('index').evaluate()
      .setTitle('QUẢN LÝ PCCC PRO')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.action === "saveSettings") return ContentService.createTextOutput(JSON.stringify(saveSettings(data))).setMimeType(ContentService.MimeType.JSON);
    if (data.action === "deleteLocation" || data.action === "addLocation" || data.action === "editLocation") {
      return ContentService.createTextOutput(JSON.stringify(handleLocationAction(data))).setMimeType(ContentService.MimeType.JSON);
    }
    if (data.action === "deleteLog" || data.action === "editLog" || data.action === "sendEmails") {
      return ContentService.createTextOutput(JSON.stringify(handleLogAction(data))).setMimeType(ContentService.MimeType.JSON);
    }
    if (data.maTB && !data.action) return ContentService.createTextOutput(JSON.stringify(submitReport(data))).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getDashboardData(e) {
  var auth = checkAuth(e.parameter.maNV || "", e.parameter.matKhau || "");
  if (!auth.match) return ContentService.createTextOutput(JSON.stringify({status: "error", message: "AUTH_FAILED"})).setMimeType(ContentService.MimeType.JSON);
  if (auth.role === "USER") return ContentService.createTextOutput(JSON.stringify({status: "error", message: "NO_PERMISSION"})).setMimeType(ContentService.MimeType.JSON);

  var locations = getLocationsList(auth.role, auth.xuongQL);
  var logs = getLogsList(locations);
  var templates = getTemplates();

  return ContentService.createTextOutput(JSON.stringify({ 
    status: "success", 
    name: auth.tenNV, 
    role: auth.role, 
    xuong: auth.xuongQL, 
    locations: locations, 
    logs: logs, 
    templates: templates 
  })).setMimeType(ContentService.MimeType.JSON);
}

function getTemplates() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mailData = ss.getSheetByName("CaiDat_Email").getDataRange().getValues();
  var templates = [];
  for(var i=1; i<mailData.length; i++) {
    templates.push({ id: i, name: mailData[i][0], to: mailData[i][1], cc: mailData[i][2], subject: mailData[i][3], body: mailData[i][4] });
  }
  return templates;
}

function saveSettings(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sMail = ss.getSheetByName("CaiDat_Email");
  if(sMail.getLastRow() > 1) sMail.getRange(2, 1, sMail.getLastRow() - 1, 5).clearContent();
  for(var i=0; i<data.templates.length; i++) {
    var t = data.templates[i];
    sMail.appendRow([t.name, t.to, t.cc, t.subject, t.body]);
  }
  return {status: "success"};
}

function getDevice(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var locData = ss.getSheetByName("Master_ViTri").getDataRange().getValues();
  for(var i=1; i<locData.length; i++) {
    if(locData[i][0].toString().toUpperCase() === e.parameter.id.toUpperCase()) {
      return { status: "success", ma_tb: locData[i][0], xuong: locData[i][1], khu_vuc: locData[i][2] };
    }
  }
  return {status: "error"};
}

function reportBrokenQR(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Master_ViTri");
  var locData = sheet.getDataRange().getValues();
  for(var i=1; i<locData.length; i++) {
    if(locData[i][0].toString().toUpperCase() === e.parameter.id.toUpperCase()) {
      sheet.getRange(i+1, 5).setValue("TRUE"); SpreadsheetApp.flush();
      return {status: "success"};
    }
  }
  return {status: "error"};
}

function handleLogAction(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Log_KiemTra");
  var logData = sheet.getDataRange().getValues();
  if (data.action === "deleteLog") {
    if (data.role !== "ADMIN") throw new Error("ADMIN ONLY");
    for(var i=1; i<logData.length; i++) {
      if(new Date(logData[i][0]).getTime() === new Date(data.thoiGian).getTime() && logData[i][3].toString().toUpperCase() === data.maTB.toUpperCase()) {
        logActivity(data.maNV, "DELETE_LOG", logData[i].join(" | "), "DELETED");
        sheet.deleteRow(i + 1); SpreadsheetApp.flush();
        return {status: "success"};
      }
    }
  }
  if (data.action === "editLog") {
    for(var i=1; i<logData.length; i++) {
      if(new Date(logData[i][0]).getTime() === new Date(data.thoiGian).getTime() && logData[i][3].toString().toUpperCase() === data.maTB.toUpperCase()) {
        var old = logData[i].join(" | ");
        sheet.getRange(i+1, 5).setValue(data.ngoaiQuan);
        sheet.getRange(i+1, 6).setValue(data.apSuat);
        sheet.getRange(i+1, 7).setValue(data.hanSD);
        sheet.getRange(i+1, 8).setValue(data.ghiChu);
        logActivity(data.maNV, "EDIT_LOG", old, data.ngoaiQuan + " | " + data.apSuat + " | " + data.hanSD);
        SpreadsheetApp.flush();
        return {status: "success"};
      }
    }
  }
  if (data.action === "sendEmails") {
    MailApp.sendEmail({ to: data.to, cc: data.cc, subject: data.subject, htmlBody: data.body });
    return {status: "success"};
  }
  return {status: "error"};
}

function doOptions(e) { return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT); }
