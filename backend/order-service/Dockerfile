FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY order-service/pom.xml order-service/
RUN mvn dependency:go-offline -pl order-service -am 2>/dev/null || true
COPY order-service/src order-service/src
RUN mvn package -pl order-service -am -DskipTests -q

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/order-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
