FROM node:18-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine as runtime
LABEL org.opencontainers.image.source="https://github.com/sirius-pro-tests/backend"
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
CMD [ "npm", "run", "start:migrate:prod" ]
