FROM node:20-alpine AS frontend-build

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=/api/v1
RUN npm run build

FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /backend
COPY backend/pom.xml ./
COPY backend/src ./src
COPY --from=frontend-build /frontend/out/ ./src/main/resources/static/
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=backend-build /backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
ENV SPRING_PROFILES_ACTIVE=production
EXPOSE 8080

CMD ["sh", "-c", "exec java -jar /app/app.jar --server.port=${PORT:-8080}"]
