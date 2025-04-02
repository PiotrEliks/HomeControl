import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    days: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    hour: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    minute: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cronExpression: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cronJobId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'Schedules',
    timestamps: true
});

export default Schedule;