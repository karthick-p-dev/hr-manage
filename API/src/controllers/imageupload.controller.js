import _ from "lodash";
import utils from "../services/utils.service";
import db from "../../config/sequelize";
import multer from "multer";

const ImageController = () => {
	const getupload = (req, file) => {
		var storage = multer.diskStorage({
			destination: (req, file, cb) => {
				cb(null, "./uploads");
			},
			filename: (req, file, cb) => {
				console.log(file);
				console.log("the file file of the givem image is : " + file);
				console.log("the file file of the givem image is file.mimetypefile.mimetypefile.mimetype: " + file.mimetype);

				var filetype = "";
				if (file.mimetype === "image/gif") {
					filetype = "gif";
				}
				if (file.mimetype === "image/png") {
					filetype = "png";
				}
				if (file.mimetype === "image/jpeg") {
					filetype = "jpg";
				}
				if (file.mimetype === "image/jpg") {
					filetype = "jpg";
				}
				console.log("the file type of the givem image is : " + filetype);
				cb(null, "img-" + Date.now() + "." + filetype);
			},
		});
		var upload = multer({
			storage: storage
		});
		return upload;
	};
	return {
		getupload,

	};
};
export default ImageController();