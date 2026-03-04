function setupPCCC() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  checkOrCreateSheet(ss, "DanhSachNV", ["Mã NV", "Tên Nhân Viên", "Quyền", "Xưởng Quản Lý", "Mật khẩu"], [["ADMIN", "Ban Giám Đốc", "ADMIN", "ALL", "admin123"]]);
  checkOrCreateSheet(ss, "Master_ViTri", ["Mã Thiết Bị", "Xưởng", "Khu Vực", "Email Quản Lý", "QR Hỏng"]);
  checkOrCreateSheet(ss, "Log_KiemTra", ["Thời gian", "Mã NV", "Tên NV", "Mã Thiết Bị", "Ngoại quan", "Áp suất", "Hạn SD", "Ghi chú", "Link Ảnh"]);
  checkOrCreateSheet(ss, "CaiDat_Email", ["Tên Mẫu", "Gửi Đến (TO)", "Đồng Kính Gửi (CC)", "Tiêu Đề", "Nội Dung HTML"], [
    ["Mẫu 1: Cảnh báo Lỗi Đơn lẻ", "hse@congty.com", "giamdoc@congty.com, safety@congty.com", "[CẨN CẤP] Báo cáo Lỗi Thiết bị PCCC", "Phát hiện lỗi tại bình <b>[MA_TB]</b> (Xưởng: [XUONG]).<br>Ghi chú lỗi: <span style='color:red;'>[GHI_CHU]</span>"],
    ["Mẫu 2: Báo cáo Tổng hợp (Bảng)", "giamdoc@congty.com", "hse@congty.com", "[BÁO CÁO] Tổng hợp tình trạng PCCC", "Kính gửi Ban Giám Đốc,<br>Dưới đây là báo cáo tổng hợp:<br><br>[BANG_BAO_CAO]<br><br>Trân trọng."]
  ]);
  checkOrCreateSheet(ss, "Audit_Log", ["Thời gian", "Nhân viên", "Hành động", "Nội dung cũ", "Nội dung mới"]);
}

function checkOrCreateSheet(ss, name, headers, defaultData) {
  if (!ss.getSheetByName(name)) {
    var sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    if (defaultData) defaultData.forEach(row => sheet.appendRow(row));
  }
}

function logActivity(maNV, action, oldVal, newVal) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sAudit = ss.getSheetByName("Audit_Log") || ss.insertSheet("Audit_Log");
  sAudit.appendRow([new Date(), maNV, action, oldVal, newVal]);
}
