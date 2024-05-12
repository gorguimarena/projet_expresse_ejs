const express = require("express");
const app = express();
const con = require('./db');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const PORT = 3000;
const copyright = "Alioune DIOP 2024";

//dire a express de considerer le dossier 'public' comme un dossier contenant des fichiers accessibles par un poste client
app.use("/public",express.static("public"));


//pour dire que les vues seront dans le dossiers ./views
app.set("views", "./views");
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'))




app.get("/", (req, res) => {
  const sql = "select * from mangas order by id_film desc";
  con.query(sql, (err,rows) => {
    if (err){
      throw err;
    }
    
    res.render("accueil.ejs", {
      title: 'La liste des films depuis server.js',
      data: rows,
      copyright} );
})  
});

app.get('/ajout', (req, res, next) => {
  res.render('./pages/films/ajout.ejs', {
    title: 'Formulaire d\'ajout film',
    copyright
  })
});

app.get('/modifier/:id', (req, res)=> {
  
  const id = req.params.id;
  console.log("id a modifier => " + id);
  
  //const sql = "select * from movie where id = " + id;
  const sql = "select * from mangas where id_film = ? ";
  con.query(sql, id, (err, result) => {
    res.render('./pages/films/modif.ejs', {
      title: "Formulaire de modification de film",
      copyright,
      data: result[0]
    });
  })
  
  
})

app.post('/ajout', (req, res) => {
  const data = {
    titre: req.body.titre,
    description: req.body.description,
    anne: req.body.annee,
    auteur: req.body.auteur,
    isSerie: req.body.categorie,
    genre: req.body.genre,
  }
  
  const sql = "insert into mangas set ?";
  con.query(sql, data, (err, result) => {
    if (err) throw err;
    
    console.log("Film avec id => " + result.insertId + " ajouté avec succès");
    
    res.redirect("/");
  });
})

app.put("/modif/:id", (req, res) => {
  const id = req.params.id;
  const data = {
    titre: req.body.titre,
    description: req.body.description,
    anne: req.body.annee,
    auteur: req.body.auteur,
    isSerie: req.body.categorie,
    genre: req.body.genre,
  } 
  const sql = "update mangas set ? where id_film = ?";
  con.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    
    res.redirect("/");
  });
});

//listener for delete a manga
app.delete("/supprimer/:id",(req,res)=>{

     const id = req.params.id;
       const sql = "DELETE FROM mangas where id_film = ?";
       con.query(sql, [id], (err, result) => {
             if (err){
                console.log(err);
             }else{
                //redirection vers la page principale
                res.redirect("/");
             }
         });


});

//listener pour la suppression de mangas
app.get("/supprimer/:id",(req,res)=>{
    const id = req.params.id;
    res.render('./pages/films/confirmSup.ejs',{id,copyright,title:'Confirmation de la suppression'});

});

//methode pour les details
app.get("/details/:id",(req,res)=>{
    const id=req.params.id;
    const sql="select description from mangas where id_film = ?";
    con.query(sql,[id],(error,resultat)=>{
        if(error) throw error;
        const row=resultat[0];
        res.render('./pages/films/details.ejs',{row,copyright});

    });

});



app.listen(PORT, () => {
  console.log("server listening on port: " + PORT);
});
