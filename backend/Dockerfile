FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /backend
COPY pom.xml ./
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
ENV SPRING_PROFILES_ACTIVE=production
EXPOSE 8080

CMD ["sh", "-c", "exec java -jar /app/app.jar --server.port=${PORT:-8080}"]
