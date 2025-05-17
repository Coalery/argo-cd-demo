FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src/ ./src/

FROM node:22-alpine AS runtime

LABEL org.opencontainers.image.source=https://github.com/Coalery/argo-cd-demo

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY package.json ./

EXPOSE 3000
CMD ["npm", "start"]