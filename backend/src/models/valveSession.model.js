import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const ValveSession = sequelize.define('ValveSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  openAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  closeAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  openedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  closedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  waterFlow: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
}, {
  tableName: 'ValveSessions',
  timestamps: true,
});

export default ValveSession;
