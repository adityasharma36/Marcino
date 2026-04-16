# Project Title

## Introduction

This project consists of three microservices, namely User, Product, and Cart microservices.

## Overview

| Microservice | Description         |
|--------------|---------------------|
| User         | Manages user data   |
| Product      | Handles product info |
| Cart         | Manages shopping cart operations |

## Features

- **User Microservice:**
  - User management (registration, login)

- **Product Microservice:**
  - Product listing and detail views

- **Cart Microservice:**
  - Add to cart
  - Remove from cart
  - Checkout

## Project Structure

```
/Rusty-Project
|-- /user
|-- /product
|-- /cart
```

## Installation and Configuration

To set up the project, clone the repository and run:

```bash
npm install
```

You also need to set up the Cart microservice on port 3002.

## Running Services

You can run the services by executing:

```bash
npm start
```

Make sure to start the Cart microservice on port 3002.

## API Reference

- **Cart API Endpoints:**
  - `POST /cart` - Add to cart
  - `DELETE /cart/{item_id}` - Remove item from cart
  - `GET /cart` - Get cart contents

