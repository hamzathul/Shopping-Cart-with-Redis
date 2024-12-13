<div align="center">
<h1 align="center">Shopping Cart</h1>

  <p align="center">
   A MERN stack application that combines a robust, scalable backend with an intuitive and responsive frontend. The application incorporates advanced features like JWT-based authentication, Redis caching, Razorpay integration for seamless payments, and Cloudinary for efficient media storage and delivery.
    <br />
    <br />
    <br />
    <a href="https://shopping-cart-uggk.onrender.com">View Demo</a>
    ·
    <a href="https://github.com/hamzathul/Shopping-Cart-with-Redis/issues">Report Bug</a>
    ·
    <a href="https://github.com/hamzathul/Shopping-Cart-with-Redis/issues">Request Feature</a>
  </p>
</div>
<br/>

## Installation

1.Clone this Repository

```bash
  git clone https://github.com/hamzathul/Shopping-Cart-with-Redis.git
```
2.Navigate to the project folder:
```bash
  cd Shopping-Cart-with-Redis
```
To run this project, add the following environment variables to your .env file in the root directory of this project.
<br>
So, create a '.env' file, and add the following:

`NODE_ENV = development`

`PORT = 5000`

`MONGO_URI = <your-mongodb-uri>`

`UPSTASH_REDIS_URL = <your-redis-url>`

`ACCESS_TOKEN_SECRET = <your-access-token-secret>`

`REFRESH_TOKEN_SECRET = <your-refresh-token-secret>`

`CLOUDINARY_CLOUD_NAME = <your-cloudinary-cloud-name>`

`CLOUDINARY_API_KEY = <your-cloudinary-api-key>`

`CLOUDINARY_API_SECRET = <your-cloudinary-api-secret>`

`RAZORPAY_KEY_ID = <your-razorpay-key-id>`

`RAZORPAY_KEY_SECRET = <your-razorpay-key-secret>`



3.Install dependencies for the backend and run backend server:
```bash
  yarn install
  yarn run dev
```
The backend will run on http://localhost:5000.

4.Install dependencies for the frontend and run frontend server:
```bash
  cd frontend
```
```bash
  yarn install
  yarn dev
```
The frontend will run on http://localhost:5173.

Now you can open your browser and go to http://localhost:5173 to view the application.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

