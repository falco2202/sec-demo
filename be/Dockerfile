FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "server.js"]