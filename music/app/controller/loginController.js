const Controller = require('egg').Controller;

class LoginController extends Controller{
    async login(){
        this.ctx.response.body="主页"
    }

    //普通用户登录
    async userLogin(){
        let name=this.ctx.request.body.loginName;
        let pwd=this.ctx.request.body.loginPwd;
        let r=await this.service.loginService.userLogin(name,pwd);
        this.ctx.response.body=r;
    }
    //管理员登录
    async adminLogin(){
        let name=this.ctx.request.body.loginName;
        let pwd=this.ctx.request.body.loginPwd;
        let r=await this.service.loginService.adminLogin(name,pwd);
        this.ctx.response.body=r;
    }

    //验证注册的用户名是否已经存在
    async isHaveUser(){
        let name=this.ctx.request.body.registName;
        let r=await this.service.loginService.isHaveUser(name);
        this.ctx.response.body=r;
    }

    //新用户注册
    async userRegist(){
        let name=this.ctx.request.body.registName;
        let pwd=this.ctx.request.body.registPwd;
        let r=await this.service.loginService.userRegist(name,pwd);
        this.ctx.response.body=r;
    }

    //判断点击音乐管理员登录时，该用户是不是管理员
    async isAdmin(){
        let name=this.ctx.request.body.name;
        let id=this.ctx.request.body.id;
        let r=await this.service.loginService.isAdmin(id,name);
        this.ctx.response.body=r;
    }
    //判断点击我的音乐的时候，是不是管理员在点 
    async isUser(){
        let name=this.ctx.request.body.name;
        let id=this.ctx.request.body.id;
        let r=await this.service.loginService.isUser(id,name);
        this.ctx.response.body=r;
    }
}

module.exports=LoginController;