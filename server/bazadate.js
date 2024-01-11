const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./bazadate.db",
    define: {
        timestamps: false
    } 
});

const Users = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usertype: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    initialAutoIncrement: 1,
}
);

const Bugs = sequelize.define('bugs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creationdate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    commitLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    allocatedto: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fixLink: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    initialAutoIncrement: 1,
});

Bugs.belongsTo(Users, {onDelete: 'CASCADE'}); // This adds a userID column to the Bugs table

const Projects = sequelize.define('projects', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    additionalMembers: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    initialAutoIncrement: 1,
});

Projects.belongsTo(Users, {onDelete : 'CASCADE'}); // This adds a userID column to the Bugs table
Bugs.belongsTo(Projects, {onDelete: 'CASCADE'}); // This adds a project

async function initialize(){
    await sequelize.authenticate();
    await sequelize.sync({alter: true});
}

module.exports = {initialize, Users, Bugs, Projects};