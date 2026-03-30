FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY recommend-service/pom.xml recommend-service/
RUN mvn dependency:go-offline -pl recommend-service -am 2>/dev/null || true
COPY recommend-service/src recommend-service/src
RUN mvn package -pl recommend-service -am -DskipTests -q

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/recommend-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
