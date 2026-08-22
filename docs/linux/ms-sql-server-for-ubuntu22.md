---
sidebar_position: 4
description: Install and configure MS SQL Server 2022 on an Ubuntu 22 Server environment.
---

# MS SQL Server in Linux (Ubuntu 22 Server)

This document is a guide on how to deploy an MS SQL Server instance on a Linux environment.

This guide mainly focuses on installing MS SQL Server 2022 on Ubuntu 22 Server, as these are among the most stable and well-tested versions today.

## 1. Install MS SQL Server

### 1.1 Setup Repository

Download the public key, convert it from ASCII to GPG format, and write it to the required location:

```bash
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg
```

If you receive a warning about the public key not being available, use the following command instead:

```bash
curl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc
```

Download and register the SQL Server Ubuntu repository:

```bash
curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list
```

### 1.2 Installation

Use the package manager to install MS SQL Server:

```bash
sudo apt update
sudo apt install -y mssql-server
```

### 1.3 Configure SQL Server

Run the following command to enter the configuration wizard, select the edition to use (Enterprise, Developer, Express, etc.), and set up the *'sa'* account password:

```bash
sudo /opt/mssql/bin/mssql-conf setup
```

Once configuration is complete, verify that the service is running:

```bash
systemctl status mssql-server --no-pager
```

## 2. Enable Remote Access

To allow SQL Server to accept remote connections, you need to update the SQL Server config.

Open the config file:

```bash
sudo nano /var/opt/mssql/mssql.conf
```

Add the following lines to enable TCP/IP access:

```ini
[network]
tcpip = true
```

Restart SQL Server for the change to take effect:

```bash
sudo systemctl restart mssql-server
```

**!!! Important**
> Remember to update the UFW rules to allow port `1433` if UFW is enabled on the server, and also allow port `1433` from the VPS management console in your service provider if applicable.

```bash
sudo ufw allow 1433/tcp
```

With the steps above, SQL Server is now available for remote access.

## 3. Configure Accounts

Using the **'sa'** account without disabling it is a security risk, since ***'sa'*** is the SQL Server's universal default admin account. This section covers creating a new admin account and disabling the ***'sa'*** account.

Connect to SQL Server using a database management application (SSMS, DBeaver, DataGrip, etc.), or the `sqlcmd` command-line tool:

```bash
sqlcmd -S localhost -U sa -P '<sa password>'
```

Use the `master` database and the following query to create a new admin account:

```sql
USE master;

CREATE LOGIN <new_admin_username> WITH PASSWORD = '<strong password>';

ALTER SERVER ROLE sysadmin ADD MEMBER <new_admin_username>;
```

Now log in to SQL Server using the new admin account and disable the ***'sa'*** account:

```sql
USE master;

ALTER LOGIN sa DISABLE;
```

## 4. Install SQL Server Command-Line Tools (Optional)

The `sqlcmd` and `bcp` utilities used above are not installed by default. Install them with:

```bash
sudo apt install -y mssql-tools18 unixodbc-dev
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc
source ~/.bashrc
```

*Use the `-C` flag with `sqlcmd` (e.g. `sqlcmd -S localhost -U sa -P '<password>' -C`) to trust the self-signed server certificate when connecting locally.*
