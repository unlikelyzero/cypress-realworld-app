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

# Generate and seed the database
RUN yarn db:seed

EXPOSE 3001

CMD ["yarn", "start:api"]