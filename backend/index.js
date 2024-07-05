import express from "express";
import mysql from "mysql";
import cors from "cors";

import "dotenv/config";

const app = express();

// mysql db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "akme_cafe",
});

// by default we can not send any data to the server to prevent we add express server middleware
app.use(express.json()); //it allowd us to send any json file using client
app.use(cors()); // middleware

app.get("/", (req, res) => {
  res.json("welcome to backend server");
});

app.get("/books", (req, res) => {
  const q = "select * from items";
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

//add new book into items
app.post("/books", (req, res) => {
  const q =
    "insert into items (`name`,`price`,`desc`,`image`,`category`,`quantity`) values (?)";
  const values = [
    req.body.name,
    req.body.price,
    req.body.desc,
    req.body.image,
    req.body.category,
    req.body.quantity,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("created book");
  });
});

// delete a book items
app.delete("/books/:id", (req, res) => {
  const book_id = req.params.id;
  // console.log(book_id);

  const q = "delete from items where id=?";

  db.query(q, [book_id], (err, data) => {
    if (err) return res.json(err);
    console.log("dl done");
    return res.json("deletation done");
  });
});

// update a book items
app.put("/books/:id", (req, res) => {
  const book_id = req.params.id;
  const q =
    "update items set `name`=?, `price`=? , `desc`=?, `image`=? , `category`=? ,`quantity`=? where id=?";
  const values = [
    req.body.name,
    req.body.price,
    req.body.desc,
    req.body.image,
    req.body.category,
    req.body.quantity,
  ];
  db.query(q, [...values, book_id], (err, data) => {
    if (err) return res.json(err);
    console.log("up done");
    return res.json("updation done");
  });
});

// get items on the basis of category
app.get("/home/category/:id", (req, res) => {
  const book_category = req.params.id;
  var q;
  if (book_category == "Others") {
    q =
      "select * from items where category not in ('Business','Computer','Comics','Biography','Entertainment','History','Medical','Religion','Science','Sci_Fi')";
  } else {
    q = "select * from items where category=?";
  }
  db.query(q, [book_category], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

// // decrease when item added in cart
// app.put("/home/:id",(req,res)=>{
//     const book_id=req.params.id;
//     const q="update items set quantity=quantity-1 where id=? and quantity > 0";
//     db.query(q,[book_id],(err,data)=>{
//         if(err)
//             return res.json(err);
//         return res.json(data);
//         return res.json(1);
//     })

// })

// query add
app.post("/home/contact", (req, res) => {
  const q = "insert into query (`name`,`phone`,`query_msg`) values(?)";
  const values = [req.body.name, req.body.phone, req.body.query_msg];
  db.query(q, [values], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/query", (req, res) => {
  const q = "select * from query";
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.delete("/query/:id", (req, res) => {
  const q_id = req.params.id;
  const q = "delete from query where q_id=?";
  db.query(q, [q_id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json("deletation done");
  });
});

// add in order table
app.post("/cart/:id", async (req, res) => {
  const username = req.params.id;
  const values = req.body;
  console.log(username);
  console.log(values);
  
  const dt = [
    username,
    values.id,
    values.name,
    values.price,
    values.quantity,
    values.category,
    "order placed",
  ];

  // const q =
  //   "insert into orders (`username`,`item_id`,`name`,`price`,`quantity`,`category`,`status`) values (?)";
  //  db.query(q, [dt], async(err, data) => {
  //   if (err) {
  //     return res.json(err);
  //   }
  //   // console.log("order placed");
    // return res.json("insert into orders");
  // });
});


app.post("/login", (req, res) => {
  const username = req.body.username;
  // const values = [username];
  // console.log(values);
  const q = "select password from users where username=? or email=?";
  db.query(q, [username, username], (err, data) => {
    if (err) {
      return res.json(err);
    }
    // console.log(data);
    return res.send(data);
  });
});

app.post("/logincheck", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  // const values = [username, email];
  // console.log(values);
  const q = "select username , email from users where username=? or email=?";
  db.query(q, [username, email], (err, data) => {
    if (err) {
      return res.json(err);
    }
    // console.log(data);
    return res.send(data);
  });
});

app.post("/registration", (req, res) => {
  const data = req.body;
  // console.log(data);
  const values = [
    data.username,
    data.email,
    data.name,
    data.phone,
    data.address,
    data.password,
  ];
  // console.log(values);
  const q =
    "insert into users (`username`,`email`,`name`,`phone`,`address`,`password`) values (?)";

  db.query(q, [values], (err, data) => {
    if (err) {
      return res.json(err);
    }
    // console.log(data);
    return res.send(data);
  });
});

app.listen(process.env.PORT, () => {
  console.log("connected to backend");
});
