import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pelicula, Usuario } from './db.js'; 
import { verificarToken, SECRET_KEY } from './auth.js';

const port = 3000
const app = express()

app.use(express.json())

// Endpoints

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { username } });
        if (!usuario) return res.status(404).send({ mensaje: 'Usuario no encontrado' });

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) return res.status(401).send({ mensaje: 'Contraseña incorrecta' });

        // Generar Token
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.send({ mensaje: 'Login exitoso', token });
    } catch (error) {
        res.status(500).send({ mensaje: 'Error en el servidor' });
    }
});

app.get('/peliculas', verificarToken, async (req, res) => {
    const resultado = await Pelicula.findAll();
    res.send(resultado);
});

// 2. Obtener una película por ID (EL QUE FALTABA)
app.get('/peliculas/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    try {
        const pelicula = await Pelicula.findByPk(id);
        if (!pelicula) return res.status(404).send({ mensaje: 'Película no encontrada' });
        res.send(pelicula);
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al obtener la película', error: error.message });
    }
});

app.post('/peliculas', verificarToken, async (req, res) => {
    const resultado = await Pelicula.create(req.body);
    res.status(201).send(resultado);
});

app.put('/peliculas/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const [filasActualizadas] = await Pelicula.update(req.body, { where: { id } });

    if (filasActualizadas === 0) return res.status(404).send({ mensaje: 'Película no encontrada' });
    res.send({ mensaje: 'Película actualizada' });
});

app.delete('/peliculas/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const filasEliminadas = await Pelicula.destroy({ where: { id } });

    if (filasEliminadas === 0) return res.status(404).send({ mensaje: 'Película no encontrada' });
    res.send({ mensaje: 'Película eliminada' });
});

app.listen(port, () => {
    console.log('Servidor iniciado en puerto: ', port)
})