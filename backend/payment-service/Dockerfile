FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY payment-service/pom.xml payment-service/
RUN mvn dependency:go-offline -pl payment-service -am 2>/dev/null || true
COPY payment-service/src payment-service/src
RUN mvn package -pl payment-service -am -DskipTests -q

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/payment-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
