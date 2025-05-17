# 빌드 스테이지
FROM node:22-alpine AS build

WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm install --production

# 소스 코드 복사
COPY src/ ./src/

# 런타임 스테이지 (최종 이미지)
FROM node:22-alpine AS runtime

WORKDIR /app

# 빌드 스테이지에서 필요한 파일만 복사
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY package.json ./

# 포트 설정 및 실행 명령
EXPOSE 3000
CMD ["npm", "start"]