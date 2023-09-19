# Start with the official Node.js image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Now copy all other files
COPY . .

# Install dependencies
RUN npm install --production

# Run the app
CMD ["npm", "run", "dev"]
