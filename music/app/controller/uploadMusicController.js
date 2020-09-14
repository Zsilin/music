const Controller = require('egg').Controller;


class uploadMusicController extends Controller {
    //上传音乐
    async uploadMusic() {
        let r=await this.service.uploadMusicService.uploadMusic();
        this.ctx.response.body=r;
    }
};

module.exports = uploadMusicController