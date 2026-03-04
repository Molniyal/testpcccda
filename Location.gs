function getLocationsList(role, xuongQL) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var locData = ss.getSheetByName("Master_ViTri").getDataRange().getValues();
  var locations = [];
  for(var i=1; i<locData.length; i++) {
    if(role === "ADMIN" || (role === "MANAGER" && locData[i][1] === xuongQL)) {
      locations.push({ 
        ma_tb: locData[i][0].toString().toUpperCase(), 
        xuong: locData[i][1], 
        khu_vuc: locData[i][2], 
        email: locData[i][3], 
        qr_broken: locData[i][4] === true || locData[i][4].toString().toUpperCase() === "TRUE" 
      });
    }
  }
  return locations;
}

function handleLocationAction(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Master_ViTri");
  var locData = sheet.getDataRange().getValues();
  
  if (data.action === "deleteLocation") {
    if (data.role !== "ADMIN") throw new Error("ACCESS DENIED: ADMIN ONLY.");
    for(var i=1; i<locData.length; i++) {
      if(locData[i][0].toString().toUpperCase() === data.maTB.toUpperCase()) {
        logActivity(data.maNV, "DELETE_LOC", locData[i].join(" | "), "DELETED");
        sheet.deleteRow(i + 1); SpreadsheetApp.flush();
        return {status: "success"};
      }
    }
  }
  
  if (data.action === "addLocation") {
    sheet.appendRow([data.maTB.toUpperCase(), data.xuong, data.khuVuc, data.email, "FALSE"]);
    logActivity(data.maNV, "ADD_LOC", "NEW", data.maTB + " | " + data.xuong);
    SpreadsheetApp.flush();
    return {status: "success"};
  }

  if (data.action === "editLocation") {
    for(var i=1; i<locData.length; i++) {
      if(locData[i][0].toString().toUpperCase() === data.maTB.toUpperCase()) {
        var old = locData[i].join(" | ");
        sheet.getRange(i+1, 2).setValue(data.xuong);
        sheet.getRange(i+1, 3).setValue(data.khuVuc);
        logActivity(data.maNV, "EDIT_LOC", old, data.xuong + " | " + data.khuVuc);
        SpreadsheetApp.flush();
        return {status: "success"};
      }
    }
  }
  return {status: "error"};
}
