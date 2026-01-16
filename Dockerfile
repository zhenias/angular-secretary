FROM node:18-alpine

RUN npm install -g @angular/cli @angular-devkit/build-angular

WORKDIR /app

COPY package*.json ./

RUN if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/ng" ]; then \
  echo "Installing dependencies..." && \
  npm ci; \
  fi

EXPOSE 4200

# Komenda startowa
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "1000", "--disable-host-check"]
