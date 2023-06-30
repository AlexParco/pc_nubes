require('dotenv').config()
const express = require('express')
const { PacienteModel, UserModel} = require('./models')
const fileUpload = require('express-fileupload');
const { 
    uploadFile, 
    bodyMessage, 
    mg,
    hashPassword, 
    comparePassword 
} = require('./helpers');
const bcrypt = require('bcrypt')
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
        "message": err.message,
        "ok": false
    })
}

app.post('/auth/resetpassword' , async (req, res, next) => {
    try {
        const { email, newpassword } = req.body
        const user = await UserModel.findOne({email: email}) 

        if(!user) {
            throw Error("email no registrado")
        }

        for(const password of user.passwordHistory.slice(0, 4)) {
            if(await comparePassword(newpassword, password)) {
                throw Error('la nueva contraseña no puede ser igual a las anteriores')
            }
        } 

        await mg.messages.create(process.env.MAIL_DOMAIN, bodyMessage({
            message: 'Contraseña restablecida',
            to: email,
            subject: 'TestWeb Contraseña',
        }))
        .then(msg => console.log({msg}))
        .catch(err => console.error({err}));

        encryptPassword = await hashPassword(newpassword)
        await UserModel.findOneAndUpdate({email: email}, {
            password: encryptPassword,
            $push: {
                passwordHistory: encryptPassword
            },
            isLocked: fals
        })

        res.json({
            message: 'contraseña actualizada con exito',
            ok: true
        }).status(200)
    } catch (error) {
        next(error)
    }
})

app.post('/auth/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({email: email})

        if(user === null) {
            throw Error('Usuario y/o Contraseña Incorrecta')
        }

        const result = await bcrypt.compare(password, user.password)
        if(user.isLocked) {
            throw Error('cambiar la contraseña para reactivar la cuenta')
        }

        if(!result) {
            if(user.loginAttempts >= 2) {
                await UserModel.findOneAndUpdate({email: email}, { 
                    isLocked: 'true',
                    loginAttempts: 0
                })
                return res.json({
                    message: 'cuenta bloqueada'
                })
            }
            await UserModel.findOneAndUpdate({email: email}, { 
                $inc: { 
                loginAttempts: 1 
            }})
            throw Error('Usuario o Contraseña Incorrecta')
        }

        const updatedUser = await UserModel.findOneAndUpdate({email: email}, { 
            loginAttempts: 0
        })

        res.json({
            user: updatedUser, 
            ok: true
        }).status(200)
    } catch (error) {
        next(error)
    }
})

app.post('/auth/register', async(req, res, next) => {
    try {
        const { email, password } = req.body
        if(!email || !password ){
            throw Error("falta email y/o password")
        }
        console.log(req.body)

        const user = await UserModel.findOne({email: email})
        console.log(user)
        if(user) {
            throw Error("usuario ya registrado")
        }

        encryptPassword = await hashPassword(password)

        UserModel.create({
            email, 
            password: encryptPassword, 
            passwordHistory: [
                encryptPassword
            ]
        })
        res.json({
            message: 'cuenta creada con exito',
            ok: true
        }).status(200)
    } catch (error) {
        next(error)
    }
})

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
