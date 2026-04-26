FROM php:8.2-apache

# PostgreSQL-Erweiterungen für PDO installieren
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Apache mod_rewrite aktivieren (für SPA Routing)
RUN a2enmod rewrite

# DocumentRoot sicher auf /public setzen
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html

# Den gesamten Quellcode fest in das Image kopieren
COPY . /var/www/html

# Sicherstellen, dass Apache Überschreibungen (htaccess) erlaubt und Zugriff gewährt.
# WICHTIG: Einen Alias für /api setzen, damit das Routing von /api nicht ins Leere (ins public-Verzeichnis) läuft!
RUN echo '<Directory "/var/www/html/public">\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    </Directory>\n\
    Alias /api /var/www/html/api\n\
    <Directory "/var/www/html/api">\n\
    AllowOverride All\n\
    Require all granted\n\
    </Directory>' >> /etc/apache2/apache2.conf

# Berechtigungen beim Build setzen
RUN chown -R www-data:www-data /var/www/html
