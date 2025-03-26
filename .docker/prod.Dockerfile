FROM node:22.13.0

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies without reinstalling yarn
RUN yarn install

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p src data

# Run the AWS exports setup (as mentioned in README for non-AWS auth)
RUN yarn predev:cognito:ci

# Generate and seed the database
RUN yarn db:seed

# Build the frontend
RUN yarn build

# Expose both frontend and backend ports
EXPOSE 3000 3001

# Start both frontend and backend
CMD ["sh", "-c", "npx serve -s build -l 3000 & yarn start:api"]