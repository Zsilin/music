const Service =require('egg').Service;

class PicService extends Service{
    //显示轮播图信息
    async getAllPic(){
        let sql="select id,pic_name name,pic_src src from lunbo";
        let r=await this.ctx.app.mysql.query(sql)
        return r;
    }

    //删除图片
    async deletePic(picId){
        let sql="delete from lunbo where id=?";
        let r=await this.ctx.app.mysql.query(sql,[picId])
        return r.affectedRows;
    }
}

module.exports=PicService;