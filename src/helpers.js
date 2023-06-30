const {PutObjectCommand, GetObjectCommand} = require('aws-sdk/clients/s3')
const S3 = require('aws-sdk/clients/s3')
const bcrypt = require('bcrypt')
const formDataIm = require('form-data')
const MailGun = require('mailgun.js')
// const MailGun = require('mailgun-js')({
//     apiKey: process.env.MAIL_APIKEY,
//     domain: process.env.MAIL_DOMAIN
// })
const fs = require('fs')

const storage = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEYID,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY 
    }
})

async function uploadFile(file) {
    const stream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Bucket: 'pc2image',
        Key: file.name,
        Body: stream,
        ContentType: file.mimetype,
        ContentDisposition: 'inline'
    }
    const command = await storage.upload(uploadParams).promise()
    return command.Location
}

async function deleteFile(filename) {
    const cmd = await storage.deleteObject({
        Bucket: 'pc2image',
        Key: filename
    }).promise()
    return
}


function parseStudent(student, urlImage) {
    return {
        id: student._id,
        image: urlImage,
        firstname: student.firstname,
        lastname: student.lastname,
        age: student.age,
        grade: student.grade,
    }
} 

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

async function comparePassword(password, currentPassword) {
    return await bcrypt.compare(password, currentPassword)
}

const mailgun = new MailGun(formDataIm)

console.log(process.env.MAIL_APIKEY)
console.log(process.env.MAIL_USER)

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAIL_APIKEY,
})

const bodyMessage = ({message, to, subject}) => {
    return {
        from: `Mailgun Sandbox <${process.env.MAIL_DOMAIN_FROM}>`,
        to: `${to}`,
        subject: `${subject}`,
        html: `${message}`
    }
}

module.exports = {
    uploadFile,
    parseStudent,
    deleteFile,
    hashPassword,
    comparePassword,
    mg,
    bodyMessage
}