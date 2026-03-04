# 🛡️ Hệ Thống Quản Lý PCCC ERP Pro (V2.0)

[![Status](https://img.shields.io/badge/Status-Hoạt%20động-success.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Google%20Apps%20Script%20%2B%20Web-blue.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

Hệ thống quản lý thiết bị Phòng cháy chữa cháy (PCCC) chuyên nghiệp, tích hợp QR Code, báo cáo sự cố tức thời qua Email và Zalo, cùng Dashboard phân tích dữ liệu trực quan. Được xây dựng trên nền tảng **Google Sheets** (Backend) và **Web/Mobile** (Frontend).

## ✨ Tính Năng Nổi Bật

*   **📊 Dashboard Thông Minh:** Biểu đồ tỷ lệ hoàn thành theo xưởng, cảnh báo bảo trì và thống kê lỗi thời gian thực (Glassmorphism 2.0).
*   **📱 App Quét Mã (PWA):** Nhân viên dùng điện thoại quét QR trên bình chữa cháy để kiểm tra. Hỗ trợ chụp ảnh minh chứng tại hiện trường.
*   **📂 Quản Lý ERP:** Phân quyền người dùng (Admin, Manager, User). Quản lý hàng nghìn thiết bị với tính năng phân trang (Pagination).
*   **📧 Thông Báo Tự Động:** Tự động gửi Email/Zalo cho quản lý xưởng ngay khi phát hiện lỗi (Áp suất thấp, Hết hạn, Hỏng hóc).
*   **🖨️ In Tem QR Chuyên Nghiệp:** Xuất file in tem QR chuẩn A4 cho thiết bị với đầy đủ thông tin mã, xưởng, khu vực.
*   **🕵️ Nhật Ký Kiểm Toán (Audit Log):** Ghi lại mọi hành động Thêm/Sửa/Xóa dữ liệu để đảm bảo tính minh bạch.

## 🛠️ Công Nghệ Sử Dụng

*   **Frontend:** HTML5, CSS3 (Vanilla), Javascript (ES6), Lucide Icons, Chart.js.
*   **Backend:** Google Apps Script (GAS).
*   **Database:** Google Sheets.
*   **Hosting:** GitHub Pages.

## 🚀 Hướng Dẫn Cài Đặt

### 1. Thiết Lập Backend (Google Sheets)
1.  Tạo một Google Sheet mới.
2.  Mở **Tiện ích mở rộng** -> **Apps Script**.
3.  Copy nội dung các file `.gs` và `.html` từ thư mục này vào dự án Apps Script:
    *   `Code.gs`, `Auth.gs`, `Location.gs`, `Reporting.gs`, `Audit.gs` (Chọn loại file **Script**)
    *   `UI_Styles.html`, `UI_Scripts.html`, `UI_Modals.html`, `UI_Views.html` (Chọn loại file **HTML**)
4.  Chạy hàm `setupPCCC()` một lần để khởi tạo các sheet dữ liệu.
5.  Nhấn **Triển khai** -> **Triển khai mới** -> **Ứng dụng web** (Quyền truy cập: **Mọi người**).
6.  **Copy URL Ứng dụng web** vừa nhận được.

### 2. Thiết Lập Frontend (GitHub Pages)
1.  Mở dự án trên GitHub và chỉnh sửa biến `SCRIPT_URL` trong các file: `index.html`, `scan.html`, `print.html`.
2.  Dán URL Apps Script của bạn vào đó.
3.  Cập nhật biến `DOMAIN` thành link GitHub Pages của bạn (ví dụ: `https://user.github.io/repo`).
4.  Bật **GitHub Pages** trong phần **Settings -> Pages**.

## 👥 Phân Quyền Người Dùng

*   **ADMIN:** Toàn quyền quản lý, xem Dashboard, xóa dữ liệu, cài đặt Email.
*   **MANAGER:** Xem dữ liệu và báo cáo tại Xưởng mình quản lý.
*   **USER:** Chỉ có quyền Quét mã và gửi báo cáo (không vào được Dashboard).

## 📄 Giấy Phép
Dự án được phát hành dưới giấy phép **MIT**. Bạn có quyền tự do chỉnh sửa và sử dụng cho mục đích cá nhân hoặc doanh nghiệp.

---
**Phát triển bởi [Tên của bạn] - 2024**
