const { password } = require('pg/lib/defaults.js');
const pool = require('../db');

//const UserModel = {
  async function  findAll() {
    const res = await pool.query('SELECT * FROM users');
    return res.rows;
  }

  async function  findById(id) {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
  }

  async function  create({ name,lastnamep, lastnamem, ci, birthdate, sex, email, password ,role }) {
    const res = await pool.query(
      'INSERT INTO users (name,lastnamep, lastnamem, ci, birthdate, sex, email, password ,role) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [name,lastnamep, lastnamem, ci, birthdate, sex, email, password ,role ]
    );
    return res.rows[0];
  }

  async function  deleteById(id) {
    const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }

  async function updateById(id, data) {
  // Extraemos los campos que queremos actualizar (por ejemplo name y email)
  const { name,lastnamep, lastnamem, ci, birthdate, sex, email, password ,role} = data;
  console.log ("...........:", data)
  const res = await pool.query(
   //`UPDATE users SET name = $1, email = $2, password = $3 ,role = $4 WHERE id = $5 RETURNING *`,
     `UPDATE users SET name = $1,lastnamep =$2, lastnamem=$3, ci=$4, birthdate=$5, sex=$6, email = $7, password = $8 ,role = $9 WHERE id = $10 RETURNING *`,
   // [name, email, password,role,id]
    [name,lastnamep, lastnamem, ci, birthdate, sex, email, password ,role,id]
);

  return res.rows[0]; // Retorna el usuario actualizado o undefined si no existe
}


async function  loginUser (email, password) {

  const res = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password]
  );
  return res.rows[0]; 
};


 async function  getUserById (id) {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
  }



//};

module.exports = {
  findAll,
  findById,
  create,
  deleteById,  // exporta esta función
  updateById,
  loginUser,
  getUserById 
};