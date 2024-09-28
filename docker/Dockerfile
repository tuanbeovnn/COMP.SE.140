# Use the OpenJDK 17 slim image
FROM openjdk:17-slim

# Install procps for the ps command
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*


# Define build argument and copy the JAR file
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} service2.jar

# Expose the port the application runs on
EXPOSE 8080

# Define the entrypoint to run the service
ENTRYPOINT ["java", "-jar", "service2.jar"]
