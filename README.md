# PassportJS Authentication with ExpressJS

Welcome to our PassportJS Authentication with ExpressJS project! This project serves as a hands-on learning experience for implementing authentication using PassportJS in an ExpressJS application. By following this guide and exploring the code, you'll gain a better understanding of how to incorporate authentication into your own ExpressJS projects.

# Features

- Local Authentication: Users can register and login using their username and password.
- Session Management: PassportJS manages user sessions, providing a seamless authentication experience.
- Password Hashing: User passwords are securely hashed using crypto node library before being stored in the database.
- Custom Middleware: Explore the custom middleware functions used for authentication and authorization.

# Technologies Used

- ExpressJS: A minimalist web framework for Node.js used to build the backend server.
- PassportJS: A popular authentication middleware for Node.js, used to implement various authentication strategies.
- crypto: A library for hashing passwords, used to securely store user passwords in the database.
- MongoDB: A NoSQL database used to store user information and their posts.

# Directory Structure

- /controllers: Contains controller functions for handling authentication and user-related and post-related operations.
- /models: Defines MongoDB schemas for user and post data.
- /routes: Defines routes for different parts of the application.
- /views: Contains view templates written in pug for rendering pages.
