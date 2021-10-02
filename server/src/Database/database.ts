import mongoose, { mongo } from 'mongoose'
import config from '../config/config'

mongoose.connect(config.mongoUri)
.then(() => console.log('The database have been Connected'))
.catch((err: any) => console.log(`DB Connection Error${err}`));

mongoose.connection.on('error',(err:any)=> {
    throw new Error(`unable to connect ${config.mongoUri} and the error is ${err.message}`)
})

