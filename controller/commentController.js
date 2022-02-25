


const addComment = async (req, res) => {

    let idAnomaly = req.body.idAnomaly
    let comment = req.body.comment
    let iduser = req.body.iduser

    const queryString = "INSERT INTO comment (comment, anomaly_idanomaly,iduser) values (?,?,?)"
    
    pool.query(queryString, [comment,idAnomaly,iduser], (err, rows, fields) => {
    if (err) {

        console.log(err)
        res.status(500).end()
        throw err

    }
    else {

        res.status(200).end();

    }


    })
  
  }
  
  const getAnomalyComments = async (req, res) => {
   
    let idAnomaly = req.body.idAnomaly

    const queryString = "select * from comment inner join user on comment.iduser = user.iduser where comment.anomaly_idanomaly = ?;"
    pool.query(queryString, [idAnomaly], (err, rows, fields) => {
      
        if (err) {
        
        res.status(500).end()
        throw err
      
      }else{

        let comments = []
        rows.forEach(element => {
        let comment = {idcomment:element.idcomment
          ,comment:element.comment
          ,anomaly_idanomaly:element.anomaly_idanomaly, idanomaly:element.idanomaly,title:element.title,description:element.description, user: {iduser:element.iduser,email:element.email,firstname:element.firstname,lastname:element.lastname } }

        comments.push(comment)
        });
        console.log(rows)
        res.status(200).send(comments)

      }
    })
  
  }

  module.exports = {
    
    addComment,getAnomalyComments

}