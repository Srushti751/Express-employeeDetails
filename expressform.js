// var express = require('express')
import express from 'express'
import fs from 'fs'
import { dirname } from 'path';
import {parse} from 'querystring'


const PORT = 8087;

function loadJSON(filename=''){
    return JSON.parse(
        fs.existsSync(filename)
        ? fs.readFileSync(filename).toString()
        :""
    )
}

function saveJSON(filename='',json='""'){
    return fs.writeFileSync(filename,
        JSON.stringify(json))
}

var app = express()
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// app.get("/form",(req,res)=>{
//     res.sendFile('form.html',{root:'.'});
// })
app.get("/form",(req,res)=>{
    res.render('newform');
})

app.get('/data',(req,res)=>{
    const emp = loadJSON('employee.json')
    res.render('form_data',{postData:emp})
})


app.get("/",(req,res)=>
{
    const emp = loadJSON('employee.json')
    const data = emp
    console.log(data)
    const jsondata = JSON.stringify(data)

    res.writeHead(200,{'Content-type':'text/html'});


    res.write(`  <a class="btn m-2 btn-info btn-lg" href="/form">Add Employee</a><br/><br/>
                  <h1 class="text-center">Employee Details</h1><br/>
    `)

    for(var ot in data){
        res.write(` 
        <html>
        <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        </head>  
        <body>
        
        <table class="table" border="2" >
        <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Age</th>
        <th scope="col">City</th>
        <th scope="col">Department</th>
        <th scope="col">Delete</th>
        <th scope="col">Update</th>
       
 
      </tr>
            <tr class="table-dark">
                <th scope="col">${data[ot].name}</th>
                <th scope="col">${data[ot].email}</th>
                <th scope="col">${data[ot].age}</th>
                <th scope="col">${data[ot].city}</th>
                <th scope="col">${data[ot].department}</th>
                <th scope="col"><a href="/delete/${data[ot].name}" class="btn btn-danger">Delete</a></th>
                <th scope="col"><a href="/update/${data[ot].name}/${data[ot].email}/${data[ot].age}/${data[ot].city}/${data[ot].department}" class="btn btn-success">Update</a></th>
         
              </tr>
            </table>
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script> 
        </body>
              </html>
           `)
    }


    res.end()

})

app.post("/",(req,res)=>{
    
        
              const da = loadJSON('employee.json')
              console.log(`${req.body.name}`)
              da.push({
                "name": `${req.body.name}`,
                "email": `${req.body.email}`,
                "age":`${req.body.age}`,
                "city":`${req.body.city}`,
                "department":`${req.body.department}`
              })
              saveJSON('employee.json',da)
              res.end()
       
        
})

app.get("/delete/:name",(req,res)=>{

    let n = req.params.name
    const detail = loadJSON('employee.json')
    const newdetails = detail.filter(item=>item.name!==n)
    detail.push(newdetails)
    saveJSON('employee.json',newdetails)

    res.end("done")
  
   
  })

app.get("/update/:name/:email/:age/:city/:department",(req,res)=>{
    let n = req.params.name
    let e = req.params.email
    let a = req.params.age
    let c = req.params.city
    let d = req.params.department
    const detail = loadJSON('employee.json')
    const newdetails = detail.find(item=>item.name===n)
    console.log(newdetails)
    const remdetails = detail.filter(item=>item.name!==n)
    detail.push(remdetails)
    saveJSON('employee.json',remdetails)

    res.render('form',{name:n,email:e,age:a, city:c,department:d})

})

app.put("/update/:name",(req,res)=>{
    
        
        const da = loadJSON('employee.json')
        console.log(`${req.body.name}`)
    
        da.push({
          "name": `${req.body.name}`,
          "email": `${req.body.email}`,
          "age":`${req.body.age}`,
          "city":`${req.body.city}`,
          "department":`${req.body.department}`
        })
        saveJSON('employee.json',da)
        res.end()
 
  
})
// })


// respond with "hello world" when a GET request is made to the homepage
app.listen(PORT, (err)=> {
    if(err) throw err;
    console.log(`Working on http://localhost:${PORT}`)
})