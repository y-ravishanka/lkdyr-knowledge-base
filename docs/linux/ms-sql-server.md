---
sidebar_position: 2
---

# MS SQL Server in Linux

This document is a guide to how to deploy a MS SQL Server instance on a Linux environment.

*this document mainly focus on installing MS SQL Server 2022 on Ubuntu 22 server. as those two are one of the most stable and tested servers today.*

## Install MS SQL Server

### 1. Setup Repository

Download the public key, convert from ASCII to GPG format, and write it to the required location :
```
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg
```
If you receive a warning about the public key not being available, you can use the following command instead :
```
curl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc
```

Download and register the SQL Server Ubuntu repository :
```
curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list
```

### 2. Installation

Use package manager to install MS SQL Server
```
sudo apt update
sudo apt install mssql-server
```

### 3. Configure SQL Server

From following command enter to configuration and select the edition to use (Enterprise, Developer, Express, etc.) and setup *'sa'* account password.
```
sudo /opt/mssql/bin/mssql-conf setup
```

### 4. Enable Remote Access

To enable remote access to SQL Server you have to access SQL Server configs. Follow the following step to enable remote access.

Open config file
```
sudo nano /var/opt/mssql/mssql.conf
```

Add rule to enable remote access. *add following lines to config file*
```
[network]
tcpip = true
```
**!!! Important**
>*remember to edit UFW rules and add 1433 port if server UFW is enabled. and also to allow 1433 port from VPS manage console in service provider if available.*

with following above steps SQL Server is now available to remote access.

### 5. Configure Accounts

Using and not disabling **'sa'** account is a security risk, as ***'sa'*** is the SQL Server universal default admin account. In this topic lets see how to create a new admin account and disable ***'sa'*** account.

Connect to SQL Server using a Database Management application (SSMS, DBeaver, DataGrip, etc.)

Use *master* database and the following query to create a new admin account.
```
USE master;

CREATE LOGIN <new admin user name> WITH PASSWORD = '<strong password>';

ALTER SERVER ROLE sysadmin ADD MEMBER <new admin user name>;
```

Now login to SQL Server using new admin user and disable the ***'sa'*** account.
```
USE master;

ALTER LOGIN sa DISABLE;
``` 

