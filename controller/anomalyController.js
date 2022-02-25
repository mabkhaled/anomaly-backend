const formidable = require('formidable')
var path = require('path')
const fs = require("fs")

  
const getAllAnomaly = async (req, res) => {
   
    const queryString = "SELECT *, (SELECT COUNT(*) FROM comment WHERE anomaly.idanomaly = anomaly_idanomaly) AS comment_count FROM user inner join anomaly on anomaly.user_iduser = user.iduser ORDER BY idanomaly DESC"
    pool.query(queryString, [], (err, rows, fields) => {
      
        if (err) {
        
        res.status(500).end()
        throw err
      
      }else{

        let anomalies = []
        rows.forEach(element => {
        let anomaly = {long:element.lng,lat:element.lat,comment_count:element.comment_count, idanomaly:element.idanomaly,title:element.title,description:element.description, user: {iduser:element.iduser,email:element.email,firstname:element.firstname,lastname:element.lastname } }

        anomalies.push(anomaly)
        });
        res.status(200).send(anomalies)

      }
    })
  
  }

  const getAnomalyByUser = async (req, res) => {
   
    let iduser = req.body.iduser
    const queryString = "SELECT * FROM anomaly where user_iduser = ?"

    pool.query(queryString, [iduser], (err, rows, fields) => {
      
        if (err) {
        
        res.status(500).end()
        throw err
      
      }else{

        res.status(200).send(rows)

      }
    })
  
  }

  const deleteAnomaly = async (req, res) => {
   
    let idanomaly = req.body.idanomaly
    
    const queryString = "delete FROM comment where anomaly_idanomaly = ?"

    pool.query(queryString, [idanomaly], (err, rows, fields) => {
      
        if (err) {
        
        res.status(500).end()
        throw err
      
      }else{

      
        const queryString2 = "delete FROM anomaly where idanomaly = ?"

        pool.query(queryString2, [idanomaly], (err, rows, fields) => {
          
            if (err) {
            
            res.status(500).end()
            throw err
          
          }else{
    
            res.status(200).send(rows)
    
          }
        })


      }
    })

    

  
  }


  const addAnomaly = async (req, res) => {
  

    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      
      let title = fields.title
      let description = fields.description
      let iduser = fields.iduser
      let long = fields.long
      let lat = fields.lat

      let anomalyImage = files.file
      
      let anomaly = {title,description,iduser,anomalyImage,lat,long}

      const queryString = "INSERT INTO anomaly (title,description,user_iduser,lat,lng) values (?,?,?,?,?)"
      pool.query(queryString, [anomaly.title,anomaly.description,anomaly.iduser,anomaly.lat,anomaly.long], (err, rows, fields) => {
        if (err) {
    
          console.log(err)
          res.status(500).end()
          throw err
    
        }
        else {
          let idanomaly = rows.insertId

              //Houni l upload image bel formidable
              // naatiweh l path mtaa dossier mteena 
              // o l path mtaa l file (li howa mel TEMP, l formidable ihotou ghadi)
          
              let rawData = fs.readFileSync(anomaly.anomalyImage.path)
              let filePath = getAnomalyImagesPath()+'/'+idanomaly+path.extname(anomaly.anomalyImage.name);
              
              console.log(filePath)

              fs.writeFile(filePath, rawData, function(err){
                if(err){
    
                  res.status(500).end()
                  throw err
    
                }else{
    
                  
                  res.status(200).end()

                }
    
           
              })  
          
        }
      })


  
    })
  
  }


function getAnomalyImagesPath()
{

    let serverRootPath = path.join(__dirname, '..')
    let imageUploadsPath = serverRootPath+'/uploads/imageAnomaly/'

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
    
    getAllAnomaly, addAnomaly,getAnomalyByUser,deleteAnomaly

}