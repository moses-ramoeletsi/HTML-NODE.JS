# User Management System

A full-stack web application for user registration, authentication, and data management built with HTML, Node.js, and MySQL.

## Features

- **User Authentication**: Secure registration and login system
- **JWT Token-based Authorization**: Protected routes and API endpoints
- **CRUD Operations**: Create, Read, Update, and Delete user data
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Validation**: Form validation and error handling
- **Secure Password Storage**: BCrypt password hashing
- **Dashboard**: User-friendly interface for data management

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL (XAMPP)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: BCrypt for password hashing
- **Styling**: Custom CSS with modern design

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [XAMPP](https://www.apachefriends.org/) (for Apache and MySQL)
- A modern web browser

## Installation

### 1. Clone or Download the Project

```bash
mkdir user-management-app
cd user-management-app
Run `npm install` to install dependencies
Run `npm start` to start the application
```

### 2. Set Up Database

1. Start XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Open phpMyAdmin at `http://localhost/phpmyadmin`
4. Create a new database named `user_management`
5. Run the following SQL script:

```sql
-- Create database
CREATE DATABASE user_management;
USE user_management;

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data table for CRUD operations
CREATE TABLE user_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Install Dependencies

```bash
npm init -y
npm install express mysql2 bcryptjs jsonwebtoken cors body-parser dotenv
```

### 4. Project Structure

Create the following directory structure:

```
user-management-app/
├── server.js
├── package.json
├── README.md
└── public/
    ├── login.html
    ├── register.html
    └── dashboard.html
```

### 5. Configuration

In `server.js`, update the database configuration if needed:

```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP MySQL password is empty
    database: 'user_management'
});
```

**Important**: Change the JWT secret key in `server.js`:

```javascript
const JWT_SECRET = 'your-super-secret-key-change-this-in-production';
```

## Running the Application

### 1. Start XAMPP Services

- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services
- Ensure they're running (green status)

### 2. Start the Node.js Server

```bash
node server.js
```

You should see:
```
Connected to MySQL database
Server running on http://localhost:3000
```

### 3. Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## Usage Guide

### Registration

1. Navigate to `http://localhost:3000`
2. Click "Register here" link
3. Fill in the registration form:
   - Username (unique)
   - Email (unique)
   - Password
4. Click "Register"
5. You'll be redirected to the login page upon successful registration

### Login

1. Enter your registered email and password
2. Click "Login"
3. You'll be redirected to the dashboard upon successful authentication

### Dashboard Operations

#### Create Data
1. Fill in the "Add New Data" form:
   - **Title**: Required field
   - **Description**: Optional
   - **Status**: Active or Inactive
2. Click "Add Data"

#### View Data
- All your data is displayed in the table below the form
- Shows title, description, status, creation date, and actions

#### Edit Data
1. Click the "Edit" button on any row
2. The form will populate with existing data
3. Modify the fields as needed
4. Click "Update Data" or "Cancel" to abort

#### Delete Data
1. Click the "Delete" button on any row
2. Confirm deletion in the modal dialog
3. The data will be permanently removed

### Logout

Click the "Logout" button in the header to end your session and return to the login page.

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Data Management (Requires Authentication)
- `GET /api/data` - Get all user data
- `POST /api/data` - Create new data
- `PUT /api/data/:id` - Update existing data
- `DELETE /api/data/:id` - Delete data

### Static Routes
- `GET /` - Login page
- `GET /register` - Registration page
- `GET /dashboard` - Dashboard page

## Security Features

- **Password Hashing**: All passwords are hashed using BCrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: HTML escaping for user input
- **Authorization**: Protected routes requiring valid tokens

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure XAMPP MySQL is running
   - Check database credentials in `server.js`
   - Verify database `user_management` exists

2. **Port Already in Use**
   - Change the port in `server.js`: `const PORT = 3001;`
   - Or kill the process using port 3000

3. **Module Not Found Errors**
   - Run `npm install` to install all dependencies
   - Check if `package.json` exists

4. **Login/Registration Issues**
   - Check browser console for errors
   - Verify database tables are created correctly
   - Ensure server is running

5. **Token Errors**
   - Clear browser localStorage: `localStorage.clear()`
   - Check if JWT_SECRET is set in server.js

### Development Tips

- Use browser Developer Tools (F12) to debug frontend issues
- Check server console for backend error messages
- Use phpMyAdmin to inspect database records
- Test API endpoints using tools like Postman

## Customization

### Styling
- Modify CSS in HTML files for custom styling
- Add new CSS classes or frameworks as needed

### Database Schema
- Add new columns to existing tables
- Create additional tables for more features
- Update API endpoints accordingly

### Features
- Add user roles and permissions
- Implement file upload functionality
- Add data pagination and search
- Create data export features

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use `.env` file for sensitive data
2. **HTTPS**: Enable SSL/TLS encryption
3. **Database Security**: Create dedicated database user with limited privileges
4. **Session Management**: Consider using secure, httpOnly cookies
5. **Rate Limiting**: Implement API rate limiting
6. **Input Sanitization**: Add additional input validation
7. **Logging**: Implement proper logging system
8. **Error Handling**: Add comprehensive error handling

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the code comments for guidance
3. Create an issue in the project repository

## Acknowledgments

- Express.js team for the excellent web framework
- MySQL team for the reliable database system
- BCrypt and JWT libraries for security features