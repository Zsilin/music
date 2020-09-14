const Service =require('egg').Service;
const fs = require('fs');
const path = require("path");

class uploadPicService extends Service{

  // 上传图片文件
   async uploadPic(){
        /**
        得到的file对象的值为:
        {
          field: 'file',
          filename: 'aab.jpg',//被上传的文件名
          encoding: '7bit',
          mime: 'image/jpeg',
          fieldname: 'file',
          transferEncoding: '7bit',
          mimeType: 'image/jpeg',
          filepath: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\egg-multipart-tmp\\updatefile\\2019\\12\\18\\14\\e6fd6a98-b374-4
          c3d-81bb-8da3319d42be.jpg'
        }
         */
        const file = this.ctx.request.files[0]; //拿到文件对象
        const toFileName = '/public/uploadPic/' + Date.now() + file.filename; //把图片放进uploadPic文件夹中并取了一个独一无二的名字
        /**
         * 1,全局变量__dirname的值为"<路径>\项目名\app\service",即为当前文件所在的目录
         * 2,path.dirname(...)的使用是去掉最后一级,
         * 所以path.dirname(__dirname)后的值为"<路径>\项目名\app"
         * 3, 最后得到to的值为 "<路径>\项目名\app/public/uploadPic/保存时的文件名字" 
         */
        let to = path.dirname(__dirname) + toFileName;
        //file.filepath是上传的临时文件
        //把临时文件写入到文件to
        await fs.copyFileSync(file.filepath, to);
        //删除临时文件
        await fs.unlinkSync(file.filepath);
        //得到上传文件的网络访问 url
        const newUrl = "http://localhost:7001" + toFileName;
        // const newUrl = "http://192.168.6.16:7001" + toFileName;
        //将得到的url和图片信息都存入数据库
        let picName=this.ctx.request.body.name;
        let sql="insert into lunbo(pic_name,pic_src) values(?,?)";
        let result=await this.ctx.app.mysql.query(sql,[picName,newUrl])
        
        //返回添加的结果
        return result.affectedRows;
   }
    
}
module.exports=uploadPicService;