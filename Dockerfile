# Start with the official Node.js image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy the project’s package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production 

# Add rest of the application code
COPY . .

# Run the app
CMD ["npm", "run", "dev"]
