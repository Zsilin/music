const Service = require('egg').Service;
const fs = require('fs');
const path = require("path");

class uploadMusicService extends Service {

   // 上传音乐文件
   async uploadMusic() {
      const file = this.ctx.request.files[0]; //拿到文件对象
      const toFileName = '/public/uploadMusic/' + Date.now() + file.filename; //把音乐放进uploadMusic文件夹中并取了一个独一无二的名字
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
        let newUrl = "http://localhost:7001" + toFileName;
      // let newUrl = "http://192.168.6.16:7001" + toFileName;
      //    将得到的url和音乐信息都存入数据库
      let musicName = this.ctx.request.body.name;
      let typeId = this.ctx.request.body.typeId;
      let sql = "insert into music(music_name,music_src,type_id) values(?,?,?)";
      let result = await this.ctx.app.mysql.query(sql, [musicName, newUrl, typeId])

      //返回添加的结果
      return result.affectedRows;
   }

}
module.exports = uploadMusicService;