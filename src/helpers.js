const {PutObjectCommand, GetObjectCommand} = require('aws-sdk/clients/s3')
const S3 = require('aws-sdk/clients/s3')
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
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

module.exports = {
    uploadFile,
    parseStudent,
    deleteFile
}