FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN npx prisma generate
RUN yarn build
COPY start.sh ./
RUN chmod +x start.sh
EXPOSE 3000
CMD ["./start.sh"]
