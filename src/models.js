const mongoose = require('./db')

const PacienteSchema = new mongoose.Schema({
  apellido: {type: String, required: true},
  nombre: {type: String, required: true},
  sexo: {type: String, required: true},
  especialidad: [{type: String, required: true}],
  image: {type: String, required: true},
})

const PacienteModel = mongoose.model('paciente', PacienteSchema, 'pacientes')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  passwordHistory: [String],
  loginAttempts: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  resetPassword: {
    type: Boolean,
    default: false
  },
  lastPasswordReset: Date
});

const UserModel = mongoose.model('user', UserSchema, 'users');

module.exports = {
  PacienteModel,
  PacienteSchema,
  UserSchema,
  UserModel,
}