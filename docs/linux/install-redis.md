---
sidebar_position: 3
description: Install and configure Redis, then expose it securely over TLS for remote access via NGINX.
---

# Install Redis Server

This document is a guide on how to install and configure a Redis server on a Linux environment, and expose it securely over TLS for remote access via Nginx.

## 1. Install Redis Server

Install Redis using the package manager:

```bash
sudo apt install redis-server
```

Validate the installation:

```bash
redis-server --version
```

## 2. Configure Redis

Open the Redis configuration file:

```bash
sudo nano /etc/redis/redis.conf
```

Lock the server down to local connections only and enable a password (remote access is set up securely later using Nginx and SSL):

```ini
# /etc/redis/redis.conf

# access localhost only
bind 127.0.0.1 -::1

protected-mode yes

# enable instance password
requirepass <YourStrongPasswordHere>
```

Restart Redis to load the new configuration:

```bash
sudo systemctl restart redis-server
```

**!!! Important**
> Remember to update the UFW rules to allow the Redis port if UFW is enabled on the server, and also allow the port from the VPS management console in your service provider if applicable.

```bash
sudo ufw allow 6380/tcp
```

## 3. Expose Redis Remotely via Nginx

Redis has no native TLS support, so Nginx is used as a TLS-terminating proxy in front of it. Install Nginx (see [Deployment](./Deployment.md) for more general Nginx setup information).

### 3.1 Create an Nginx Site and Obtain an SSL Certificate

Create an Nginx site config for the Redis domain:

```bash
sudo nano /etc/nginx/sites-available/redis.yourdomain.com
```

```nginx
server {
    listen 80;
    server_name redis.yourdomain.com;
}
```

Enable the site and issue an SSL certificate with Certbot:

```bash
sudo ln -s /etc/nginx/sites-available/redis.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d redis.yourdomain.com
```

### 3.2 Enable the Nginx Stream Module

TLS-terminated TCP proxying (as opposed to HTTP) requires the Nginx `stream` module. Check whether it is already available:

```bash
nginx -V 2>&1 | grep -o with-stream
```

If the module is not found, install the full Nginx build:

```bash
sudo apt install nginx-full
```

### 3.3 Add a Stream Block for TLS-Terminated Redis

The stream block must sit at the top level of the Nginx config, outside the `http {}` block and outside `sites-available`:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add the following at the bottom, outside the `http { ... }` block:

```nginx
stream {
    upstream redis_backend {
        server 127.0.0.1:6379;
    }

    server {
        listen 6380 ssl;
        proxy_pass redis_backend;

        ssl_certificate     /etc/letsencrypt/live/redis.yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/redis.yourdomain.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
    }
}
```

Reload Nginx to apply the changes:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 3.4 Configure Certbot Renewal Hook

Certbot's systemd timer auto-renews the certificate, but Nginx needs a reload after renewal to pick up the new files. Create a deploy hook:

```bash
sudo nano /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh
```

```bash
#!/bin/bash
systemctl reload nginx
```

Make the hook executable:

```bash
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh
```

## 4. Connect to Redis from C#

Once the TLS proxy is in place, connect to Redis remotely using `StackExchange.Redis`:

```csharp
return ConnectionMultiplexer.Connect("redis.yourdomain.com:6380,password=YourStrongPasswordHere,ssl=true,sslProtocols=Tls12");
```
