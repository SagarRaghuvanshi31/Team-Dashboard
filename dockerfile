# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
#COPY package.json package-lock.json ./

# Install dependencies
#RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
#RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
