Table of Contents for Pizza API
[Overview](#overview)
[Features](#features)
[Getting Started](#getting-started)
[Environment Variables](#environment-variables)
[Endpoints](#endpoints)
[Error Handling](#error-handling)
[Dependencies](#dependencies)
[License](#license)

---

## Overview

This is a simple RESTful API which provides a backend service for a pizza ordering system. The API reads from a JSON file and serves pizza details, including name, ingredients, price, image, and availability status.
It allows users to view the menu and place orders, handling data persistence and management. It is built with Node.js and Express and uses file-based storage for managing menu items and order data.

---

## Features

Menu Retrieval: Fetches the restaurant's menu items.
Order Creation: Places a new order with customer details and order specifics.
Order Retrieval: Fetches details of a specific order using the order ID.
File-based Storage: Reads and writes order data to a JSON file for persistence.

---

## Getting Started

    - Prerequisites
        - Node.js (v14 or later)
        - NPM (Node Package Manager)
    - Installation
        - Clone the repository:
            - bash
            - git clone https://github.com/bryt/pizza-api.git
            - cd pizza-api
    - Install dependencies:
        - bash
        - npm install
    - Start the server:
        - bash
        - node index.js (The server will be running on http://localhost:8080 by default.)

---

## Environment Variables

    - This API requires the following environment variables:
        - PORT: Port on which the server will listen (default is 8080).
        - JSON_FILE_PATH: Path to the menu JSON file.
        - ORDERS_FILE_PATH: Path to the orders JSON file.
    - Example .env file:
        - PORT=8080
        - JSON_FILE_PATH=./data/menu.json
        - ORDERS_FILE_PATH=./data/orders.json

---

## Endpoints

    - GET /api/menu
        - Retrieves the restaurant's menu items.
        - Request
            - http
            - GET /api/menu
        - Response
            - 200 OK: Returns the JSON object of the menu.
            - 500 Internal Server Error: If there is an issue reading or parsing the menu file.
        - Example Response:
            - json[{
                    "id": 1,
                    "name": "Margherita",
                    "price": 10
                    },
                    {
                    "id": 2,
                    "name": "Pepperoni",
                    "price": 12
                    }]

    - POST /api/order

        - Places a new order and generates a unique ID.
            - Request:
                - http
                - POST /api/order
                - Content-Type: application/json
            - Request Body:
                - json {
                    "customer": "Dan",
                    "phone": "+43 123 456 7890",
                    "address": "Graz, Austria",
                    "priority": true,
                    "cart": [
                        {
                            "pizzaId": 3,
                            "name": "Romana",
                            "quantity": 1,
                            "unitPrice": 15,
                            "totalPrice": 15
                            }
                            ],
                    "position": "50.21217, 10.38905"
                        }

            - Response:
                - 201 Created: Returns a success status and the new order ID.
                - 400 Bad Request: If required fields are missing or invalid.
                - 500 Internal Server Error: If there is an issue reading or writing the order data.

            - Example Response:
                - json {
                    "status": "success",
                    "orderId": "abc123"
                        }

    - GET /order/:orderId

        - Retrieves the details of a specific order by ID.
            - Request:
                - http
                - GET /order/:orderId

            - Response:
                - 200 OK: Returns the order details in JSON format.
                - 404 Not Found: If the order ID does not exist.
                - 500 Internal Server Error: If there is an issue reading or parsing the order data.

            - Example Response:
                - json {
                        "customer": "Dan",
                        "phone": "+43 123 456 7890",
                        "address": "Vienna, Austria",
                        "priority": true,
                        "cart": [
                            {
                                "pizzaId": 3,
                                "name": "Romana",
                                "quantity": 1,
                                "unitPrice": 15,
                                "totalPrice": 15
                            }
                                ],
                        "orderId": "abc123",
                        "position": "50.2121785, 10.3890205"
                        }

---

## Error Handling

    - This API returns relevant HTTP status codes and error messages for:
        - File Read/Write Errors: Status 500 with an error message if a file cannot be read or written.
        - Invalid Data: Status 400 if required fields are missing or the order data is invalid.

---

## Dependencies

    - dotenv: For managing environment variables.
    - express: For handling server requests and routing.
    - cors: For enabling cross-origin resource sharing.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more [LICENSE](LICENSE)details.
