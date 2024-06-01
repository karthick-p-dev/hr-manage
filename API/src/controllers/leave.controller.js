import _ from "lodash";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";
import db from "../../config/sequelize";
import config from "../../config/config";
import moment from "moment";
import NotificationService from "../services/notification.service";
import notificationService from "../services/notification.service";
const excel = require("exceljs");
const {
	users,
	leaves,
	requestedLeaves,
	companies,
	projectUsers,
	teamusers,
	projects,
	teams,
	positions
} = db;
const Op = db.Sequelize.Op;
var requestedDate = moment(new Date()).format("DD.MM-YYYY ,h:mm:ss a");

const LeaveController = () => {
    const create = async (req, res) => {
        const reqObj = helpers.getReqValues(req);
        console.log(reqObj)
        if (!reqObj.request) {
            return helpers.appresponse(res,
                404,
                false,
                null,
                "Leave Request type is required"
            );
        }
        if (!reqObj.userId) {
            return helpers.appresponse(res,
                404,
                false,
                null,
                "userId is required"
            );
        }
        if (!reqObj.reason) {
            return helpers.appresponse(res,
                404,
                false,
                null,
                "Please specify reason"
            );
        }
        if (!reqObj.fromDate) {
            return helpers.appresponse(res,
                404,
                false,
                null,
                "fromDate is required"
            );
        }
        if (!reqObj.toDate) {
            return helpers.appresponse(res,
                404,
                false,
                null,
                "fromDate is required"
            );
        }
        if (reqObj.request == 'Permission' && !reqObj.fromTime) {
            return helpers.appresponse(res,
                404,
                false,
                null,
                "In Time is required"
            );
        }
        if (reqObj.request == 'Permission' && !reqObj.toTime) {
            return helpers.appresponse(res,
                404,
                false,
                null,
                "Out Time is required"
            );
        }
        reqObj.createdAt = Date.now();
        reqObj.status = "waiting";
        reqObj.updateddAt = Date.now();

        const dateArray = reqObj.fromDate.split('-');




        var checkFromDate = new Date(
            parseInt(dateArray[2]),
            parseInt(dateArray[1]) - 1,
            parseInt(dateArray[0]),
        );

        const todateArray = reqObj.toDate.split('-');




        var checkToDate = new Date(
            parseInt(todateArray[2]),
            parseInt(todateArray[1]) - 1,
            parseInt(todateArray[0]),
        );

        reqObj.fromDateFormat = checkFromDate
        reqObj.toDateFormat = checkToDate
        var userData = await users.findOne({
            where: {
                id: reqObj.userId
            },
        })

        if (!userData) {
            return helpers.appresponse(res, 404, false, [], "user not found for the povided email address");
        }


        reqObj.inTime = reqObj.inTime;
        reqObj.outTime = reqObj.outTime
        var emailArray = []
		emailArray.push(config.commonEmail)
		emailArray.push(userData.email)
	
		var notificationArray = []
        await leaves.create(reqObj).then(async (data) => {
            var name = userData.userName;
            var email = userData.email;
            var status = 'Not Yet approved';
            var reason = reqObj.reason;
            var startDate = reqObj.fromDate;
            var endDate = reqObj.toDate;
            var leaveType = reqObj.request;
            const maildata = {
                name: name,
                email: email,
                reason: reason,
                status: status,
                startDate: startDate,
                endDate: endDate,
                requestedDate: requestedDate,
                leaveType: leaveType,
                id: data.id,
                to: email, //need to add hr email here
                sub: "Leave Request Form"
            };


            //console.log(userData.email, "userDatavaalldd");

            const projectUserObj = await projectUsers.findAll({
                where: {
                    userId: reqObj.userId,
                    isActive: true
                },
                include: [{
                    model: projects,
                    include: [{
                        model: users,
                        as: 'teamleader'
                    }, {
                        model: users,
                        as: 'manager'
                    }]
                },]
            })


            //console.log("projectUserObj", projectUserObj.length)
            if (projectUserObj.length > 1) {
                const teamUserObj = await teamusers.findAll({
                    where: {
                        userId: reqObj.userId,
                        isActive: true
                    },
                    include: [{
                        model: teams,
                        include: [{
                            model: users,
                            as: 'teamleader'
                        }, {
                            model: users,
                            as: 'manager'
                        }]


                    },]
                })
                //console.log("teamUserObj", teamUserObj)

                const promises = teamUserObj.map(async (teamObj) => {

                    console.log("teamUser", teamObj.team)
                    var reqLeaveObj = {
                        "userToId": teamObj.team.teamLeaderId,
                        "userId": reqObj.userId,
                        "leaveId": data.id,
                        "createdAt": Date.now(),
                        "updateddAt": Date.now(),
                    }
                    console.log(teamObj.team.teamleader)
                    emailArray.push(teamObj.team.teamleader.email)
					notificationArray.push(teamObj.team.teamLeaderId)

                    await requestedLeaves.create(reqLeaveObj).then(async (reqdata) => {


                        //  NotificationService.trigerednotificationtoUsers(reqObj.companyId, teamObj.team.teamLeaderId,  userData.userName + " is applied for " + reqObj.request + " leave")
                        var reqLeaveManagerObj = {
                            "userToId": teamObj.team.teamManagerId,
                            "userId": reqObj.userId,
                            "leaveId": data.id,
                            "createdAt": Date.now(),
                            "updateddAt": Date.now(),
                        }

                        //  console.log("reqleavemanger", reqLeaveManagerObj)


                        if (teamObj.team.teamManagerId != teamObj.team.teamLeaderId) {
                            await requestedLeaves.create(reqLeaveManagerObj).then(async (reqdata) => {

                                //  NotificationService.trigerednotificationtoUsers(reqObj.companyId, teamObj.team.teamManagerId,  userData.userName + " is applied for " + reqObj.request + " leave")
                                emailArray.push(teamObj.team.manager.email)
								notificationArray.push(teamObj.team.teamManagerId)
                                console.log('called', teamObj.team.manager.email)

                            })
                        }

                    })



                })
                await Promise.all(promises);
                console.log("eamilaarrayemail", emailArray)


            }
            else {

                if (projectUserObj != 0) {
                    const promises = projectUserObj.map(async (projectObj) => {

                        //  console.log("proejct usersssss", projectObj.project)
                        var reqLeaveObj = {
                            "userToId": projectObj.project.teamleaderId,
                            "userId": reqObj.userId,
                            "leaveId": data.id,
                            "createdAt": Date.now(),
                            "updateddAt": Date.now(),
                        }
                        //console.log(projectObj.project.teamleader)
                        emailArray.push(projectObj.project.teamleader.email)
						notificationArray.push(projectObj.project.teamleaderId)
                        await requestedLeaves.create(reqLeaveObj).then(async (reqdata) => {


                            var reqLeaveManagerObj = {
                                "userToId": projectObj.project.managerId,
                                "userId": reqObj.userId,
                                "leaveId": data.id,
                                "createdAt": Date.now(),
                                "updateddAt": Date.now(),
                            }
                            //NotificationService.trigerednotificationtoUsers(reqObj.companyId,projectObj.project.teamleaderId,  userData.userName + " is applied for " + reqObj.request + " leave")

                            //console.log("reqleavemanger", reqLeaveManagerObj)


                            if (projectObj.project.managerId != projectObj.project.teamleaderId) {
                                await requestedLeaves.create(reqLeaveManagerObj).then(async (reqdata) => {
									notificationArray.push(projectObj.project.managerId)
                                    //  NotificationService.trigerednotificationtoUsers(reqObj.companyId,projectObj.project.managerId,  userData.userName + " is applied for " + reqObj.request + " leave")
                                    emailArray.push(projectObj.project.manager.email)
                                    //  console.log('called', projectObj.project.manager.email)

                                })
                            }

                        })



                    })
                    await Promise.all(promises);
                    console.log("eamilaarrayemail", emailArray)

                }
                else {

                    console.log('called else part')
                    const userObj = await users.findOne({
                        where: {
                            id: reqObj.userId,
                            isActive: true,
                        }
                    })

                    //console.log("userObj", userObj.positionId)

                    const positionList = await positions.findAll({
                        where: {
                            status: false
                        }

                    })

                    const projectLeaderObj = await projects.findAll({
                        where: {
                            teamleaderId: reqObj.userId,
							status : false
                        },
						include: [
							{
								model: users,
								as: "teamleader",
							},
							{
								model: users,
								as: "manager",
							},
						],
                    })

					console.log("project leaders",projectLeaderObj)
                    

                    if (projectLeaderObj.length == 0 || projectLeaderObj.length > 1) {

                        const teamLeaderObj = await teams.findAll({
                            where: {
                                teamLeaderId: reqObj.userId,
								status : false,
                            },
							include: [
								{
									model: users,
									as: "teamleader",
								},
								{
									model: users,
									as: "manager",
								},
							],
                        })

                        if(teamLeaderObj.length == 0)
                        {
                            var index = 1
                            var currentPostionId = userObj.positionId
                            var topPositionArray = []
                            while (index > 0 && index < 10) {
        
                                for (let i = 0; i < positionList.length; i++) {
                                    //  console.log("positionList[index]", positionList[i].id)
                                    //console.log("currentpositionID",currentPostionId)
                                    if (currentPostionId == positionList[i].id) {
                                        currentPostionId = positionList[i].parentId
                                        topPositionArray.push(positionList[i].parentId)
                                        break;
        
                                    }
                                }
        
                                if (currentPostionId == 0) {
                                    break;
                                }
        
                                index = index + 1
                            }
        
                            console.log("topPositionArray", topPositionArray)
                            for (let index = 0; index < topPositionArray.length; index++) {
                                let usersObj = await users.findAll({
                                    where: {
                                        positionId: topPositionArray[index],
                                        isActive: true
                                    }
                                })
        
                                //console.log("userobjposition", usersObj)
                                if (usersObj.length != 0) {
        
                                    const promises = usersObj.map(async (userSingleObj) => {
        
                                        var reqLeaveManagerObj = {
                                            "userToId": userSingleObj.id,
                                            "userId": reqObj.userId,
                                            "leaveId": data.id,
                                            "createdAt": Date.now(),
                                            "updateddAt": Date.now(),
                                        }
        
                                        //                              console.log("reqLeaveManagerObjreqLeaveManagerObj",reqLeaveManagerObj)
                                        await requestedLeaves.create(reqLeaveManagerObj).then(async (reqdata) => {
											notificationArray.push(userSingleObj.id)
                                            //NotificationService.trigerednotificationtoUsers(reqObj.companyId, userSingleObj.id,  userData.userName + " is applied for " + reqObj.request + " leave")
                                            emailArray.push(userSingleObj.email)
        
        
                                        })
        
        
        
        
                                    })
        
        
        
                                    await Promise.all(promises);
        
                                }
                            }
                        }
                        else{
                            const promises = teamLeaderObj.map(async (projectObj) => {

                                //  console.log("proejct usersssss", projectObj.project)
                                var reqLeaveObj = {
                                    "userToId": projectObj.teamManagerId,
                                    "userId": reqObj.userId,
                                    "leaveId": data.id,
                                    "createdAt": Date.now(),
                                    "updateddAt": Date.now(),
                                }
                                //console.log(projectObj.project.teamleader)
                                emailArray.push(projectObj.manager.email)
								notificationArray.push(projectObj.teamManagerId)
                                await requestedLeaves.create(reqLeaveObj).then(async (reqdata) => {
    
                                    //  NotificationService.trigerednotificationtoUsers(reqObj.companyId,projectObj.project.managerId,  userData.userName + " is applied for " + reqObj.request + " leave")
    
                                    //  console.log('called', projectObj.project.manager.email)
    
                                })
    
    
    
    
                            })
                            await Promise.all(promises);
                            
                        }



                    
                    }
                    else if(projectLeaderObj.length == 1){


                        const promises = projectLeaderObj.map(async (projectObj) => {

                              console.log("proejct usersssss", projectObj)
                            var reqLeaveObj = {
                                "userToId": projectObj.managerId,
                                "userId": reqObj.userId,
                                "leaveId": data.id,
                                "createdAt": Date.now(),
                                "updateddAt": Date.now(),
                            }
                            //console.log(projectObj.project.teamleader)
                            emailArray.push(projectObj.manager.email)
							notificationArray.push(projectObj.managerId)
                            await requestedLeaves.create(reqLeaveObj).then(async (reqdata) => {

                                //  NotificationService.trigerednotificationtoUsers(reqObj.companyId,projectObj.project.managerId,  userData.userName + " is applied for " + reqObj.request + " leave")

                                //  console.log('called', projectObj.project.manager.email)

                            })




                        })
                        await Promise.all(promises);

                        // const teamLeaderObj = teams.findAll({
                        //  where: {
                        //      teamLeaderId: reqObj.userId
                        //  }
                        // })

                        // if(teamLeaderObj.length > 0)
                        // {
                        //  const promises = teamLeaderObj.map(async (projectObj) => {

                        //      //  console.log("proejct usersssss", projectObj.project)
                        //      var reqLeaveObj = {
                        //          "userToId": projectObj.team.teamManagerId,
                        //          "userId": reqObj.userId,
                        //          "leaveId": data.id,
                        //          "createdAt": Date.now(),
                        //          "updateddAt": Date.now(),
                        //      }
                        //      //console.log(projectObj.project.teamleader)
                        //      emailArray.push(projectObj.team.manager.email)
    
                        //      await requestedLeaves.create(reqLeaveObj).then(async (reqdata) => {
    
                        //          //  NotificationService.trigerednotificationtoUsers(reqObj.companyId,projectObj.project.managerId,  userData.userName + " is applied for " + reqObj.request + " leave")
    
                        //          //  console.log('called', projectObj.project.manager.email)
    
                        //      })
    
    
    
    
                        //  })
                        //  await Promise.all(promises);
                        // }
                    }


                    //  console.log("posiition listttt", positionList)

                    // var index = 1
                    // var currentPostionId = userObj.positionId
                    // var topPositionArray = []
                    // while (index > 0 && index < 10) {

                    //  for (let i = 0; i < positionList.length; i++) {
                    //      //  console.log("positionList[index]", positionList[i].id)
                    //      //console.log("currentpositionID",currentPostionId)
                    //      if (currentPostionId == positionList[i].id) {
                    //          currentPostionId = positionList[i].parentId
                    //          topPositionArray.push(positionList[i].parentId)
                    //          break;

                    //      }
                    //  }

                    //  if (currentPostionId == 0) {
                    //      break;
                    //  }

                    //  index = index + 1
                    // }

                    // console.log("topPositionArray", topPositionArray)
                    // for (let index = 0; index < topPositionArray.length; index++) {
                    //  let usersObj = await users.findAll({
                    //      where: {
                    //          positionId: topPositionArray[index],
                    //          isActive: true
                    //      }
                    //  })

                    //  //console.log("userobjposition", usersObj)
                    //  if (usersObj.length != 0) {

                    //      const promises = usersObj.map(async (userSingleObj) => {

                    //          var reqLeaveManagerObj = {
                    //              "userToId": userSingleObj.id,
                    //              "userId": reqObj.userId,
                    //              "leaveId": data.id,
                    //              "createdAt": Date.now(),
                    //              "updateddAt": Date.now(),
                    //          }

                    //          //                              console.log("reqLeaveManagerObjreqLeaveManagerObj",reqLeaveManagerObj)
                    //          await requestedLeaves.create(reqLeaveManagerObj).then(async (reqdata) => {

                    //              //NotificationService.trigerednotificationtoUsers(reqObj.companyId, userSingleObj.id,  userData.userName + " is applied for " + reqObj.request + " leave")
                    //              emailArray.push(userSingleObj.email)


                    //          })




                    //      })



                    //      await Promise.all(promises);

                    //  }
                    // }


                }


            }

             //utils.sendLeaveRequest(maildata, emailArray)
            console.log("emailaRrray", emailArray)
			console.log("notifactionArray",notificationArray)

			for(let i = 0; i < notificationArray.length; i++)
			{
				const userObj = await users.findOne({
					where: {
						id: notificationArray[i],
						isActive: true,
					}
				})

			
				console.log("userss",userObj.userName,notificationArray[i])
			//	NotificationService.trigerednotificationtoUsers(reqObj.companyId,notificationArray[i],  userData.userName + " is applied for " + reqObj.request + " leave")	
			}
			


            //      //  var reqLeaveObj = {
            //      //      "userToId": teamObj.team.teamleaderId,
            //      //      "userId": reqObj.userId,
            //      //      "leaveId": data.id,
            //      //      "createdAt": Date.now(),
            //      //      "updateddAt": Date.now(),
            //      //  }
            //      //  console.log(teamObj.team.teamleader)
            //      //  emailArray.push(teamObj.team.teamleader.email)

            //      //  await requestedLeaves.create(reqLeaveObj).then(async (reqdata) => {


            //      //      var reqLeaveManagerObj = {
            //      //          "userToId": teamObj.team.managerId,
            //      //          "userId": reqObj.userId,
            //      //          "leaveId": data.id,
            //      //          "createdAt": Date.now(),
            //      //          "updateddAt": Date.now(),
            //      //      }

            //      //      console.log("reqleavemanger",reqLeaveManagerObj)


            //      //      await requestedLeaves.create(reqLeaveManagerObj).then(async (reqdata) => {


            //      //          emailArray.push(teamObj.team.manager.email)
            //      //          console.log('called',teamObj.team.manager.email)

            //      //      })
            //      //  })



            //      // })
            //      // await Promise.all(promises);
            //      // console.log("eamilaarrayemail",emailArray)   

            //  }




            //  // console.log("reqestid",reqObj.requestId)
            //  // await leaves.create(reqObj).then(async (data) => {
            //  //  var name = userData.userName;
            //  //  var email = userData.email;
            //  //  var status = 'Not Yet approved';
            //  //  var reason = reqObj.reason;
            //  //  var startDate = reqObj.fromDate;
            //  //  var endDate = reqObj.toDate;
            //  //  var leaveType = reqObj.request;
            //  //  const maildata = {
            //  //      name: name,
            //  //      email: email,
            //  //      reason: reason,
            //  //      status: status,
            //  //      startDate: startDate,
            //  //      endDate: endDate,
            //  //      requestedDate: requestedDate,
            //  //      leaveType: leaveType,
            //  //      id: data.id,
            //  //      to: email, //need to add hr email here
            //  //      sub: "Leave Request Form"
            //  //  };


            //  //  const emailArray = []



            //  //  // const projectUserObj = await projectUsers.findAll({
            //  //  //      where:{
            //  //  //          userId : reqObj.userId
            //  //  //      }
            //  //  // })

            //  //  // console.log("projectUserObj",projectUserObj)
            //  //  console.log("for loop before called")

            //  //  // const promises = reqObj.requestId.map(async (obj) => {

            //  //  //  var reqLeaveObj = {
            //  //  //      "userToId" : obj,
            //  //  //      "userId" : reqObj.userId,
            //  //  //      "leaveId" : data.id,
            //  //  //      "createdAt": Date.now(),
            //  //  //      "updateddAt": Date.now(),
            //  //  //  }

            //  //      console.log("first await called...****")
            //  //      // await requestedLeaves.create(reqLeaveObj).then(async (data) =>{

            //  //      //  console.log("dataa",data)
            //  //      // })

            //  //  //   await users.findOne({
            //  //  //      where :{
            //  //  //          id : obj
            //  //  //      }
            //  //  //  }).then(async (userData) => {
            //  //  //      console.log("userdata is to be : ",userData),
            //  //  //      emailArray.push(userData.email)
            //  //  //      console.log(emailArray,"emailArray");
            //  //  //  //  NotificationService.trigerednotificationtoUsers(reqObj.companyId,obj,  userData.userName + " is applied for " + reqObj.request + " leave")

            //  //  //  })
            //  //  // });
            //  //  // await Promise.all(promises);


            //  //  //  const companyData = await companies.findOne({
            //  //  //      where :{
            //  //  //          id : userData.companyId
            //  //  //      }
            //  //  //  })

            //  //  //  console.log("second await called...****")

            //  //  //   emailArray.push(config.commonEmail)
            //  //  //  emailArray.push(companyData.email)
            //  //  //  emailArray.push(email)

            //  //  //  console.log("emailArray after called",emailArray)
            //  //  //utils.sendCreateLeaveRequest(maildata, emailArray)



            //  //  //utils.sendLeaveRequest(maildata, email) //to send the user.
            //  // //   NotificationService.trigerednotificationtoadmins(reqObj.companyId, userData.userName + " is applied for " + reqObj.request + " leave")
            return helpers.appresponse(res,
                200,
                true,
                data,
                "Leave Request added successfully"
            );

        }).catch((err) => {
            return helpers.appresponse(res,
                404,
                false,
                null,
                err.message
            );
        });
    };


	const download = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request date is : " + reqObj.date);
		console.log(reqObj)
		console.log("leaves", leaves)
		console.log("request companyid is : " + reqObj.companyId)
		leaves.findAll({
			where: {
				companyId: reqObj.companyId
			},
			attributes: {
				exclude: []
			},
			include: [{
				model: users,
				required: false

			},]
		}).then(async (userData) => {

			if (!reqObj.fromDate && !reqObj.toDate) {
				let attendance = [];
				let slNo = 1;
				userData.forEach((obj) => {

					attendance.push({
						SNo: slNo,
						LeaveType: obj.dataValues.request,
						EmployeeCode: obj.dataValues.user.employeeId,
						Name: obj.dataValues.user.firstName + obj.dataValues.user.lastName,
						Reason: obj.dataValues.reason,
						fromDate: obj.dataValues.fromDate,
						toDate: obj.dataValues.toDate,
						permissions: obj.dataValues.permission == null ? '' : obj.dataValues.permission,
						notes: obj.dataValues.notes,
						feedBack: obj.dataValues.feedBack,
						status: obj.dataValues.status
					});
					slNo = slNo + 1
				});
				let workbook = new excel.Workbook();
				let worksheet = workbook.addWorksheet("Attendance");
				worksheet.columns = [{
					header: "SNo",
					key: "SNo",
					width: 5
				},
				{
					header: "Employee Code",
					key: "EmployeeCode",
					width: 5
				},
				{
					header: "Name",
					key: "Name",
					width: 25
				},
				{
					header: "Leave Type",
					key: "LeaveType",
					width: 25
				},
				{
					header: "Reason",
					key: "Reason",
					width: 25
				},
				{
					header: "From Date",
					key: "fromDate",
					width: 25
				},
				{
					header: "To Date",
					key: "toDate",
					width: 25
				},
				{
					header: "Permission Time",
					key: "permissions",
					width: 25
				},
				{
					header: "Notes",
					key: "notes",
					width: 25
				},
				{
					header: "Feedback",
					key: "feedBack",
					width: 25
				},
				{
					header: "Status",
					key: "status",
					width: 25
				},
				];
				worksheet.addRows(attendance);
				res.setHeader(
					"Content-Type",
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				);
				res.setHeader(
					"Content-Disposition",

					"attachment; filename=" + `All leaves.xlsx`
				);
				await workbook.xlsx.write(res);
				res.status(200).end();
			}
			else {
				console.log(userData, 'userData')
				let attendance = [];
				let slNo = 1;

				let leavesData = [];
				userData.forEach((obj) => {


					var endday = reqObj.toDate.toString().substr(0, 2);
					var endMonth = reqObj.toDate.toString().substr(3, 2);
					var endYear = reqObj.toDate.toString().substr(6, 4);
					var endDate = new Date(
						parseInt(endYear),
						parseInt(endMonth) - 1,
						parseInt(endday)
					);





					endDate = Date.parse(endDate)


					var startDay = reqObj.fromDate.toString().substr(0, 2);
					var startMonth = reqObj.fromDate.toString().substr(3, 2);
					var startYear = reqObj.fromDate.toString().substr(6, 4);
					var startDate = new Date(
						parseInt(startYear),
						parseInt(startMonth) - 1,
						parseInt(startDay)
					);

					startDate = Date.parse(startDate)

					var checkDay = obj.dataValues.fromDate.toString().substr(0, 2);
					var checkMonth = obj.dataValues.fromDate.toString().substr(3, 2);
					var checkYear = obj.dataValues.fromDate.toString().substr(6, 4);
					var checkFromDate = new Date(
						parseInt(checkYear),
						parseInt(checkMonth) - 1,
						parseInt(checkDay)
					);

					checkFromDate = Date.parse(checkFromDate)

					var chekToDay = obj.dataValues.toDate.toString().substr(0, 2);
					var checkTomonth = obj.dataValues.toDate.toString().substr(3, 2);
					var checkToYear = obj.dataValues.toDate.toString().substr(6, 4);
					var checkToDate = new Date(
						parseInt(checkToYear),
						parseInt(checkTomonth) - 1,
						parseInt(chekToDay)
					);

					checkToDate = Date.parse(checkToDate)


					if ((checkFromDate <= endDate && checkFromDate >= startDate && checkToDate <= endDate)) {


						leavesData.push(obj)
					}



				});
				//xconsole.log("leavedata",leavesData)
				leavesData.forEach((obj) => {

					attendance.push({
						SNo: slNo,

						LeaveType: obj.dataValues.request,
						EmployeeCode: obj.dataValues.user.employeeId,
						Name: obj.dataValues.user.firstName + obj.dataValues.user.lastName,
						Reason: obj.dataValues.reason,
						fromDate: obj.dataValues.fromDate,
						toDate: obj.dataValues.toDate,
						permissions: obj.dataValues.permission == null ? '' : obj.dataValues.permission,
						notes: obj.dataValues.notes,
						feedBack: obj.dataValues.feedBack,
						status: obj.dataValues.status
					});
					slNo = slNo + 1
				});
				let workbook = new excel.Workbook();
				let worksheet = workbook.addWorksheet("Attendance");
				worksheet.columns = [{
					header: "SNo",
					key: "SNo",
					width: 5
				},
				{
					header: "Employee Code",
					key: "EmployeeCode",
					width: 5
				},
				{
					header: "Name",
					key: "Name",
					width: 25
				},
				{
					header: "Leave Type",
					key: "LeaveType",
					width: 25
				},
				{
					header: "Reason",
					key: "Reason",
					width: 25
				},
				{
					header: "From Date",
					key: "fromDate",
					width: 25
				},
				{
					header: "To Date",
					key: "toDate",
					width: 25
				},
				{
					header: "Permission Time",
					key: "permissions",
					width: 25
				},
				{
					header: "Notes",
					key: "notes",
					width: 25
				},
				{
					header: "Feedback",
					key: "feedBack",
					width: 25
				},
				{
					header: "Status",
					key: "status",
					width: 25
				},
				];
				worksheet.addRows(attendance);
				res.setHeader(
					"Content-Type",
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				);
				res.setHeader(
					"Content-Disposition",

					"attachment; filename=" + `leaves ${reqObj.fromDate} -  ${reqObj.toDate}.xlsx`
				);
				await workbook.xlsx.write(res);
				res.status(200).end();
			}
		});

	};


	const getallLeave = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"company Id is required"
			);
		}
		leaves.findAll({
			where: {
				companyId: reqObj.id
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
		}).then((allData) => {
			var permissonData = []
			var otherLeaveData = []

			for (let i = 0; i < allData.length; i++) {
				if (allData[i].status === "waiting") {
					permissonData.push(allData[i])
				}
				else {
					otherLeaveData.push(allData[i])
				}
			}

			permissonData.reverse()
			otherLeaveData.reverse()

			var leaveDatas = permissonData.concat(otherLeaveData)
			return helpers.appresponse(res,
				200,
				true,
				leaveDatas,
				"success",
			);
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		})
	};
	const getallLeavebydate = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"company Id is required"
			);
		}
		if (!reqObj.date) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Date is required"
			);
		}
		leaves.findAll({
			where: {
				fromDate: reqObj.date,
				companyId: reqObj.companyId
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
		}).then((allData) => {
			var permissonData = []
			var otherLeaveData = []

			for (let i = 0; i < allData.length; i++) {
				if (allData[i].status === "waiting") {
					permissonData.push(allData[i])
				}
				else {
					otherLeaveData.push(allData[i])
				}
			}

			permissonData.reverse()
			otherLeaveData.reverse()

			var leaveDatas = permissonData.concat(otherLeaveData)
			return helpers.appresponse(res,
				200,
				true,
				leaveDatas,
				"success",
			);
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		})
	};

	const getallLeavebyFromdateAndToDate = async (req, res) => {


		const reqObj = helpers.getReqValues(req);

		console.log('reqobj', reqObj.fromDate)
		if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"company Id is required"
			);
		}
		if (!reqObj.fromDate) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"From Date is required"
			);
		}
		if (!reqObj.toDate) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"To Date is required"
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

		}).then((allData) => {
			let leavesData = [];
			allData.forEach((obj) => {

				// 	var fDate = Date.parse(reqObj.fromDate);
				// //	var lDate = moment(reqObj.toDate).format('DD-MM-YYYY');
				// 	var cDate = Date.parse(obj.fromDate);
				var endDay = reqObj.toDate.toString().substr(0, 2);
				var endMonth = reqObj.toDate.toString().substr(3, 2);
				var endYear = reqObj.toDate.toString().substr(6, 4);
				var endDate = new Date(
					parseInt(endYear),
					parseInt(endMonth) - 1,
					parseInt(endDay)
				);



				endDate = Date.parse(endDate)


				var startDay = reqObj.fromDate.toString().substr(0, 2);
				var startMonth = reqObj.fromDate.toString().substr(3, 2);
				var startYear = reqObj.fromDate.toString().substr(6, 4);
				var startDate = new Date(
					parseInt(startYear),
					parseInt(startMonth) - 1,
					parseInt(startDay)
				);
				startDate = Date.parse(startDate)

				var checkFromDay = obj.fromDate.toString().substr(0, 2);
				var checkFromMonth = obj.fromDate.toString().substr(3, 2);
				var checkFromYear = obj.fromDate.toString().substr(6, 4);
				var checkFromDate = new Date(
					parseInt(checkFromYear),
					parseInt(checkFromMonth) - 1,
					parseInt(checkFromDay)
				);
				checkFromDate = Date.parse(checkFromDate)

				var checkToDay = obj.toDate.toString().substr(0, 2);
				var checkToMonth = obj.toDate.toString().substr(3, 2);
				var checkToYear = obj.toDate.toString().substr(6, 4);
				var checkToDate = new Date(
					parseInt(checkToYear),
					parseInt(checkToMonth) - 1,
					parseInt(checkToDay)
				);
				checkToDate = Date.parse(checkToDate)
				//moment(reqObj.toDate).format('DD-MM-YYYY');

				if ((checkFromDate <= endDate && checkFromDate >= startDate && checkToDate <= endDate)) {

					leavesData.push(obj)
				}



			});
			var permissonData = []
			var otherLeaveData = []

			for (let i = 0; i < leavesData.length; i++) {
				if (leavesData[i].status === "waiting") {
					permissonData.push(leavesData[i])
				}
				else {
					otherLeaveData.push(leavesData[i])
				}
			}

			permissonData.reverse()
			otherLeaveData.reverse()

			var leaveDatas = permissonData.concat(otherLeaveData)
			

			return helpers.appresponse(res,
				200,
				true,
				leaveDatas,
				"success",
			);
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		})

	}

	const approveRequest = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id is : " + req);
		console.log("request id is : " + reqObj.id);
		console.log(reqObj)
		if (!reqObj.id) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Leave Request id is required"
			);
		}
		if (!reqObj.status) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Leave status is required"
			);
		}
		reqObj.updateddAt = Date.now();
		var leaveData = await leaves.findOne({
			where: {
				id: reqObj.id
			},
			include: [

				//users,
				{
					model: users,
					as: 'user'
				},
				{
					model: users,
					as: 'approver'
				}
			]
		})
		//	console.log(leaveData, "leaveData");
		if (!leaveData) {
			return helpers.appresponse(res, 404, false, [], "No leave found");
		}
		if (reqObj.status == "approved") {
			if (leaveData.request == 'Full Day') {
				var leaveLimit = leaveData.noOfDaysLeaveApply;
			} else if (leaveData.request == 'Half Day') {
				var leaveLimit = 0.5;
			} else {
				var leaveLimit = 0;
			}
		} else {
			var leaveLimit = 0;
		}
		// console.log(leaveData.request, "leaveData.request")
		// console.log(leaveLimit, "leaveLimit")
		var email = leaveData.user.email;
		var name = leaveData.user.userName;
		var status = reqObj.status;
		var noLeaves = leaveData.user.numberOfLeaves - leaveLimit;
		// console.log(noLeaves, "noLeaves")
		// console.log(email, "email")

		NotificationService.singlepushnotification(email, "Your leave is " + reqObj.status);
		await users.update({
			numberOfLeaves: noLeaves
		}, {
			where: {
				id: leaveData.user.id
			},
		});
		var reason = leaveData.reason;
		var startDate = leaveData.fromDate;
		var endDate = leaveData.toDate;
		var requestedDate = leaveData.createdAt;
		var leaveType = leaveData.request;
		const authHeader = req.headers.authorization;
		// console.log("authHeader--->", authHeader);
		let createdByUserId = await helpers.getUserId(authHeader);
		//console.log("createdByUserId-->", createdByUserId);
		//console.log("reqObj.id",reqObj.id)
		if (createdByUserId && createdByUserId !== undefined) {


			reqObj.approvedBy = createdByUserId

		}

		const userObj = await users.findOne({
			where: {
				id: createdByUserId
			},

		})

		const maildata = {
			name: name,
			email: email,
			reason: reason,
			status: status,
			approvedBy: userObj.email,
			startDate: startDate,
			endDate: endDate,
			requestedDate: requestedDate,
			leaveType: leaveType,
			id: '',
			to: email,
			sub: "Leave Request Status"

		};
		//        reqObj.status = status;
		console.log("maildata", maildata)


		const companyObj = users.findOne({
			where: {
				id: userObj.companyId
			}
		})
		var emailArray = []
	
		emailArray.push(config.commonEmail)
		emailArray.push(email)
		emailArray.push(userObj.email)
		//	utils.sendCreateLeaveRequest(maildata,emailArray)
		//utils.sendLeaveRequest(maildata, emailArray)
		reqObj.noOfDaysLeaveApply = 0;

		leaves.update(reqObj, {
			where: {
				id: reqObj.id
			}
		}).then((allData) => {
			return helpers.appresponse(res,
				200,
				true,
				allData,
				"success",
			);
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		});
	};
	const getbyid = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id is : " + reqObj.id);
		leaves.findAll({
			where: {
				userId: reqObj.id
			},
			attributes: {
				exclude: ["companyId", "userType"]
			},
			include: [

				//users,
				{
					model: users,
					as: 'user'
				},
				{
					model: users,
					as: 'approver'
				}
			]

		}).then((leaveData) => {
			if (leaveData) {
				return helpers.appresponse(res,
					200,
					true,
					leaveData,
					"success",
				);
			} else {
				return helpers.appresponse(res,
					404,
					false,
					[],
					"No leave found for the user " + reqObj.id,
				);
			}
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		})
	};

	const getWaitingLeave = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		leaves.findAll({
			where: {
				status: 'waiting',
				companyId: reqObj.companyId

			},
			include: [{
				model: users,
				where: {
					companyId: reqObj.companyId
				},
				as: 'user'
			},
			{
				model: users,
				as: 'approver'
			}
			]

		}).then((allData) => {
			return helpers.appresponse(res,
				200,
				true,
				allData,
				"success",
			);
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		})
	};


	const deleteLeave = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id is : " + reqObj.id);
		leaves.destroy({
			where: {
				id: reqObj.id
			}
		}).then((data) => {
			return helpers.appresponse(res,
				200,
				true,
				data,
				"success",

			);
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message

			);

		})
	};

	const getAllLeaveBySearch = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Company Id is required"
			);
		}

		console.log("userName-->", reqObj.userName);
		if (reqObj.userName) {
			let cond = {};
			cond["userName"] = {
				[Op.like]: "%" + reqObj.userName + "%",
			};

			if (reqObj.employeeId) {
				cond["employeeId"] = reqObj.employeeId;
			}

			console.log('1-->CONDITION-->', cond);

			leaves.findAll({
				where: {
					companyId: reqObj.companyId
				},

				include: [{
					model: users,
					where: cond,
					as: 'user'
				},
				{
					model: users,
					as: 'approver'
				}
				]

			}).then((allData) => {
				var permissonData = []
				var otherLeaveData = []
	
				for (let i = 0; i < allData.length; i++) {
					if (allData[i].status === "waiting") {
						permissonData.push(allData[i])
					}
					else {
						otherLeaveData.push(allData[i])
					}
				}
	
				permissonData.reverse()
				otherLeaveData.reverse()
	
				var leaveDatas = permissonData.concat(otherLeaveData)
				return helpers.appresponse(res,
					200,
					true,
					leaveDatas,
					"success",
				);
			}).catch((err) => {
				return helpers.appresponse(res,
					404,
					false,
					null,
					err.message
				);
			})
		} else {
			let cond = {};

			if (reqObj.employeeId) {
				cond["employeeId"] = reqObj.employeeId;
			}
			console.log('2-->CONDITION-->', cond);
			leaves.findAll({
				where: {
					companyId: reqObj.companyId
				},
				include: [{
					model: users,
					where: cond,
					as: 'user'
				},
				{
					model: users,
					as: 'approver'
				}
				]
			}).then((allData) => {

				
				return helpers.appresponse(res,
					200,
					true,
					allData,
					"success",
				);
			}).catch((err) => {
				return helpers.appresponse(res,
					404,
					false,
					null,
					err.message
				);
			})
		}

	};


	return {
		create,
		getallLeave,
		approveRequest,
		getbyid,
		getWaitingLeave,
		download,
		deleteLeave,
		getallLeavebydate,
		getallLeavebyFromdateAndToDate,
		getAllLeaveBySearch
	};
};

export default LeaveController();
