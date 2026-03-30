FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY product-service/pom.xml product-service/
RUN mvn dependency:go-offline -pl product-service -am 2>/dev/null || true
COPY product-service/src product-service/src
RUN mvn package -pl product-service -am -DskipTests -q

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/product-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
