FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY user-service/pom.xml user-service/
RUN mvn dependency:go-offline -pl user-service -am 2>/dev/null || true
COPY user-service/src user-service/src
RUN mvn package -pl user-service -am -DskipTests -q

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/user-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
