FROM php:8.2-apache

# PostgreSQL-Erweiterungen für PDO installieren
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Apache mod_rewrite aktivieren (für SPA Routing)
RUN a2enmod rewrite

# DocumentRoot sicher auf /public setzen, damit /api und /app nicht direkt erreichbar sind
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html
