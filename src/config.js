'use strict';
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postgresql://zol@localhost/forum',
  JWT_SECRET: process.env.JWT_SECRET || 'my-own-special-jwt-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3600s',
};