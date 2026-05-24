# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Pass environment variables as build arguments for Vite compilation
ARG VITE_API_ENDPOINT
ARG VITE_LABEL_SYSTEM_SECURED
ARG VITE_LABEL_ENTER_PASSCODE

ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT
ENV VITE_LABEL_SYSTEM_SECURED=$VITE_LABEL_SYSTEM_SECURED
ENV VITE_LABEL_ENTER_PASSCODE=$VITE_LABEL_ENTER_PASSCODE

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
