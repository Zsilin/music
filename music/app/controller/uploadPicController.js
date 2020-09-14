const Controller = require('egg').Controller;


class uploadPicController extends Controller {
    async uploadPic() {
        let r=await this.service.uploadPicService.uploadPic();
        this.ctx.response.body=r;
    }
};

module.exports = uploadPicController