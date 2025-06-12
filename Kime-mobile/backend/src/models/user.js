import mongoose from "mongoose";
import { getMainDatabase } from "../db/conn.js";

const questionnaireSchema = new mongoose.Schema({
  flavourPreferences: {
    type: [String],
    enum: ['Sweet', 'Sour / Citrusy', 'Bitter', 'Fruity'],
    default: []
  }, 
  alcoholRestriction: {
    type: String, 
    enum: [
      "I don't drink alcohol",
      "I prefer low-alcohol drinks",
      "I have no restrictions"
    ],
    required: true
  },
  caffeinePreferences: {
    type: String, 
    enum: [
      "Yes, I love it",
      "Only small amounts",
      "No, I avoid caffeine"
    ],
    required: true
  },
  physicalActivityLevel: {
    type: String, 
    enum: [
      "Sedentary",
      "Moderate",
      "Active"
    ],
    required: true
  },
  orderMotivation: {
    type: String, 
    enum: [
      "Trying something new",
      "Familiar flavor",
      "Healthiest option",
      "Depends"
    ],
    required: true
  },
  wantsNotifications: { type: Boolean },
  notificationTypes: {
    type: [String],
    enum: ['Promotions', 'Events', 'Recommendations', 'New drinks'],
    default: [],
    validate: {
      validator: function(types){
        return this.wantsNotifications || types.length === 0;
      }, 
      message: 'Notifications should be empty if wantsNotifications is false'
    }
  }
}, {_id: false});

const userSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    postal_code: { type: String, required: true },
    phone_number: { type: String, required: true },
    image: { type: String, default: '' },
    role: { type: String, enum: ['owner', 'user'], default: 'user' },
    description: { type: String, default: '' },
    questionnaire: {type: questionnaireSchema, default: {}},
    likedDrinks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Drink', default: []}],
    savedDrinks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Drink', default: []}],
    createdDrinks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Drink', default: []}],
  }, { collection: "user"});

  const User = getMainDatabase().model("User", userSchema);

  export default User;