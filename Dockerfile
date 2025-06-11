# Gunakan Node.js LTS versi terbaru
FROM node:18

# Set folder kerja dalam container
WORKDIR /app

# Salin file project ke container
COPY . .

# Install dependencies
RUN npm install

# Jalankan aplikasi
CMD ["node", "index.js"]

# Buka port default server
EXPOSE 5000
