let express = require("express")
let app = express()
app.use(express.urlencoded())
let taches =[]

let confirmationMessage = ''


var mysql= require("mysql2")
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password:'password',
    database:'taches'
})
connection.connect(function(error) {
  if (error){
    console.log(error)
}
  else {
    console.log("Connection réussie")
  }
})
//console.log(connection.query('SELECT taches FROM todo '))
connection.query('SELECT taches FROM todo;',(error,résultat)  => {
  if (error){
    console.log("FROMAGE")
  }
  else{
    console.log("PAS FROMAGE")
    
    liste_résultat= résultat.length
    for (let i=0; i<liste_résultat; i++){
      taches.push(résultat[i].taches)
    }

  
  }
})

app.get("/", (request, response) => {
    
    response.render("home.ejs", {taches, confirmationMessage})
    confirmationMessage= '';
})

app.get("/Tache", (request, response) => {

  response.render("TacheListe.ejs")
 
})

app.post("/add", (request, response) => {
    const nouvelle_tache = request.body.nouvelle_tache   
    taches.push(nouvelle_tache)
    confirmationMessage = 'Enregistré'

    let tacheSQL = {"Taches" : request.body.nouvelle_tache}
    
    connection.query('Insert INTO todo SET ?', tacheSQL)
    
    
    response.redirect("/")
   
    
})
app.get('/effacerTaches/:index', (req, res) => {
    let index = req.params.index;
       
    connection.query('DELETE FROM todo WHERE taches= ?',[taches[index]])
    
    if (index >= 0 && index < taches.length) {
      taches.splice(index, 1);
    }
    res.redirect('/');
  });


app.use(express.static("public"))

app.listen(3000, function(){
    console.log("Server is running on port 3000")
})

