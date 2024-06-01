import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";



const { timesheet, users, projects, sprints, teams, task, task_type, taskStatuses, timesheetDetails,roles } = db;
const Op = db.Sequelize.Op;

const TimesheetDetailsController = () => {



    const updateTimesheetDetails = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id)
	
        if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Timsheet details id is required"
			);
		}
        const user = await users.findOne({
			where: {
				companyId: reqObj.companyId
			}
		})

        let detailsData = {
            timesheet_id: reqObj.timesheet_id,
            teamId: reqObj.teamId,
            task_type_id: reqObj.task_type_id,
            task_code: reqObj.task_code,
            title: reqObj.title,
            project_id: reqObj.project_id,
            task_id: reqObj.task_id,
            sprint_id: reqObj.sprint_id,
            story_points: reqObj.story_points,
            estimated_hours: reqObj.estimated_hours,
            actual_hours: reqObj.actual_hours,
            comments: reqObj.comments,
            task_status_id: reqObj.task_status_id,
            createdAt: Date.now(),
            createdBy: user.id

        }
        // reqObj.updatedAt = Date.now();
		// reqObj.updatedBy = user.id;
		timesheetDetails
			.update(detailsData, {
				where: {
					id: reqObj.id,
				},
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

    const getOneTimeSheetDetails = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);

		await timesheetDetails
			.findOne({
				where: {
					id: reqObj.id,
				},
                include: [
					{
						model: projects,
					},
					{
						model: sprints,
					},
					{
						model: task_type,
					},
					{
						model: taskStatuses,
					},
					{
						model: timesheet,
					},
					// {
					// 	model: teams,
					// },
				],
			})

			.then((taskStatusData) => {
				if (taskStatusData) {
					return helpers.appresponse(
						res,
						200,
						true,
						taskStatusData,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No task status found"
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	return {
		updateTimesheetDetails,
        getOneTimeSheetDetails
	};
};

export default TimesheetDetailsController();
