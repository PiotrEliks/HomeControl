import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Schedule = sequelize.define('Schedule', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
  },
  deviceId: { 
    type: DataTypes.STRING, 
    allowNull: false 
},
  days: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
  },
  openHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  openMinute: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  closeHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  closeMinute: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  openCronExpression: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  openCronJobId: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  closeCronExpression: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  closeCronJobId: {
      type: DataTypes.STRING,
      allowNull: false,
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