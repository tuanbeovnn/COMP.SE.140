# First stage: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package

# Second stage: Package the application into the final image
FROM openjdk:17-slim

# Install procps for the ps command
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

# Copy the jar file from the build stage
COPY --from=build /app/target/*.jar service2.jar

# Expose the port the application runs on
EXPOSE 8080

# Define the entrypoint to run the service
ENTRYPOINT ["java", "-jar", "service2.jar"]
