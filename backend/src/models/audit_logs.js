const { DataTypes } = require('sequelize');

const AuditLogs = (sequelize) => {
  const auditlogs = sequelize.define('audit_logs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    admin_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target_id: {
      type: DataTypes.UUID
    },
    target_table: {
      type: DataTypes.STRING
    },
    details: {
      type: DataTypes.JSONB
    },
    ip_address: {
      type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'audit_logs',
    timestamps: false
  });

  return auditlogs;
};

module.exports = AuditLogs;
