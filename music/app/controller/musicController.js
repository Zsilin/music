const Controller = require('egg').Controller;


class MusicController extends Controller {
    //显示音乐分类信息
    async showTypeList() {
        let r = await this.service.musicService.showTypeList();
        this.ctx.response.body = r;
    }
    //新增音乐分类信息
    async addMusicType() {
        let newTypeName = this.ctx.request.body.newTypeName;
        let r = await this.service.musicService.addMusicType(newTypeName);
        this.ctx.response.body = r;
    }
    //删除音乐分类信息
    async delMusicType() {
        let typeId = this.ctx.request.body.typeId;
        let r = await this.service.musicService.delMusicType(typeId);
        this.ctx.response.body = r;
    }
     //修改音乐分类信息名称
     async changeTypeName() {
        let typeId = this.ctx.request.body.typeId;
        let updTypeName=this.ctx.request.body.updTypeName;
        let r = await this.service.musicService.changeTypeName(typeId,updTypeName);
        this.ctx.response.body = r;
    }



    //通过分类ID来显示相关分类的音乐
    async getMusicByType() {
        let typeId = this.ctx.request.body.typeId;
        let r = await this.service.musicService.getMusicByType(typeId);
        this.ctx.response.body = r;
    }
    //删除音乐
    async deleteMusic() {
        let musicId = this.ctx.request.body.musicId;
        let r = await this.service.musicService.deleteMusic(musicId);
        this.ctx.response.body = r;
    }

    //得到所有的音乐
    async getAllMusic() {
        let r = await this.service.musicService.getAllMusic();
        this.ctx.response.body = r;
    }

    //收藏歌曲
    async addMyLove() {
        let musicId=this.ctx.request.body.musicId;
        let musicName=this.ctx.request.body.musicName;
        let musicSrc=this.ctx.request.body.musicSrc;
        let userId=this.ctx.request.body.userId;

        let r = await this.service.musicService.addMyLove(musicId,musicName,musicSrc,userId);
        this.ctx.response.body = r;
    }


    //得到该用户所收藏的音乐
    async getMyLoveMusic() {
        let userId=this.ctx.request.body.userId;
        let r=await this.service.musicService.getMyLoveMusic(userId);
        this.ctx.response.body=r;
    }

    //删除该用户所收藏的音乐
    async delMyLoveMusic() {
        let musicId=this.ctx.request.body.musicId;
        let userId=this.ctx.request.body.userId;
        let r=await this.service.musicService.delMyLoveMusic(userId,musicId);
        this.ctx.response.body=r;
    }
};

module.exports = MusicController