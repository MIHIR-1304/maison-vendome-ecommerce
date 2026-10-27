FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY services/user-service services/user-service
COPY services/product-service services/product-service
COPY services/cart-service services/cart-service
COPY services/order-service services/order-service
COPY services/payment-service services/payment-service
COPY services/notification-service services/notification-service
RUN mvn clean package -pl services/product-service -am -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/services/product-service/target/product-service-*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
