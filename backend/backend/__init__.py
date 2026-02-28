import pymysql

# Use PyMySQL as MySQLdb (Django 4.2 accepts mysqlclient >= 1.4.0; PyMySQL works without version patch).
pymysql.install_as_MySQLdb()
