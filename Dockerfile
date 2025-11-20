FROM nginx:alpine

# Копируем весь фронт внутрь nginx
COPY . /usr/share/nginx/html

# Копируем твой nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf