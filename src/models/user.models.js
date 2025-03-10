import mongoose, { Schema } from 'mongoose';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Define user roles as a frozen object
const userRole = Object.freeze({
    USER: 'user',
    RIDER: 'rider',
    FUELSTATION: 'fuelstation'
});

// Set constant for bcrypt salt rounds
const SALT_ROUNDS = 10;

const vehicleSchema = new Schema({
    vehicleType: { type: String, enum: ['Bike', 'Car', 'Van', 'Truck'], required: true }, 
    brand: { type: String, required: true },
    model: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true, uppercase: true, trim: true },
    year: { type: Number, min: 1990, max: new Date().getFullYear() },
    color: { type: String }
}, { _id: false }); // _id is false to prevent creating a separate object ID for vehicle


const userSchema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, index: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] },
    name: { type: String, required: true, trim: true, index: true },
    avatar: { type: String },
    password: { type: String, required: [true, 'Password is required'] },
    refreshToken: { type: String },
    role: { type: String, enum: Object.values(userRole), default: userRole.USER },
    status:{
        type: String,
        enum: ["Active","inActive"],
        default: "Active"
    },
    vehicleInfo: {
        type: vehicleSchema,
        required: function () { return this.role === userRole.RIDER; } // Only required for riders
    },
    orders:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }],
    ratingGiven:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Rating"
    }],
    ratingRecived:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Rating"
    }],
    createdAt:{
        type: Date,
        default:Date.now
    },
    location:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Location"
    }]
}, { timestamps: true });

// Hash password before saving if modified
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        next();
    } catch (error) {
        return next(new Error('Error hashing password: ' + error.message));
    }
});

// Check password correctness
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return Jwt.sign(
        { _id: this._id, email: this.email, username: this.username, avatar: this.avatar, name: this.name, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function() {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
    }

    return Jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' });
};

// Export the model
export const User = mongoose.model('User', userSchema);
