module.exports=app=>{
    const{router,controller}=app;

    router.get('/',controller.loginController.login)
    //普通用户登录
    router.post('/userLogin.do',controller.loginController.userLogin)
    //管理员登录
    router.post('/adminLogin.do',controller.loginController.adminLogin)
    //验证注册的用户名是否已经存在
    router.post('/isHaveUser.do',controller.loginController.isHaveUser)
    //用户注册
    router.post('/userRegist.do',controller.loginController.userRegist)
    //判断点击音乐管理员登录时，该用户是不是管理员
    router.post('/isAdmin.do',controller.loginController.isAdmin)
    //判断点击我的音乐的时候，是不是管理员在点 
    router.post('/isUser.do',controller.loginController.isUser)



    //显示全部的轮播图信息
    router.post('/getAllPic.do', controller.picController.getAllPic)
    //删除轮播图
    router.post('/deletePic.do', controller.picController.deletePic)
   //管理员上传轮播图
    router.post('/uploadPic.do', controller.uploadPicController.uploadPic)


    //显示音乐分类信息
    router.get('/showTypeList.do', controller.musicController.showTypeList)
    //新增音乐分类
    router.post('/addMusicType.do', controller.musicController.addMusicType)
    //删除音乐分类
    router.post('/delMusicType.do', controller.musicController.delMusicType)
     //修改音乐分类名称
     router.post('/changeTypeName.do', controller.musicController.changeTypeName)
    

    //通过分类ID来显示相关分类的音乐
    router.post('/getMusicByType.do', controller.musicController.getMusicByType)
    //删除音乐
    router.post('/deleteMusic.do', controller.musicController.deleteMusic)
    //管理员上传音乐
    router.post('/uploadMusic.do', controller.uploadMusicController.uploadMusic)

    //从music中获取所有的音乐
    router.post('/getAllMusic.do', controller.musicController.getAllMusic)

    //收藏歌曲
    router.post('/addMyLove.do', controller.musicController.addMyLove)


    //得到该用户所收藏的音乐
    router.post('/getMyLoveMusic.do', controller.musicController.getMyLoveMusic)
     //删除该用户所收藏的音乐
     router.post('/delMyLoveMusic.do', controller.musicController.delMyLoveMusic)
    //-------------测试
    // router.get('/getmusic.do', controller.musicController.getmusic)

}