FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=5000
ENV DB_DRIVER=memory

EXPOSE 5000

CMD ["node", "src/app.js"]
