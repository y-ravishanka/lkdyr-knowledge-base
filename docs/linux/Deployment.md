---
sidebar_position: 1
---

# Deployment

Deploy an application to a Linux Environment. This is a issue and a lesson every software engineer have to face at a one point of his career. So, in this tutorial let's discuss how to deploy an application to a Linux environment. 

As the Linux environment I will be using `Ubuntu 22`, and for deployment I will be using `NGINX` and `PM2`. as those are one of the best, stable and tested deployment platforms.

## 1. Install and Configure NGINX

### 1. Install NGINX

First of all let's install NGINX. Use following command to install the nginx.
```
sudo apt install nginx
```
*for more detail installation introductions, please visit [here](https://nginx.org/en/linux_packages.html).*

Now lets't check if NGINX is running correctly using the following command.
```
sudo systemctl status nginx
```

### 2. Configure NGINX for the site.

Now lets't configure NGINX to redirect request you get to your server to the application. First of all you have to create a configuration file for nginx. even through you can edit the default nginx config but its recommended to create a new config file for each application so, configs and sites can be maintain correctly.






