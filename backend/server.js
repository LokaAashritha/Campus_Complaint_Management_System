// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require("cors");

// dotenv.config();

// const app = express();

// /* Middleware */
// app.use(express.json());
// app.use(cors());

// /* Routes */
// const authRoutes = require('./routes/auth');
// const categoryRoutes = require('./routes/categories');
// const complaintRoutes = require('./routes/complaints');
// const adminRoutes = require('./routes/admin');

// /* Route Connections */
// app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/complaints', complaintRoutes);
// app.use('/api/admin', adminRoutes);

// /* DB Connection */
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// /* Server */
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.ADMIN_REGISTRATION_SECRET) {
  console.warn('Warning: ADMIN_REGISTRATION_SECRET is missing. Admin registration will be blocked.');
}

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const complaintRoutes = require('./routes/complaints');
const adminRoutes = require('./routes/admin');

/* Route Connections */
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

/* DB Connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});