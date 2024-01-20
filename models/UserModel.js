import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Name cannot be empty"
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Email cannot be empty"
            },
            isEmail: {
                msg: "Invalid email format"
            }
        }
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Gender cannot be empty"
            }
        }
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true
});

export default User;

(async () => {
    await db.sync();
})();
