# Use a Node.js base image with a specified version
FROM node:latest

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Expose the port on which the NestJS app is running
EXPOSE 3000

# Define the command to start both NestJS and Redis
CMD ["npm", "run", "start:prod"]
