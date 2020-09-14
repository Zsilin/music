const Controller = require('egg').Controller;


class PicController extends Controller {
    //显示所有轮播图信息
    async getAllPic() {
        let r=await this.service.picService.getAllPic();
        this.ctx.response.body=r;
    }

    //删除某个轮播图
    async deletePic() {
        let picId=this.ctx.request.body.picId;
        let r=await this.service.picService.deletePic(picId);
        this.ctx.response.body=r;
    }
};

module.exports = PicController