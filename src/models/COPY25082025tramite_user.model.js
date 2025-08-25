/*const pool = require("../db");

// Crear trámite
async function createTramite({ usuarioCreador, oficinaCreador, tipoTramite, descripcion, enviarDirecto, usuarioDestino, oficinaDestino }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO tramites (
          id_usuario_creador, id_oficina_creador, tipo_tramite, descripcion, id_estado_actual, fecha_creacion, fecha_actualizacion
       ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id_tramite`,
      [usuarioCreador, oficinaCreador, tipoTramite, descripcion, enviarDirecto ? 2 : 1]
    );

    const idTramite = result.rows[0].id_tramite;

    if (enviarDirecto) {
      await client.query(
        `INSERT INTO detalle_tramite (
           id_tramite, id_usuario_origen, id_oficina_origen, id_usuario_destino, id_oficina_destino, estado_movimiento, fecha_movimiento
         ) VALUES ($1, $2, $3, $4, $5, 'Derivado', NOW())`,
        [idTramite, usuarioCreador, oficinaCreador, usuarioDestino, oficinaDestino]
      );
    }

    await client.query("COMMIT");
    return idTramite;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Enviar trámites en bloque
async function enviarTramites({ usuarioOrigen, oficinaOrigen, tramitesIds, usuarioDestino, oficinaDestino }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (let idTramite of tramitesIds) {
      await client.query(
        `UPDATE tramites 
         SET id_estado_actual = 2, id_usuario_actual = $1, id_oficina_actual = $2, fecha_actualizacion = NOW()
         WHERE id_tramite = $3`,
        [usuarioDestino, oficinaDestino, idTramite]
      );

      await client.query(
        `INSERT INTO detalle_tramite (
           id_tramite, id_usuario_origen, id_oficina_origen, id_usuario_destino, id_oficina_destino, estado_movimiento, fecha_movimiento
         ) VALUES ($1, $2, $3, $4, $5, 'Derivado', NOW())`,
        [idTramite, usuarioOrigen, oficinaOrigen, usuarioDestino, oficinaDestino]
      );
    }

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Obtener trámites pendientes de un usuario
async function getPendientes(usuarioId) {
  const result = await pool.query(
    `SELECT * FROM tramites 
     WHERE id_usuario_creador = $1 AND id_estado_actual = 1`,
    [usuarioId]
  );
  return result.rows;
}

//------------------------


//--------------------este es ultimo----------------------------------
// 1. Trámites creados por el usuario
 async function getTramitesCreados(usuarioId) {
  const result = await pool.query(
    `SELECT t.*, e.nombre AS estado_nombre
     FROM tramites t
     JOIN estados_tramite e ON t.id_estado_actual = e.id
     WHERE t.id_usuario_creador = $1`,
    [usuarioId]
  );
  return result.rows;
}

// 2. Trámites recibidos (estado = Recibido)
 async function getTramitesRecibidos(usuarioId) {
  const result = await pool.query(
    `SELECT t.*, d.fecha_movimiento, d.observaciones
     FROM tramites t
     JOIN detalle_tramite d ON t.id_tramite = d.id_tramite
     WHERE d.id_usuario_destino = $1 
       AND t.id_estado_actual = 3`, // Recibido
    [usuarioId]
  );
  return result.rows;
}

// 3. Trámites pendientes por recibir (enviados pero no recibidos todavía)
 async function getTramitesPendientes(usuarioId) {
  const result = await pool.query(
    `SELECT t.*, d.fecha_movimiento, d.observaciones
     FROM tramites t
     JOIN detalle_tramite d ON t.id_tramite = d.id_tramite
     WHERE d.id_usuario_destino = $1 
       AND t.id_estado_actual=2`,  // Aún no recibido
    [usuarioId]
  );
  return result.rows;
}

// 4. Trámites derivados por el usuario
 async function getTramitesDerivados(usuarioId) {
  const result = await pool.query(
    `SELECT t.*, d.fecha_movimiento, d.observaciones
     FROM tramites t
     JOIN detalle_tramite d ON t.id_tramite = d.id_tramite
     WHERE d.id_usuario_origen = $1 
       AND t.id_estado_actual = 2`, // Derivado
    [usuarioId]
  );
  return result.rows;
}

//------------------------este es que que se complemento..

// Crear un trámite
async function crearTramite({ titulo, descripcion, id_usuario_creador }) {
  const result = await pool.query(
    `INSERT INTO tramites (titulo, descripcion, id_usuario_creador, id_estado_actual, fecha_creacion)
     VALUES ($1, $2, $3, 1, NOW())  -- estado 1 = creado
     RETURNING *`,
    [titulo, descripcion, id_usuario_creador]
  );
  return result.rows[0];
}

// Derivar trámite
async function derivarTramite({ id_tramite, id_usuario_origen, id_usuario_destino, observaciones }) {
  const result = await pool.query(
    `INSERT INTO detalle_tramite (id_tramite, id_usuario_origen, id_usuario_destino, observaciones, fecha_movimiento)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING *`,
    [id_tramite, id_usuario_origen, id_usuario_destino, observaciones]
  );

  // Actualizar estado a "derivado" (2)
  await pool.query(
    `UPDATE tramites SET id_estado_actual = 2 WHERE id_tramite = $1`,
    [id_tramite]
  );

  return result.rows[0];
}

// Recibir trámite
async function recibirTramite({ id_tramite, id_usuario_destino }) {
  // Validar que el trámite estaba derivado a este usuario
  const result = await pool.query(
    `UPDATE tramites
     SET id_estado_actual = 3  -- recibido
     WHERE id_tramite = $1
       AND id_estado_actual = 2
     RETURNING *`,
    [id_tramite]
  );

  return result.rows[0];
}



module.exports = {
  createTramite,
  enviarTramites,
  getPendientes,

  getTramitesCreados,
  getTramitesRecibidos,
  getTramitesPendientes,
  getTramitesDerivados,
  crearTramite,
  derivarTramite,
  recibirTramite

};
*/
const pool = require("../db");

// rolo: Crear trámite
async function createTramite({
  id_usuario_creador,
  id_oficina_creador,
  tipo_tramite,
  descripcion,
  enviarDirecto,
  id_usuario_destino,
  id_oficina_destino
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO tramites (
          id_usuario_creador, id_oficina_creador, tipo_tramite, descripcion, id_estado_actual, fecha_creacion, fecha_actualizacion
       ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id_tramite`,
      [id_usuario_creador, id_oficina_creador, tipo_tramite, descripcion, enviarDirecto ? 2 : 1]
    );

    const idTramite = result.rows[0].id_tramite;

    if (enviarDirecto) {
      await client.query(
        `INSERT INTO detalle_tramite (
           id_tramite, id_usuario_origen, id_oficina_origen, id_usuario_destino, id_oficina_destino, estado_movimiento, fecha_movimiento
         ) VALUES ($1, $2, $3, $4, $5, 'Derivado', NOW())`,
        [idTramite, id_usuario_creador, id_oficina_creador, id_usuario_destino, id_oficina_destino]
      );

      // Actualizar el trámite con el usuario y oficina actual
      await client.query(
        `UPDATE tramites 
         SET id_usuario_actual = $1, id_oficina_actual = $2, fecha_actualizacion = NOW()
         WHERE id_tramite = $3`,
        [id_usuario_destino, id_oficina_destino, idTramite]
      );
    }

    await client.query("COMMIT");
    return idTramite;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Enviar trámites en bloque
async function derivarTramite({
  usuarioOrigen,
  oficinaOrigen,
  tramitesIds,
  usuarioDestino,
  oficinaDestino
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (let idTramite of tramitesIds) {
      await client.query(
        `UPDATE tramites 
         SET id_estado_actual = 2, id_usuario_actual = $1, id_oficina_actual = $2, fecha_actualizacion = NOW()
         WHERE id_tramite = $3`,
        [usuarioDestino, oficinaDestino, idTramite]
      );

      await client.query(
        `INSERT INTO detalle_tramite (
           id_tramite, id_usuario_origen, id_oficina_origen, id_usuario_destino, id_oficina_destino, estado_movimiento, fecha_movimiento
         ) VALUES ($1, $2, $3, $4, $5, 'Derivado', NOW())`,
        [idTramite, usuarioOrigen, oficinaOrigen, usuarioDestino, oficinaDestino]
      );
    }

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Recibir trámite (cambia estado a "Recibido")
async function recibirTramite({ idTramite, idUsuario, idOficina, observaciones = null }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Actualizar estado del trámite
    await client.query(
      `UPDATE tramites 
       SET id_estado_actual = 3, fecha_actualizacion = NOW()
       WHERE id_tramite = $1`,
      [idTramite]
    );

    // Registrar el movimiento de recepción
    await client.query(
      `INSERT INTO detalle_tramite (
         id_tramite, id_usuario_origen, id_oficina_origen, id_usuario_destino, id_oficina_destino, 
         estado_movimiento, observaciones, fecha_movimiento
       ) VALUES ($1, $2, $3, $2, $3, 'Recibido', $4, NOW())`,
      [idTramite, idUsuario, idOficina, observaciones]
    );

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Revertir trámite (devolver al remitente)
async function revertirTramite({ idTramite, idUsuarioSolicitante, motivo, observacion, idDetalle }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Obtener información del último movimiento para revertir
    const movimientoResult = await client.query(
      `SELECT id_usuario_origen, id_oficina_origen 
       FROM detalle_tramite 
       WHERE id_detalle = $1`,
      [idDetalle]
    );

    if (movimientoResult.rows.length === 0) {
      throw new Error("Movimiento no encontrado");
    }

    const { id_usuario_origen, id_oficina_origen } = movimientoResult.rows[0];

    // Actualizar estado del trámite a "Revertido"
    await client.query(
      `UPDATE tramites 
       SET id_estado_actual = 4, id_usuario_actual = $1, id_oficina_actual = $2, fecha_actualizacion = NOW()
       WHERE id_tramite = $3`,
      [id_usuario_origen, id_oficina_origen, idTramite]
    );

    // Registrar movimiento de reversión
    await client.query(
      `INSERT INTO detalle_tramite (
         id_tramite, id_usuario_origen, id_oficina_origen, id_usuario_destino, id_oficina_destino, 
         estado_movimiento, observaciones, fecha_movimiento
       ) VALUES ($1, $2, $3, $4, $5, 'Revertido', $6, NOW())`,
      [idTramite, idUsuarioSolicitante, idUsuarioSolicitante, id_usuario_origen, id_oficina_origen, observacion]
    );

    // Registrar en la tabla de revertidos_ampliado
    await client.query(
      `INSERT INTO revertidos_ampliado (
         id_detalle, id_user_solicitante, motivo, observacion, fecha_reversion, 
         id_estado_registro, usuario_registro
       ) VALUES ($1, $2, $3, $4, NOW(), 1, $2)`,
      [idDetalle, idUsuarioSolicitante, motivo, observacion]
    );

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Finalizar trámite
async function finalizarTramite({ idTramite, idUsuario, idOficina, observaciones = null }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Actualizar estado del trámite a "Finalizado"
    await client.query(
      `UPDATE tramites 
       SET id_estado_actual = 5, fecha_actualizacion = NOW()
       WHERE id_tramite = $1`,
      [idTramite]
    );

    // Registrar el movimiento de finalización
    await client.query(
      `INSERT INTO detalle_tramite (
         id_tramite, id_usuario_origen, id_oficina_origen, id_usuario_destino, id_oficina_destino, 
         estado_movimiento, observaciones, fecha_movimiento
       ) VALUES ($1, $2, $3, $2, $3, 'Finalizado', $4, NOW())`,
      [idTramite, idUsuario, idOficina, observaciones]
    );

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Obtener trámites pendientes de un usuario (no enviados)
async function getPendientes(usuarioId) {
  const result = await pool.query(
    `SELECT t.*, e.nombre as estado_nombre
     FROM tramites t
     JOIN estados_tramite e ON t.id_estado_actual = e.id
     WHERE t.id_usuario_creador = $1 AND t.id_estado_actual = 1`,
    [usuarioId]
  );
  return result.rows;
}

// 1. Trámites creados por el usuario
async function getTramitesCreados(usuarioId) {
  const result = await pool.query(
    `SELECT t.*, e.nombre AS estado_nombre
     FROM tramites t
     JOIN estados_tramite e ON t.id_estado_actual = e.id
     WHERE t.id_usuario_creador = $1
     ORDER BY t.fecha_creacion DESC`,
    [usuarioId]
  );
  return result.rows;
}

// 2. Trámites recibidos (estado = Recibido)
async function getTramitesRecibidos(usuarioId) {
  const result = await pool.query(
    `SELECT t.*, e.nombre as estado_nombre, d.fecha_movimiento, d.observaciones,
            uo.name as usuario_origen, oo.nombre as oficina_origen
     FROM tramites t
     JOIN estados_tramite e ON t.id_estado_actual = e.id
     JOIN LATERAL (
        SELECT d1.*
        FROM detalle_tramite d1
        WHERE d1.id_tramite = t.id_tramite
          AND d1.estado_movimiento = 'Recibido'
        ORDER BY d1.fecha_movimiento DESC
        LIMIT 1
     ) d ON true
     JOIN users uo ON d.id_usuario_origen = uo.id
     JOIN oficinas oo ON d.id_oficina_origen = oo.id
     WHERE t.id_usuario_actual = $1 
       AND t.id_estado_actual = 3
     ORDER BY d.fecha_movimiento DESC`,
    [usuarioId]
  );
  return result.rows;
}

// 3. Trámites pendientes por recibir (enviados pero no recibidos todavía)
async function getTramitesPendientesRecepcion(usuarioId) {
  const result = await pool.query(
    `SELECT 
        t.*,
        e.nombre AS estado_nombre,
        d.fecha_movimiento,
        d.observaciones,
        uo.name AS usuario_origen,
        oo.nombre AS oficina_origen
     FROM tramites t
     JOIN estados_tramite e ON t.id_estado_actual = e.id
     -- Traer solo el ÚLTIMO movimiento de derivación
     JOIN LATERAL (
        SELECT d1.*
        FROM detalle_tramite d1
        WHERE d1.id_tramite = t.id_tramite
          AND d1.estado_movimiento IN ('Derivado','Revertido')
        ORDER BY d1.fecha_movimiento DESC
        LIMIT 1
     ) d ON true
     JOIN users uo ON d.id_usuario_origen = uo.id
     JOIN oficinas oo ON d.id_oficina_origen = oo.id
     WHERE t.id_usuario_actual = $1 
       AND t.id_estado_actual = 2
     ORDER BY d.fecha_movimiento DESC`,
    [usuarioId]
  );
  return result.rows;
}




// 4. Trámites derivados por el usuario

async function getTramitesDerivados(usuarioId) {
  const result = await pool.query(
    `SELECT t.*, e.nombre as estado_nombre, d.fecha_movimiento, d.observaciones,
            ud.name as usuario_destino, od.nombre as oficina_destino
     FROM tramites t
     JOIN estados_tramite e ON t.id_estado_actual = e.id
     JOIN detalle_tramite d ON t.id_tramite = d.id_tramite
     JOIN users ud ON d.id_usuario_destino = ud.id
     JOIN oficinas od ON d.id_oficina_destino = od.id
     WHERE d.id_usuario_origen = $1 
       AND t.id_estado_actual = 2
     ORDER BY d.fecha_movimiento DESC`,
    [usuarioId]
  );
  return result.rows;




}
/*
// Obtener historial completo de un trámite
async function getHistorialTramite(idTramite) {
  const result = await pool.query(
    `SELECT dt.*, 
            uo.name as usuario_origen_nombre, oo.nombre as oficina_origen_nombre,
            ud.name as usuario_destino_nombre, od.nombre as oficina_destino_nombre
     FROM detalle_tramite dt
     LEFT JOIN users uo ON dt.id_usuario_origen = uo.id
     LEFT JOIN oficinas oo ON dt.id_oficina_origen = oo.id
     LEFT JOIN users ud ON dt.id_usuario_destino = ud.id
     LEFT JOIN oficinas od ON dt.id_oficina_destino = od.id
     WHERE dt.id_tramite = $1
     ORDER BY dt.fecha_movimiento ASC`,
    [idTramite]
  );
  return result.rows;
}
*/

// Verificar si usuario tiene permiso para una acción
async function verificarPermiso(usuarioId, permisoNombre) {
  const result = await pool.query(
    `SELECT COUNT(*) > 0 as tiene_permiso
     FROM (
       SELECT p.id 
       FROM usuario_permiso up
       JOIN permiso p ON up.permiso_id = p.id
       WHERE up.usuario_id = $1 AND p.nombre = $2
       
       UNION
       
       SELECT p.id 
       FROM rol_permiso rp
       JOIN permiso p ON rp.permiso_id = p.id
       JOIN users u ON u.role_id = rp.rol_id
       WHERE u.id = $1 AND p.nombre = $2
     ) permisos`,
    [usuarioId, permisoNombre]
  );

  return result.rows[0].tiene_permiso;
}


//  Recibir trámite
async function recibirTramite({ idTramite, idUsuario, idOficina, observaciones = null }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Cambiar estado a Recibido (3)
    await client.query(
      `UPDATE tramites 
       SET id_estado_actual = 3, fecha_actualizacion = NOW()
       WHERE id_tramite = $1`,
      [idTramite]
    );

    // Insertar en detalle_tramite
    await client.query(
      `INSERT INTO detalle_tramite (
         id_tramite, id_usuario_origen, id_oficina_origen, id_usuario_destino, id_oficina_destino, 
         estado_movimiento, observaciones, fecha_movimiento
       ) VALUES ($1, $2, $3, $2, $3, 'Recibido', $4, NOW())`,
      [idTramite, idUsuario, idOficina, observaciones]
    );

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}



// Revertir trámite (sin pedir idDetalle al cliente)
async function revertirTramite({ idTramite, idUsuarioSolicitante, motivo, observacion }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Buscar el último movimiento de derivación del trámite
    const movimiento = await client.query(
      `SELECT id_detalle, id_usuario_origen, id_oficina_origen
       FROM detalle_tramite
       WHERE id_tramite = $1
         AND estado_movimiento = 'Derivado'
       ORDER BY fecha_movimiento DESC
       LIMIT 1`,
      [idTramite]
    );

    if (movimiento.rows.length === 0) {
      throw new Error("No se encontró un movimiento de derivación para revertir");
    }

    const { id_detalle, id_usuario_origen, id_oficina_origen } = movimiento.rows[0];

    // Actualizar estado del trámite a Revertido
    await client.query(
      `UPDATE tramites
       SET id_estado_actual = 2, 
           id_usuario_actual = $1,
           id_oficina_actual = $2,
           fecha_actualizacion = NOW()
       WHERE id_tramite = $3`,
      [id_usuario_origen, id_oficina_origen, idTramite]
    );

    // Insertar en detalle_tramite el registro de reversión
    await client.query(
      `INSERT INTO detalle_tramite (
         id_tramite, id_usuario_origen, id_oficina_origen, id_usuario_destino, id_oficina_destino,
         estado_movimiento, observaciones, fecha_movimiento
       ) VALUES ($1, $2, $3, $4, $5, 'Revertido', $6, NOW())`,
      [idTramite, idUsuarioSolicitante, id_oficina_origen, id_usuario_origen, id_oficina_origen, observacion]
    );

    // Registrar detalle extra en revertidos_ampliado
    await client.query(
      `INSERT INTO revertidos_ampliado (
         id_detalle, id_user_solicitante, motivo, observacion, fecha_reversion, id_estado_registro, usuario_registro
       ) VALUES ($1, $2, $3, $4, NOW(), 1, $2)`,
      [id_detalle, idUsuarioSolicitante, motivo, observacion]
    );

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}





//  Historial de un trámite

// models/tramite_user.model.js
async function getHistorialTramite(idTramite) {
  const result = await pool.query(
    `SELECT 
        dt.id_detalle,
        dt.id_tramite,
        dt.estado_movimiento,
        dt.observaciones,
        dt.fecha_movimiento,
        uo.name AS usuario_origen_nombre,
        oo.nombre AS oficina_origen_nombre,
        ud.name AS usuario_destino_nombre,
        od.nombre AS oficina_destino_nombre,
        ra.motivo AS motivo_reversion,
        ra.observacion AS detalle_reversion
     FROM detalle_tramite dt
     LEFT JOIN users uo ON dt.id_usuario_origen = uo.id
     LEFT JOIN oficinas oo ON dt.id_oficina_origen = oo.id
     LEFT JOIN users ud ON dt.id_usuario_destino = ud.id
     LEFT JOIN oficinas od ON dt.id_oficina_destino = od.id
     LEFT JOIN revertidos_ampliado ra ON ra.id_detalle = dt.id_detalle
     WHERE dt.id_tramite = $1
     ORDER BY dt.fecha_movimiento ASC`,
    [idTramite]
  );
  return result.rows;
}



module.exports = {
  createTramite,
  derivarTramite,
  recibirTramite,
  revertirTramite,
  finalizarTramite,
  getPendientes,
  getTramitesCreados,
  getTramitesRecibidos,
  getTramitesPendientesRecepcion,
  getTramitesDerivados,
  getHistorialTramite,
  verificarPermiso,

 
};