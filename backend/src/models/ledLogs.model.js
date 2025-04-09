import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const LedLogs = sequelize.define('LedLogs', {
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
    tableName: 'LedLogs',
    timestamps: true
});

export default LedLogs;