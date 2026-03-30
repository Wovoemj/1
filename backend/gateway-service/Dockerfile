FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY gateway-service/pom.xml gateway-service/
COPY user-service/pom.xml user-service/
COPY product-service/pom.xml product-service/
COPY order-service/pom.xml order-service/
COPY payment-service/pom.xml payment-service/
COPY recommend-service/pom.xml recommend-service/
COPY notification-service/pom.xml notification-service/
RUN mvn dependency:go-offline -pl gateway-service -am

COPY gateway-service/src gateway-service/src
RUN mvn package -pl gateway-service -am -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/gateway-service/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
