'use strict';

import mongoose, { Schema } from 'mongoose';

const heroSchema = Schema({
  name: { type: String, required: true },
  universe: { type: String },
  power: { type: String },
});

const Hero = mongoose.models.hero || mongoose.model('hero', heroSchema);

export default Hero;