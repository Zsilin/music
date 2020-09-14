 //得到cookie值的函数
 function getCookieByName(name) {
     let str = name + '=';
     let cookie = document.cookie;
     let result;
     cookie.split(';').forEach(item => {
         if (item.trim().indexOf(str) == 0) {
             result = item.trim().substr(str.length)
         }
     })
     return result;
 }

 function check() {
     let name = getCookieByName("name");
     let id = getCookieByName("id")
     if (!name) {
         window.location.href = `./user.html`
     } else {
         //验证该用户是不是用户
         axios.post('/isUser.do', {
             id,
             name
         }).then(res => {
             if (res.data.length == 1) {
                 console.log(1)
             } else {
                 window.location.replace(`./user.html`)
             }
         }).catch(err => console.log(err))
     }
 }
 check()

 window.onload = function () {
     function getMyLoveMusic() {
         // 获得该用户所收藏的音乐
         axios.post('/getMyLoveMusic.do', {
             //得到userId
             userId: getCookieByName("id")
         }).then(res => {
             let ul = document.getElementById("mylove-list");
             if (res.data.length == 0) {
                 ul.innerHTML = "暂无收藏音乐";
             } else {
                ul.innerHTML="";
                 res.data.forEach(item => {
                     let li = document.createElement("li"); //创建li
                     let span = document.createElement("span"); //创建span
                     span.setAttribute("data-music-id", item.id); //创建自定义属性绑定歌曲id
                     span.title = item.name;
                     span.innerText = item.name; //写入歌曲名称
                     let playbtn = document.createElement('button'); //创建播放按钮
                     playbtn.setAttribute("class", "playBtn") //为播放按钮创建类名
                     playbtn.setAttribute('data-music-src', item.src) //添加自定义属性绑定歌曲src
                     playbtn.innerText = "播放";
                     let addPlaybtn = document.createElement('button'); //创建添加到播放列表按钮
                     addPlaybtn.setAttribute("class", "delBtn") //为这个按钮创建类名
                     addPlaybtn.innerText = "删除";
                     li.appendChild(span);
                     li.appendChild(playbtn);
                     li.appendChild(addPlaybtn);
                     ul.appendChild(li)
                 })
                 //  为删除按钮添加事件
                 delBtnEvent();
             }
         }).catch(err => console.log(err))
     }
     getMyLoveMusic()

     function delBtnEvent() {
         let delBtns = document.querySelectorAll(".delBtn");
         delBtns.forEach(item => {
            item.onclick=function(){
                let musicId=item.parentElement.firstElementChild.getAttribute("data-music-id");
                let userId=getCookieByName("id");
                axios.post('/delMyLoveMusic.do',{
                    musicId,
                    userId
                }).then(res=>{
                    if(res.data==1){
                        getMyLoveMusic();
                    }
                }).catch(err=>console.log(err))
            }
         })
     }



     document.querySelector(".logo").onclick = function () {
         window.location.replace("./user.html");
     }
 }