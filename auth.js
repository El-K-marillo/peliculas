import jwt from 'jsonwebtoken';

const SECRET_KEY = 'tu_clave_secreta_super_segura'; // En producción usa variables de entorno (.env)

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (!token) {
        return res.status(401).send({ mensaje: 'Acceso denegado: No se proporcionó un token' });
    }

    try {
        const verificado = jwt.verify(token, SECRET_KEY);
        req.user = verificado; // Guardamos los datos del usuario en el request
        next();
    } catch (error) {
        res.status(403).send({ mensaje: 'Token no válido o expirado' });
    }
};

export { SECRET_KEY };