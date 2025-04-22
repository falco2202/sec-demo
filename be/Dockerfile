FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

COPY . .

# Create a modified server.js that uses environment variables
RUN sed -i "s|origin: 'http://localhost:3000'|origin: process.env.FRONTEND_URL|g" server.js

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "server.js"]