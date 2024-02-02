FROM node:20-alpine AS Builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS Runtime
ENV PORT=3000
WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]