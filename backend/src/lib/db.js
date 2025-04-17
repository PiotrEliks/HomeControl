import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRESQL_URI, {
    dialect: "postgres",
    timezone: '+02:00',
    dialectOprions: {
        ssl: true,
        useUTC: false,
    }
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected");
    } catch (error) {
        console.error("PostgreSQL connection error: ", error);
    }
};

export default sequelize;