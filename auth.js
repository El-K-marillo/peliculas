import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables del archivo .env

const SECRET_KEY = process.env.SECRET_KEY || 'clave_temporal_de_respaldo';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ mensaje: 'Acceso denegado: No se proporcionó un token' });
    }

    try {
        const verificado = jwt.verify(token, SECRET_KEY);
        req.user = verificado;
        next();
    } catch (error) {
        res.status(403).send({ mensaje: 'Token no válido o expirado' });
    }
};

export { SECRET_KEY };