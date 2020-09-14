const Service =require('egg').Service;

class LoginService extends Service{
   //普通用户登录
    async userLogin(name,pwd){
        let sql="select id,name from user where name=? and pwd=?";
        let r=await this.ctx.app.mysql.query(sql,[name,pwd])
        return r;
    }
    //管理员登录
    async adminLogin(name,pwd){
        let sql="select id,name from admin where name=? and pwd=?";
        let r=await this.ctx.app.mysql.query(sql,[name,pwd])
        return r;
    }

    //验证注册的用户名是否已经存在
    async isHaveUser(name){
        let sql="select name from user where name=?";
        let r=await this.ctx.app.mysql.query(sql,[name])
        return r;
    }

    //新用户注册
    async userRegist(name,pwd){
        let sql="insert into user(name,pwd) values(?,?)";
        let r=await this.ctx.app.mysql.query(sql,[name,pwd])
        return r.affectedRows;
    }
    //判断点击音乐管理员登录时，该用户是不是管理员
    async isAdmin(id,name){
        let sql="select id,name from admin where id=? and name=?";
        let r=await this.ctx.app.mysql.query(sql,[id,name])
        return r;
    }
     //判断点击我的音乐的时候，是不是管理员在点
     async isUser(id,name){
        let sql="select id,name from user where id=? and name=?";
        let r=await this.ctx.app.mysql.query(sql,[id,name])
        return r;
    }

}

module.exports=LoginService;