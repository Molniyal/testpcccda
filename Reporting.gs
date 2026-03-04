function getLogsList(locations) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logData = ss.getSheetByName("Log_KiemTra").getDataRange().getValues();
  var logs = [];
  for(var i=logData.length-1; i>=1; i--) {
    var tbInLog = logData[i][3].toString().toUpperCase();
    var isAllowed = locations.some(function(l) { return l.ma_tb === tbInLog; });
    if (isAllowed) {
      logs.push({ 
        thoi_gian: logData[i][0], 
        ma_nv: logData[i][1], 
        ten_nv: logData[i][2], 
        ma_tb: logData[i][3], 
        ngoai_quan: logData[i][4], 
        ap_suat: logData[i][5], 
        han_sd: logData[i][6], 
        ghi_chu: logData[i][7], 
        link_anh: logData[i][8] 
      });
    }
  }
  return logs;
}

function submitReport(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sLog = ss.getSheetByName("Log_KiemTra");
  var tenNV = "Unknown";
  var sNV = ss.getSheetByName("DanhSachNV").getDataRange().getValues();
  for(var i=1; i<sNV.length; i++) { if(sNV[i][0].toString().toUpperCase() === data.maNV.toUpperCase()) { tenNV = sNV[i][1]; break; } }
  
  var isFailure = (data.ngoaiQuan === "Lỗi" || data.apSuat === "Lỗi" || data.hanSD === "Hết hạn");
  sLog.appendRow([new Date(), data.maNV.toUpperCase(), tenNV, data.maTB.toUpperCase(), data.ngoaiQuan, data.apSuat, data.hanSD, data.ghi_chu || data.ghiChu, data.linkAnh]);
  SpreadsheetApp.flush(); 

  // Reset broken QR
  var sMaster = ss.getSheetByName("Master_ViTri");
  var locData = sMaster.getDataRange().getValues();
  var managerEmail = ""; var xuong = "";
  for(var i=1; i<locData.length; i++) {
    if(locData[i][0].toString().toUpperCase() === data.maTB.toUpperCase()) {
      sMaster.getRange(i+1, 5).setValue("FALSE");
      managerEmail = locData[i][3];
      xuong = locData[i][1];
      break;
    }
  }

  if (isFailure && managerEmail) {
    sendFailureEmail(managerEmail, data, xuong);
  }

  return {status: "success", isFailure: isFailure};
}

function sendFailureEmail(managerEmail, data, xuong) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sMail = ss.getSheetByName("CaiDat_Email");
  var ccEmails = (sMail && sMail.getLastRow() > 1) ? sMail.getRange(2, 3).getValue() : "";

  var subject = "[CẨNH BÁO] Phát hiện sự cố PCCC tại " + data.maTB;
  var body = "<h3>Phát hiện sự cố PCCC!</h3>" +
             "<p><b>Vị trí:</b> " + data.maTB + " (Xưởng: " + xuong + ")</p>" +
             "<p><b>Trạng thái:</b> <span style='color:red;'>CÓ LỖI</span></p>" +
             "<p><b>Chi tiết:</b></p><ul>" +
             "<li>Ngoại quan: " + data.ngoaiQuan + "</li>" +
             "<li>Áp suất: " + data.apSuat + "</li>" +
             "<li>Hạn SD: " + data.hanSD + "</li></ul>" +
             "<p><b>Ghi chú:</b> " + (data.ghiChu || "N/A") + "</p>" +
             "<p><b>Ảnh hiện trường:</b> <a href='" + data.linkAnh + "'>Xem ảnh</a></p>" +
             "<hr><p><i>Email này được gửi tự động từ hệ thống PCCC Pro.</i></p>";
  
  MailApp.sendEmail({ to: managerEmail, cc: ccEmails, subject: subject, htmlBody: body });
}
