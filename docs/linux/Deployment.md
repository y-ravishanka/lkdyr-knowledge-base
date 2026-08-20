---
sidebar_position: 1
---

# Deployment

Deploying an application to a Linux environment is a task every software engineer has to face at some point in their career. In this tutorial, let's discuss how to deploy an application to a Linux environment.

As the Linux environment, we'll be using `Ubuntu 22`, and for deployment we'll be using `NGINX` and `PM2`, as these are among the most stable and well-tested deployment tools.

## 1. Install and Configure NGINX

### 1.1 Install NGINX

First, let's install NGINX using the following command:

```bash
sudo apt install nginx
```

*For more detailed installation instructions, please visit [here](https://nginx.org/en/linux_packages.html).*

Now let's check if NGINX is running correctly:

```bash
sudo systemctl status nginx
```

### 1.2 Configure NGINX for the Site

Now let's configure NGINX to forward requests to your application. Although you can edit the default NGINX config, it's recommended to create a new config file for each application so configs and sites can be maintained correctly.

Create the NGINX site config file:

```bash
sudo nano /etc/nginx/sites-available/app.example.com
```

Edit the config file:

```nginx
server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://127.0.0.1:<port>;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

*Make sure your application is running on `http://127.0.0.1:<port>`.*

Enable the config file:

```bash
sudo ln -s /etc/nginx/sites-available/app.example.com /etc/nginx/sites-enabled/
```

Test the NGINX config:

```bash
sudo nginx -t
```

Reload the NGINX config:

```bash
sudo systemctl reload nginx
```
