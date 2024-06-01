import _, { includes } from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";


const { roles, loginLocation,users } = db;
const Op = db.Sequelize.Op;

const LoginLocationController = () => {
    const create = async (req, res) => {

        const reqObj = helpers.getReqValues(req);
        console.log(reqObj);
        if (!reqObj.userId) {
            return helpers.appresponse(
                res,
                404,
                false,
                null,
                "User Id is required"
            );
        }
        if (!reqObj.latitude) {
            return helpers.appresponse(
                res,
                404,
                false,
                null,
                "latitude Type is required."
            );
        }
        if (!reqObj.longitude) {
            return helpers.appresponse(
                res,
                404,
                false,
                null,
                "longitude Type is required."
            );
        }
        if (!reqObj.ipAddress) {
            return helpers.appresponse(
                res,
                404,
                false,
                null,
                "ipaddress Type is required."
            );
        }
        if (!reqObj.deviceId) {
            return helpers.appresponse(
                res,
                404,
                false,
                null,
                "device id Type is required."
            );
        }
        if (!reqObj.isActive) {
            return helpers.appresponse(
                res,
                404,
                false,
                null,
                "isActive Type is required."
            );
        }
        if (!reqObj.deviceType) {
            return helpers.appresponse(
                res,
                404,
                false,
                null,
                "device Type is required."
            );
        }

        const authHeader = req.headers.authorization;
        // console.log("authHeader--->", authHeader);
        let createdByUserId = await helpers.getUserId(authHeader);
        console.log("createdByUserId-->", createdByUserId);
        if (createdByUserId && createdByUserId !== undefined) {
            reqObj.createdAt = Date.now();
            reqObj.createdBy = createdByUserId;
        }
        await loginLocation
            .update(
                {
                    isActive: false,
                },
                {
                    where: {
                        userId: reqObj.userId,
                    },
                }
            )

        await loginLocation.create(reqObj).then(async (data) => {


            return helpers.appresponse(
                res,
                200,
                true,
                data,
                "location added successfully."
            );

        })
            .catch((err) => {
                return helpers.appresponse(res, 404, false, null, err.message);
            });



    }

    const getActiveLocation = async (req, res) => {
        const reqObj = helpers.getReqValues(req);
        console.log(reqObj);
        if (!reqObj.userId) {
            return helpers.appresponse(
                res,
                404,
                false,
                null,
                "User Id is required"
            );
        }

        await loginLocation.findAll({
            where :{
                userId : reqObj.userId,
                isActive : true
            },
            include: [users],
        }).then((locationData) => {

            if(locationData.length === 0)
            {
                return helpers.appresponse(
                    res,
                    200,
                    true,
                    [],
                    "No location found."
                );
            }
            else{
                return helpers.appresponse(
                    res,
                    200,
                    true,
                    locationData,
                    "location listed successfully."
                );
            }
          


        }).catch((err) => {
            return helpers.appresponse(res, 404, false, null, err.message);
        });


    }

    
    const getAllLocation = async (req, res) => {


        await loginLocation.findAll({
           
            include: [users],
        }).then((locationData) => {

            if(locationData.length === 0)
            {
                return helpers.appresponse(
                    res,
                    200,
                    true,
                    [],
                    "No location found."
                );
            }
            else{
                return helpers.appresponse(
                    res,
                    200,
                    true,
                    locationData,
                    "location listed successfully."
                );
            }
          


        }).catch((err) => {
            return helpers.appresponse(res, 404, false, null, err.message);
        });

    }


    return {

        create,
        getActiveLocation,
        getAllLocation,

    };
};

export default LoginLocationController();
