function checkAuth(maNV, matKhau) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var users = ss.getSheetByName("DanhSachNV").getDataRange().getValues();
  for(var i=1; i<users.length; i++) {
    if(users[i][0].toString().toUpperCase() === maNV.toUpperCase()) { 
      if(users[i][4] && users[i][4].toString() === matKhau) {
        return {
          match: true,
          tenNV: users[i][1],
          role: users[i][2].toString().toUpperCase(),
          xuongQL: users[i][3]
        };
      }
    }
  }
  return { match: false };
}

function getEmployeeInfo(maNV) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sNV = ss.getSheetByName("DanhSachNV").getDataRange().getValues();
  for (var i = 1; i < sNV.length; i++) {
    if (sNV[i][0].toString().trim().toUpperCase() === maNV.toUpperCase()) {
      return { status: "success", name: sNV[i][1], role: sNV[i][2] || "USER" };
    }
  }
  return { status: "error" };
}
