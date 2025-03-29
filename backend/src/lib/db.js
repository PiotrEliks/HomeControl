import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRESQL_URI, {
    dialect: "postgres",
    dialectOprions: {
        ssl: true
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