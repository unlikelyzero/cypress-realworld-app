FROM node:22.13.0

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies without reinstalling yarn
RUN yarn install

# Copy the rest of the application
COPY . .

# Create src directory if it doesn't exist
RUN mkdir -p src

# Run the AWS exports setup (as mentioned in README for non-AWS auth)
RUN yarn predev:cognito:ci

# Build the frontend
EXPOSE 3000

CMD ["yarn", "start:react"]