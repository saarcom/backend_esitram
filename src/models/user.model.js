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
/*
  const res = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password]
  );
  console.log("----", res.rows[0])
  return res.rows[0]; 
*/
const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (res.rows.length === 0) {
    return null; // Usuario no encontrado
  }

  const user = res.rows[0];

  // 2. Comparar contraseñas
 /* const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return null; // Contraseña incorrecta
  }*/

  // 3. Obtener permisos según rol
  let permisosRes;
  if (user.role_id === 1) {
    // Admin: todos los permisos del rol
    permisosRes = await pool.query(`
      SELECT p.nombre 
      FROM rol_permiso rp
      JOIN permiso p ON p.id = rp.permiso_id
      WHERE rp.rol_id = $1
    `, [user.role_id]);
  } else {
    // User: permisos delegados
    permisosRes = await pool.query(`
      SELECT p.nombre 
      FROM usuario_permiso up
      JOIN permiso p ON p.id = up.permiso_id
      WHERE up.usuario_id = $1
    `, [user.id]);
  }

  const permisos = permisosRes.rows.map(row => row.nombre);

    console.log("----", res.rows[0], permisos)
  //return res.rows[0],permisos; 
  return {user,permisos}

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