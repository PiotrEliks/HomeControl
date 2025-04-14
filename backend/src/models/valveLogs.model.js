import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const ValveLogs = sequelize.define('ValveLogs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'ValveLogs',
    timestamps: true
});

export default ValveLogs;