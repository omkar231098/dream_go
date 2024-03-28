// Function to validate email using regex
const isValidEmail = (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate password
const isValidPassword = (password) => {
  // Implement your custom password validation logic
  // For simplicity, this example checks if the password is at least 6 characters long
  return password.length >= 6;
};

const validateEmailAndPassword = (req, res, next) => {
  const { email, password } = req.body;

  // Validate email
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  // Validate password
  if (!isValidPassword(password)) {
    return res.status(400).json({ success: false, message: 'Invalid password format, Password is at least 6 characters long' });
  }

  // If both email and password are valid, continue to the next middleware or route handler
  next();
};

module.exports = { validateEmailAndPassword };
