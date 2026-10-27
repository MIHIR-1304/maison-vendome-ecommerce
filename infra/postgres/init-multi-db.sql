-- ====================================================================
-- PostgreSQL Multi-Database Initialization Script
-- Each stateful microservice owns its independent database.
-- ====================================================================

SELECT 'CREATE DATABASE ecommerce_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce_user')\gexec

SELECT 'CREATE DATABASE ecommerce_product'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce_product')\gexec

SELECT 'CREATE DATABASE ecommerce_cart'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce_cart')\gexec

SELECT 'CREATE DATABASE ecommerce_order'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce_order')\gexec

SELECT 'CREATE DATABASE ecommerce_payment'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce_payment')\gexec

SELECT 'CREATE DATABASE ecommerce_notification'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce_notification')\gexec
