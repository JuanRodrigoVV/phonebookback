
const mongoose = require('mongoose')




const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false)
mongoose.connect(url)
.then(result => {
  console.log('Connected')
})
.catch((error) => {
  console.log(error.message)
})



const phoneSchema = new mongoose.Schema({
    name: String,
    number: Number,
  })

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })  


module.exports = mongoose.model('User', phoneSchema)
  
  // const User = mongoose.model('User', phoneSchema)
  
 


//   if (process.argv.length<4) {
//     User.find({}).then(result => {
//         result.forEach(user => {
//           console.log(`${user.name} ${user.number}`)
//         })
//         mongoose.connection.close()
//       })
// } else if (process.argv.length>5) {
//     console.log("Check your data: if the name contains whitespace characters, it must be enclosed in quotes")
// } 

// else {

//     const user = new User({
//         name: process.argv[3],
//         number: process.argv[4],
//       })
      
//       user.save().then(result => {
//         console.log('user saved!')
//         mongoose.connection.close()
//       })
//       console.log(`Added ${process.argv[3]} number ${process.argv[4]} to the phonebook`)
// }


