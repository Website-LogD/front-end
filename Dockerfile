# Base image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (Vite default is 5173)
EXPOSE 5173

# Run the application in development mode
# Note: We append -- --host to expose Vite to the network
CMD ["npm", "run", "dev", "--", "--host"]
