FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Landing build args (URL references for CTA links)
ARG VITE_BASE_PATH
ARG VITE_APP_URL
ARG VITE_API_URL
RUN VITE_BASE_PATH=${VITE_BASE_PATH} VITE_APP_URL=${VITE_APP_URL} VITE_API_URL=${VITE_API_URL} npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
