const Service = require('egg').Service;

class MusicService extends Service {
    //显示音乐分类信息
    async showTypeList() {
        let sql = "select id,type from musictype";
        let r = await this.ctx.app.mysql.query(sql)
        return r;
    }
    //新增音乐分类信息
    async addMusicType(newTypeName) {
        let sql = "insert into musictype(type) values(?)";
        let r = await this.ctx.app.mysql.query(sql, [newTypeName])
        return r.affectedRows;
    }
    //删除音乐分类信息
    async delMusicType(typeId) {
        let sql1 = "delete from musictype where id=?";
        let sql2 = "delete from music where type_id=?"
        let r1 = await this.ctx.app.mysql.query(sql1, [typeId]) //音乐分类
        let r2 = await this.ctx.app.mysql.query(sql2, [typeId]) //相关分类下的音乐
        return r1.affectedRows;
    }
    //修改音乐分类信息名称
    async changeTypeName(typeId, updTypeName) {
        let sql = "update musictype set type=? where id=?";
        let r = await this.ctx.app.mysql.query(sql, [updTypeName, typeId])
        return r.affectedRows;
    }



    //通过分类ID来显示相关分类的音乐
    async getMusicByType(typeId) {
        let sql = "select id,music_name name,music_src src from music where type_id=?";
        let r = await this.ctx.app.mysql.query(sql, [typeId])
        return r;
    }
    //删除音乐
    async deleteMusic(musicId) {
        let sql = "delete from music where id=?";
        let r = await this.ctx.app.mysql.query(sql, [musicId])
        return r.affectedRows;
    }

    //得到所有音乐
    async getAllMusic() {
        let sql = "select id,music_name name,music_src src,type_id typeId from music";
        let r = await this.ctx.app.mysql.query(sql)
        return r;
    }

    //收藏音乐
    async addMyLove(musicId, musicName, musicSrc, userId) {
        //先查询mylove表中有没有这一条数据
        let sql = "select * from mylove where music_id=? and user_id=?";
        let r1 = await this.ctx.app.mysql.query(sql, [musicId, userId]);
        if (r1.length == 1) {
            return 0; //已经存在，不能添加
        } else {
            let sql = "insert into mylove(music_id,music_name,music_src,user_id) values(?,?,?,?)";
            let r = await this.ctx.app.mysql.query(sql,[musicId,musicName,musicSrc,userId])
            return r.affectedRows;//成功添加，会返回1
        }

    }
    //得到该用户所收藏的音乐
    async getMyLoveMusic(userId){
        let sql="select music_id id,music_name name,music_src src from mylove where user_id=?";
        let r=await this.ctx.app.mysql.query(sql,[userId])
        return r;
    }
    //删除该用户所收藏的音乐
    async delMyLoveMusic(userId,musicId){
        let sql="delete from mylove where music_id=? and user_id =?";
        let r=await this.ctx.app.mysql.query(sql,[musicId,userId])
        return r.affectedRows;
    }
}

module.exports = MusicService;