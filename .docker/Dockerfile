FROM node:22.13.0

WORKDIR /app

# Copy package files first
COPY package.json yarn.lock ./

# Install dependencies without reinstalling yarn
RUN yarn

# Copy the rest of the project files
COPY . .

# Ensure .env file exists with default values if not present
RUN if [ ! -f .env ]; then \
    echo "SEED_DEFAULT_USER_PASSWORD=s3cret" > .env && \
    echo "PAGINATION_PAGE_SIZE=10" >> .env && \
    echo "PORT=3000" >> .env && \
    echo "VITE_BACKEND_PORT=3001" >> .env && \
    echo "HOST=0.0.0.0" >> .env && \
    echo "REACT_APP_BACKEND_URL=http://localhost:3001" >> .env; \
    fi

# Expose both frontend and backend ports
EXPOSE 3000 3001

# Start both frontend and backend
CMD ["sh", "-c", "yarn dev"]