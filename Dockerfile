# Stage 1: Build
FROM node:17-alpine as build-image
WORKDIR /usr/src/app

# Copy project files
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src

# Install dependencies and build
RUN npm ci && npx tsc && npm cache clean --force

# Stage 2: Production
FROM node:17-alpine
WORKDIR /usr/src/app

# Copy from build-image
COPY package*.json ./
COPY --from=build-image /usr/src/app/dist ./dist

# Install production dependencies and clean cache
RUN npm ci --production && npm cache clean --force

# Copy remaining project files
COPY . .

# Expose port and set start command
EXPOSE 8080
CMD [ "node", "dist/application.js" ]