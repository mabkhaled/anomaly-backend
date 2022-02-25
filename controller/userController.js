var bcrypt = require('bcryptjs');
const formidable = require('formidable')
var path = require('path')
const fs = require("fs")


const signup = async (req, res) => {

  var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      
      let email = fields.email
      let password = await bcrypt.hash(fields.password, 10)
      let firstname = fields.firstname
      let lastname =  fields.lastname
      let userImage = files.file
      
      let user = {email,password,firstname,lastname,userImage}

    const queryStringEmail = "SELECT * FROM user WHERE email = ? "
    
    pool.query(queryStringEmail, [user.email], (err, rows, fields) => {
  
      if (err) {
      
        res.status(500).end()
        throw err
  
      }
  
      if (rows.length != 0) {
    
            res.status(203).send({ auth: false })
      
        }
      else { 
  
            const queryString = "INSERT INTO user (email,firstname,lastname,password) values (?,?,?,?)"
    
            pool.query(queryString, [email,firstname,lastname, password], (err, rows, fields) => {
            if (err) {
    
                console.log(err)
                res.status(500).end()
                throw err
    
            }
            else {

              let iduser = rows.insertId
                        
              let rawData = fs.readFileSync(user.userImage.path)
              let filePath = getUserImagesPath()+'/'+iduser+path.extname(user.userImage.name);
              
              fs.writeFile(filePath, rawData, function(err){
                if(err){
    
                  res.status(500).end()
                  throw err
    
                }else{
    
                  
                  res.status(200).send({ auth: true, user: {iduser,email,password,firstname,lastname} });

                }
    
           
              }) 
        
            }
    
    
            })
  
      }
  
    })

  
    })


  
  }

  
const signin = async (req, res) => {

  let email = req.body.email;
  let password = req.body.password;

  console.log("Token is :" + req.headers.token)

  const queryString = "SELECT * FROM user WHERE email = ? "
  pool.query(queryString, [email], async (err, rows, fields) => {
    if (err) {
      
      res.status(500).end()
      throw err
    }

    if (rows.length == 0) {

      res.status(201).end()
    
    }
    else {

      console.log(password)
      
      console.log(rows[0].password)
      const match = await bcrypt.compare(password, rows[0].password);

      if(match)
      {


      
        res.status(200).send({  iduser: rows[0].iduser,  email: rows[0].email,firstname: rows[0].firstname,lastname:rows[0].lastname  });

      }else{

        res.status(201).end()

      }

    }
  })

}


const updateUser = async (req, res) => {


  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    
    let iduser = fields.iduser
    let firstname = fields.firstname
    let lastname =  fields.lastname
    let userImage = files.file
    
    let user = {iduser,firstname,lastname,userImage}
  
    const queryString = "UPDATE user SET firstname = ?, lastname = ? WHERE iduser = ? "
    pool.query(queryString, [user.firstname,user.lastname,user.iduser], (err, rows, fields) => {
      if (err) {
        
        res.status(500).end()
        throw err
      }
      else {
  
      
        let rawData = fs.readFileSync(user.userImage.path)
        let filePath = getUserImagesPath()+'/'+user.iduser+path.extname(user.userImage.name);
        
        fs.writeFile(filePath, rawData, function(err){
          if(err){

            res.status(500).end()
            throw err

          }else{

            
            res.status(200).end();

          }

     
        })
  
      }
    })
  })

}

function getUserImagesPath()
{

    let serverRootPath = path.join(__dirname, '..')
    let imageUploadsPath = serverRootPath+'/uploads/imageUser/'

    if (!fs.existsSync(imageUploadsPath)) {
        
        fs.mkdirSync(imageUploadsPath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        })
        
    }

    return imageUploadsPath

}



module.exports = {
    
    signup,signin,updateUser

}