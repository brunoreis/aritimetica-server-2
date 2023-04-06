# Use an official Node.js runtime as a parent image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Set the environment variables
ENV NODE_ENV=development
ENV PORT=4000

# Expose the application port
EXPOSE $PORT

# Start the application
CMD ["yarn", "dev"]
