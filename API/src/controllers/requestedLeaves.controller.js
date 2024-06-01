import _ from "lodash";
import utils from "../services/utils.service";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import moment from "moment";
const excel = require("exceljs");

import QRCode from "qrcode";
import notificationService from "../services/notification.service";

const {
	users,
	companies,
	roles,
    leaves,
    requestedLeaves,
} = db;
const Op = db.Sequelize.Op;

const UserController = () => {


	
	const getById = async (req, res) => {
        const reqObj = helpers.getReqValues(req);
        if (!reqObj.id) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"id is required"
			);
		}
        await requestedLeaves
        .findAll({
            where: {
                userToId: reqObj.id,
               
                
            },
            include:[
                {
                    model:leaves,
                    required : true,
                    include : [{
                    model : users,
                        as : 'approver'
                    }]

                },
                {
                    model: users,
                    as: 'user'
                } ,
                
            ]
        })
        .then(async (Data) => {


            let userData = []
            for await (const obj of Data) {

                console.log("obnjjjjjj",obj)
                if(obj.userToId != obj.userId)
                {
                    userData.push(obj)
                }

            }


            var permissonData = []
			var otherLeaveData = []

			for await (const obj of userData) {
				if (obj.leave.status === "waiting") {
					permissonData.push(obj)
				}
				else {
					otherLeaveData.push(obj)
				}
			}

			permissonData.reverse()
			otherLeaveData.reverse()

			var leaveDatas = permissonData.concat(otherLeaveData)
            
            console.log(leaveDatas, "leaveDatas");
            return helpers.appresponse(
                res,
                200,
                true,
                leaveDatas,
                "Leaves listed successfully."
            );
        })
        .catch((err) => {
            return helpers.appresponse(res, 404, false, null, err.message);
        });


	};

    const getByIdRequestLeaves = async (req, res) => {
        const reqObj = helpers.getReqValues(req);
        if (!reqObj.id) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"id is required"
			);
		}

        const userObj = await users.findOne({
            where:{
                id : reqObj.id
            }
        })
        console.log("userObj",userObj)
        // if(userObj.roleId == 2 )
        // {
        //     console.log("called insided")
        //     leaves.findAll({
        //         where: {
        //             status: 'waiting',
        //             companyId: userObj.companyId
    
        //         },
        //         include: [{
        //             model: users,
        //             as: 'user',
        //             where: {
        //                 companyId: userObj.companyId
        //             },
                    
        //         },{
        //             model : users,
        //             as : 'approver'
        //         }]
        //     }).then((allData) => {
        //         return helpers.appresponse(res,
        //             200,
        //             true,
        //             allData,
        //             "success",
        //         );
        //     }).catch((err) => {
        //         return helpers.appresponse(res,
        //             404,
        //             false,
        //             null,
        //             err.message
        //         );
        //     })
            
        // }
        // else{
            await requestedLeaves
            .findAll({
                where: {
                    userToId: reqObj.id,
                   
                    
                },
                include:[
                    {
                        model:leaves,
                        required : true,
                        include : [{
                        model : users,
                            as : 'approver'
                        }]

                    },
                    {
                        model: users,
                        as: 'user'
                    } ,
                    
                ]
            })
            .then(async (Data) => {
    
    
                let userData = []
                for await (const obj of Data) {
    
                    console.log("obnjjjjjj",obj)
                    if(obj.userToId != obj.userId && obj.leave.status == 'waiting')
                    {
                        userData.push(obj)
                    }
    
                }
                console.log(Data, "Data");
                return helpers.appresponse(
                    res,
                    200,
                    true,
                    userData,
                    "Leaves listed successfully."
                );
            })
            .catch((err) => {
                return helpers.appresponse(res, 404, false, null, err.message);
            });
        // }
       


	};

    const getAllApprovedLeaves = async(req, res) =>{

        const reqObj = helpers.getReqValues(req);
        if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Company Id is required"
			);
		}
        leaves.findAll({
			where: {

				companyId: reqObj.companyId,

			},
			include: [

				//users,
				{
					model: users,
					required: false,
					as: 'user'
				},
				{
					model: users,
					as: 'approver'
				}
			]

		}).then(async (allData) => {
			
            let userData = []
            for await (const obj of allData) {

                console.log("obnjjjjjj",obj)
                if(obj.status != 'waiting')
                {
                    userData.push(obj)
                }

            }
          //  console.log(Data, "Data");
            return helpers.appresponse(
                res,
                200,
                true,
                userData,
                "Leaves listed successfully."
            );
		
        }).catch((err) => {
            return helpers.appresponse(res, 404, false, null, err.message);
        });
    }

    const getByIdLeaves = async (req, res) => {
        const reqObj = helpers.getReqValues(req);
        if (!reqObj.id) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"id is required"
			);
		}

        const userObj = await users.findOne({
            where:{
                id : reqObj.id
            }
        })
        console.log("userobj",userObj)
        // if(userObj.roleId == 2 )
        // {

        //     leaves.findAll({
        //         where: {
        //             companyId: userObj.companyId,
        //             status : [["approved","rejected"],]
        //         },
               
        //         include: [{
        //             model: users,
        //             as: 'user',
        //             where: {
        //                 companyId: userObj.companyId
        //             },
                    
        //         },{
        //             model : users,
        //             as : 'approver'
        //         }]
        //     }).then((leaveData) => {
        //         if (leaveData) {
        //             return helpers.appresponse(res,
        //                 200,
        //                 true,
        //                 leaveData,
        //                 "success",
        //             );
        //         } else {
        //             return helpers.appresponse(res,
        //                 404,
        //                 false,
        //                 [],
        //                 "No leave found for the user " + reqObj.id,
        //             );
        //         }
        //     }).catch((err) => {
        //         return helpers.appresponse(res,
        //             404,
        //             false,
        //             null,
        //             err.message
        //         );
        //     })
        // }
        // else{
            await requestedLeaves
            .findAll({
                where: {
                    userToId: reqObj.id,
                   
                    
                },
                include:[
                    {
                        model:leaves,
                        required : true,
                        include : [{
                        model : users,
                            as : 'approver'
                        }]

                    },
                    {
                        model: users,
                        as: 'user'
                    } ,
                    
                ]
            })
            .then(async (Data) => {
    
    
                let userData = []
                for await (const obj of Data) {
    
                    console.log("obnjjjjjj",obj)
                    if(obj.userToId != obj.userId && obj.leave.status != 'waiting')
                    {
                        userData.push(obj)
                    }
    
                }
                console.log(Data, "Data");
                return helpers.appresponse(
                    res,
                    200,
                    true,
                    userData,
                    "Leaves listed successfully."
                );
            })
            .catch((err) => {
                return helpers.appresponse(res, 404, false, null, err.message);
            });
        // }
       


	};
	

	return {
	
	
		
        getById,
        getByIdRequestLeaves,
        getByIdLeaves,
        getAllApprovedLeaves

	
	};
};

export default UserController();
