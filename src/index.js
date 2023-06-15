require('dotenv').config()
const express = require('express')
const {PacienteModel} = require('./models')
const fileUpload = require('express-fileupload');
const { uploadFile, parseStudent, deleteFile } = require('./helpers');
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
}));

const erroHandler = (err, req, res, next) => {
    res.status(404).send({
        "message": err.message
    })
}

app.put('/update/:id', async(req, res, next) => {
    try{
        console.log(req.body, req.params)
        const alumno = req.body
        const alumnoUpdated = await PacienteModel.findByIdAndUpdate(req.params.id, alumno, {new: true})
        res.json(alumnoUpdated).status(200)
    }catch(err) {
        next(err)
    }
})

app.delete('/delete/:id', async (req, res, next) => {
    try{
        const paciente = await PacienteModel.findOne({_id: req.params.id})
        await PacienteModel.deleteOne({_id: req.params.id})
        res.json().status(200)
    }catch(err) {
        next(err)
    }
})

app.post('/register', async (req, res, next) => {
    try{
        const paciente = await PacienteModel.create(req.body)
        res.json(paciente).status(200)
    }catch(err) {
        next(err)
    }
})

app.post('/upload', async (req, res, next) => {
    try{
        const result = await uploadFile(req.files.files)
        res.json({ image: result })
    }catch (err){
        next(err)
        console.log(err)
    }
})

app.get('/pacientes', async (req, res, next) => {
    try{
        const pacientes = await PacienteModel.find()
        res.json(pacientes).status(200)
    }catch (err){
        next(err)
    }
})

app.get('/paciente/:id', async (req, res, next) => {
    try{
        const paciente= await PacienteModel.findOne({_id: req.params.id})
        console.log(paciente)
        res.json(paciente).status(200)
    }catch (err){
        next(err)
    }
})

app.use(express.static(path.join(__dirname, '../pc2_web/dist')));

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../pc2_web/dist', 'index.html'));
});


app.use(erroHandler)

app.listen(4503, () => {
    console.log("esta corriendo")
})
