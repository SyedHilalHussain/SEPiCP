"""Use PyMySQL as the MySQLdb driver (no C compiler needed on Windows)."""
import pymysql

pymysql.install_as_MySQLdb()
