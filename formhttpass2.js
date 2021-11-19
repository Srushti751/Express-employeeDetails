import http from 'http'
import fs from 'fs'
import {parse} from 'querystring'


const port = 6677
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


const server = http.createServer((req,res)=>{
    if(req.method==='GET' && req.url=="/form"){
        res.statusCode=200
        const data = fs.readFileSync("form.html",(err)=>{
          console.log(err)
        })
        res.writeHead(200,{'Content-type':'text/html'});

        res.write(data)
        res.end()
        
      }
      else if(req.method==="POST")
      {
        let body='';

          req.on('data',(data)=>{
            console.log(data.toString())
              body= parse(data.toString())
              const da = loadJSON('employee.json')
              console.log(`${body.name}`)
              da.push({
                "name": `${body.name}`,
                "email": `${body.email}`,
                "age":`${body.age}`,
                "city":`${body.city}`,
                "department":`${body.department}`
              })
              saveJSON('employee.json',da)
              res.end()
          })
          req.on('end',()=>{
            res.writeHead(200,{'Content-type':'text/html'});
            res.write(body,()=>{
                res.end();
            })
        })
        }
 
    else if(req.url=="/"  )
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
           
     
          </tr>
                <tr class="table-dark">
                    <th scope="col">${data[ot].name}</th>
                    <th scope="col">${data[ot].email}</th>
                    <th scope="col">${data[ot].age}</th>
                    <th scope="col">${data[ot].city}</th>
                    <th scope="col">${data[ot].department}</th>
             
                  </tr>
                </table>
                  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script> 
            </body>
                  </html>
               `)
        }

   
        res.end()

    }
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
  })
