import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logging: false
});

// Modelo de Película
const Pelicula = db.define('Pelicula', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    director: { type: DataTypes.STRING, allowNull: false },
    fechaEstreno: { type: DataTypes.DATEONLY, allowNull: false }
});

// Modelo de Usuario
const Usuario = db.define('Usuario', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
});

async function iniciarDB() {
    try {
        // El { alter: true } le dice a Sequelize que actualice las tablas si hay cambios
        await db.sync({ alter: true }); 
        
        const adminExiste = await Usuario.findOne({ where: { username: 'admin' } });
        if (!adminExiste) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            await Usuario.create({ username: 'admin', password: hashedPassword });
            console.log('✅ Base de datos sincronizada y usuario admin creado.');
        } else {
            console.log('✅ Base de datos lista.');
        }
    } catch (error) {
        console.error('❌ Error al iniciar DB:', error);
    }
}

iniciarDB();

export { Pelicula, Usuario };