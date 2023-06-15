const mongoose = require('./db')

const PacienteSchema = new mongoose.Schema({
  apellido: {type: String, required: true},
  nombre: {type: String, required: true},
  sexo: {type: String, required: true},
  especialidad: [{type: String, required: true}],
  image: {type: String, required: true},
})

const PacienteModel = mongoose.model('paciente', PacienteSchema, 'pacientes')

module.exports = {
  PacienteModel,
  PacienteSchema,
}