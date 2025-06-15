# Sử dụng image node phiên bản mới nhất với tag slim để giảm kích thước
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install --force

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng React
RUN npm run build

# Cài đặt server tĩnh để phục vụ ứng dụng
RUN npm install -g serve

# Mở port 3001
EXPOSE 3001

# Lệnh chạy ứng dụng
CMD ["serve", "-s", "build", "-l", "3001"]