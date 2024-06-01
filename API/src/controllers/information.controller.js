import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";


const {
	information
} = db;
const Op = db.Sequelize.Op;


const informationController = () => {
	const informationcontent= async (req,res) => {
       
       
        
        const reqObj = helpers.getReqValues(req);
        if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"company Id is required."
			);
		}
        console.log("Req::::",reqObj)
        if(req.file)
        {
            const imagename=req.file.filename;
            console.log("File:::::",req.file.filename )
            console.log(`creating ${imagename}`);
            reqObj.imageName=imagename;
            reqObj.imageType=true;
           
            
        }
        else{
            reqObj.imageName="";
        }
        if(!reqObj.textContent){
            reqObj.textContent=" ";
        }
        reqObj.createdAt = Date.now();
		reqObj.updateddAt = Date.now();
		
        
        information.create(reqObj)
        .then((infoData)=>{
            
           return helpers.appresponse(
                res,
                200,
                true,
                infoData,
                "Information added successfully"
            ); 
              
        })
      
        .catch((err) => {
            utils.deleteFile(imagename);
            return helpers.appresponse(res, 404, false, null, err.message);
        });
        

    }

    const deleteInformation = async (req, res) => {
		try {
			
            const reqObj = helpers.getReqValues(req);
			if (reqObj.id) {
                var informtiondata = await information.findOne(
					{
						where: { id: reqObj.id },
					}
				);
                console.log(JSON.stringify(informtiondata));
                if(informtiondata.imageName){
                    utils.deleteFile(informtiondata.imageName);
                }
				await information.destroy(
					{
						where: { id: reqObj.id },
					}
				);

                return helpers.appresponse(
                    res,
                    200,
                    true,
                    [],
                    " Deleted successfully"
                ); 
			} else {
                return helpers.appresponse(
                    res,
                    404,
                    false,
                    null,
                    "Something Went Wrong"
                ); 
			}
		} catch (err) {
            return helpers.appresponse(res, 404, false, null, err.message);
       
		}
	};

    const getInformation=async (req, res)=>{
        const reqObj = helpers.getReqValues(req);
        if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"company Id is required."
			);
		}
        await information.findAll({
            where:{
                companyId: reqObj.companyId 
            }
            
        })
        .then((informationData)=>{
           
            console.log(informationData,"informationData")
            return helpers.appresponse(res,
				200,
				true,
				informationData,
				"Listed successfully ."
			); 
            
        }).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		});
    }
      
	return {
		informationcontent,
        deleteInformation,
        getInformation
	};
};

export default informationController();
