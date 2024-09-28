# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile TypeScript files to JavaScript
RUN npm run build

# Expose the application port
EXPOSE 8199

# Run the compiled JavaScript file
CMD ["node", "dist/server.js"]
