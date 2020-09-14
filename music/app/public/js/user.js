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

//检查是否已经登录，如果已经登录，把登录字样换成欢迎字样，再添加一个注销按钮
function isLogin() {
    let name = getCookieByName("name");
    if (name) {
        document.querySelector("div.login").innerHTML = `欢迎你:${name}<a href="javascript:noLogin(); ">注销</a> `
    } else {
        document.querySelector("div.login").innerHTML = `<a href="javascript:showLoginBox();">请登录</a> `
    }
}
isLogin();

//注销函数
function noLogin() {
    document.cookie = 'name=;expires=Thu, 01-Jan-1970 00:00:01 GMT';
    document.cookie = 'id=;expires=Thu, 01-Jan-1970 00:00:01 GMT';
    alert("注销成功")
    window.location.href = './user.html';
}

//显示登录窗口的盒子
function showLoginBox() {
    let target = document.getElementById("login-regist-box");
    target.style.display = "block";
    target.style.top = `${window.scrollY+(window.innerHeight-target.offsetHeight)/2}px`;
    target.style.left = `${window.scrollX+(window.innerWidth-target.offsetWidth)/2}px`;
}

//点击我的音乐时，通过cookie判断有没有登录，如果没有登录，就弹出登录窗口，如果已经登录，直接跳转，同时传入用户id
//还需要判断是不是用户
function mysong() {
    let name = getCookieByName("name");
    let id = getCookieByName("id")
    if (!name) {
        showLoginBox();
    } else {
        //验证该用户是不是用户
        axios.post('/isUser.do', {
            id,
            name
        }).then(res => {
            //说明这是用户
            if (res.data.length == 1) {
                isLogin();
                window.location.href = `./mylove.html`
            } else {
                //如果不是一个用户
                isLogin();
                alert("管理员就去做管理员该做的事情")
            }
        }).catch(err => console.log(err))
    }
}

//点击管理员的时候，判断有没有登录，如果没有登录就弹出登录窗口如果已经登录
//还需要判断现在登录的是不是管理员
function admin() {
    let name = getCookieByName("name");
    let id = getCookieByName("id");
    if (!name) {
        showLoginBox();
    } else {
        //验证该用户是不是管理员
        axios.post('/isAdmin.do', {
            id,
            name
        }).then(res => {
            //说明这是一个管理员
            if (res.data.length == 1) {
                isLogin();
                window.location.href = `./admin.html`
            } else {
                //如果不是一个管理员
                isLogin();
                alert("对不起，你没有权限")
            }
        }).catch(err => console.log(err))

    }
}

// 初始化轮播图-------------------------------------------------------
function lunbo() {
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal', // 垂直切换选项
        // loop: true, // 循环模式选项
        autoplay: {
            delay: 3000, //每一张图停留的时间
            stopOnLastSlide: false,
            disableOnInteraction: true,
        },
        speed: 800, //滑动完成的时间
        grabCursor: true, //小手，鼠标放上变成小手

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },
        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

    })

    //鼠标覆盖停止自动切换
    mySwiper.el.onmouseover = function () {
        mySwiper.autoplay.stop();
    }
    //鼠标离开开始自动切换
    mySwiper.el.onmouseout = function () {
        mySwiper.autoplay.start();
    }
}

//请求轮播图片
async function getLunBoPic() {
    await axios.post('/getAllPic.do').then(res => {
        let wrapper = document.querySelector(".swiper-wrapper");
        wrapper.innerHTML = "";
        res.data.forEach(item => {
            let slide = document.createElement("div");
            slide.classList.add("swiper-slide");
            let img = document.createElement("img");
            img.src = item.src;
            slide.appendChild(img);
            wrapper.appendChild(slide);
        })
    }).catch(err => console.log(err))
    //上一步执行完成之后
    lunbo(); //初始化轮播图

}
getLunBoPic()

//请求所有音乐，加入到页面中的分类中
async function showAllMusic() {
    //1.先获得所有的分类的信息，然后给div设置type-id，以及给title设置分类内容
    await axios.get('/showTypeList.do').then(res => {
        let menus = document.querySelectorAll("#menu-box .menu");
        for (let i in Array.from(menus)) {
            // 找到.menu的盒子，设置type-id
            menus[i].setAttribute("data-type-id", res.data[i].id);
            //找到title
            menus[i].lastElementChild.firstElementChild.innerText = res.data[i].type;
        }
    }).catch(err => console.log(err))

    // 2.然后获得所有音乐的信息，根据type-id的不同，渲染到不同的盒子中
    await axios.post('/getAllMusic.do').then(res => {
        let menus = document.querySelectorAll("#menu-box .menu");
        for (let i in Array.from(menus)) {
            let boxId = menus[i].getAttribute("data-type-id");
            //找到该盒子下的ol列表
            let ul = menus[i].lastElementChild.lastElementChild;
            res.data.forEach(item => {
                //如果该歌曲的type-id与盒子的type-id值相同，则在该盒子的ol中创建li
                if (boxId == item.typeId) {
                    //需要创建这样的li
                    // <li>
                    //       <span data-m-id="歌曲id">歌曲名称</span>
                    //       <button class="playBtn" data-m-src="歌曲路径">播放</button>
                    //      <button class="addPlayBtn">添加</button>
                    //       <button class="addMyLoveBtn">收藏</button>
                    //</li>
                    let li = document.createElement("li"); //创建li
                    let span = document.createElement("span"); //创建span
                    span.setAttribute("data-music-id", item.id); //创建自定义属性绑定歌曲id
                    span.title = item.name.slice(0, this.length - 4);
                    span.innerText = item.name.slice(0, this.length - 4); //写入歌曲名称
                    let playbtn = document.createElement('button'); //创建播放按钮
                    playbtn.setAttribute("class", "playBtn") //为播放按钮创建类名
                    playbtn.setAttribute('data-music-src', item.src) //添加自定义属性绑定歌曲src
                    playbtn.innerText = "播放";
                    let addPlaybtn = document.createElement('button'); //创建添加到播放列表按钮
                    addPlaybtn.setAttribute("class", "addPlayBtn") //为这个按钮创建类名
                    addPlaybtn.innerText = "添加";
                    let addMyLoveBtn = document.createElement('button'); //创建收藏按钮
                    addMyLoveBtn.setAttribute("class", "addMyLoveBtn") //为这个按钮创建类名
                    addMyLoveBtn.innerText = "收藏";
                    li.appendChild(span);
                    li.appendChild(playbtn);
                    li.appendChild(addPlaybtn);
                    li.appendChild(addMyLoveBtn);
                    ul.appendChild(li)
                }
            })
        }
    }).catch(err => console.log(err))

    //3，然后给按钮们添加事件，播放按钮,添加按钮，收藏按钮

    playBtnEve(); //3.1 播放按钮的事件
    addPlayBtnEve(); //3.2  添加到播放列表事件
    addMyLoveBtnEve(); //3.3
}
showAllMusic()

// 3.1、播放按钮的事件
function playBtnEve() {
    let audio = document.getElementById("audio"); //音乐控件
    let playingName = document.querySelector('.music-name') //音乐控件上面的名字显示
    let playBtns = document.querySelectorAll(".playBtn");
    //点击播放按钮完成几个部分
    //1.设置audio的地址为this.data-music-src  然后播放
    //2.设置playingName的内容为当前播放歌曲的名字
    //3.添加到临时列表中  addSnapList()
    //4、重新渲染临时列表  showSnapList()
    playBtns.forEach(item => {
        let src = item.getAttribute('data-music-src'); //音乐地址
        let name = item.previousElementSibling.innerText; //音乐名字
        let id = item.previousElementSibling.getAttribute("data-music-id"); //音乐id
        item.onclick = function () {
            audio.setAttribute('src', src);
            playingName.innerText = name;
            playingName.setAttribute("data-music-id", id)
            audio.play()
            //添加到临时列表中
            addSnapList({
                id,
                name,
                src
            });
        }
    })

}


//3.1.1
// 利用localStorage来制作临时列表 snapList
//并添加歌曲信息到临时列表
function addSnapList(obj) {
    let snapList = JSON.parse(localStorage.getItem("snapList")) || []; //取出临时列表数组
    //为空的时候，直接添加
    if (snapList.length == 0) {
        snapList.push(obj);
    } else {
        // 不为空的时候循环列表，看当前有没有与传入obj的id相同的选项，如果没有，才添加到临时列表中
        let flag = snapList.some(item => {
            if (item.id == obj.id) {
                return true;
            } else {
                return false;
            }
        })
        //如果flag==true 不添加
        //如果flag==false 添加
        if (flag) {
            document.getElementById("success").innerText =
                "列表已有,无需重复添加";
            document.getElementById("success").style.display =
                "block";
            setTimeout(function () {
                document.getElementById("success").style
                    .display = "none";
            }, 1000)
        } else {
            snapList.push(obj);
            document.getElementById("success").innerText =
                "添加到播放列表";
            document.getElementById("success").style.display =
                "block";
            setTimeout(function () {
                document.getElementById("success").style
                    .display = "none";
            }, 1000)
        }
    }
    localStorage.setItem("snapList", JSON.stringify(snapList))
    //把临时列表中的数据渲染出来
    showSnapList()
}

// 3.1.2
// 利用localStorage中的数据来渲染临时播放列表
function showSnapList() {
    let snapList = JSON.parse(localStorage.getItem("snapList"));
    // {id: "13", name: "周杰伦-Mojito", src: "http://192.168.6.16:7001/public/uploadMusic/1597046652561周杰伦-Mojito.mp3"}
    //找到临时列表snap-list下的ul
    let ul = document.querySelector(".snap-list ul");
    ul.innerHTML = ""
    snapList.forEach(item => {
        let li = document.createElement("li"); //创建li
        let span = document.createElement("span"); //创建span
        span.setAttribute("data-music-id", item.id); //创建自定义属性绑定歌曲id
        span.title = item.name;
        span.innerText = item.name; //写入歌曲名称
        let snapPlayBtn = document.createElement('button'); //创建播放按钮
        snapPlayBtn.setAttribute("class", "snapPlayBtn") //为播放按钮创建类名
        snapPlayBtn.setAttribute('data-music-src', item.src) //添加自定义属性绑定歌曲src
        snapPlayBtn.innerText = "播放";
        let snapDelBtn = document.createElement('button'); //创建添加到播放列表按钮
        snapDelBtn.setAttribute("class", "snapDelBtn") //为这个按钮创建类名
        snapDelBtn.innerText = "删除";
        li.appendChild(span);
        li.appendChild(snapPlayBtn);
        li.appendChild(snapDelBtn);
        ul.appendChild(li)
    })
    //给临时播放列表中的播放按钮加载事件
    addSnapPlayBtnEve()
    //给临时播放列表中的删除按钮加载事件
    addSnapSelBtnEve()
}
//页面刚加载的时候也需要渲染一次
showSnapList()


// 3.1.3
//给临时播放列表中的播放按钮加载事件
function addSnapPlayBtnEve() {
    let audio = document.getElementById("audio"); //音乐控件
    let playingName = document.querySelector('.music-name') //音乐控件上面的名字显示
    let snapPlayBtns = document.querySelectorAll(".snapPlayBtn");

    //1.设置audio的地址为this.data-music-src  然后播放
    //2.设置playingName的内容为当前播放歌曲的名字
    snapPlayBtns.forEach(item => {
        let src = item.getAttribute('data-music-src'); //音乐地址
        let name = item.previousElementSibling.innerText; //音乐名字
        let id = item.previousElementSibling.getAttribute("data-music-id"); //音乐名字

        item.onclick = function () {
            audio.setAttribute('src', src);
            playingName.innerText = name;
            playingName.setAttribute("data-music-id", id)
            audio.play()
        }
    })
}
// 3.1.4
//给临时播放列表中的删除按钮加载事件
function addSnapSelBtnEve() {
    let snapDelBtns = document.querySelectorAll(".snapDelBtn");
    //1.设置audio的地址为this.data-music-src  然后播放
    //2.设置playingName的内容为当前播放歌曲的名字
    snapDelBtns.forEach(item => {
        let id = item.parentElement.firstElementChild.getAttribute("data-music-id"); //音乐id
        item.onclick = function () {
            let snapList = JSON.parse(localStorage.getItem("snapList")); //取出临时列表数组
            //过滤掉当前这个被点击的按钮所属的item
            snapList = snapList.filter(item => {
                if (item.id != id) {
                    return true;
                }
            })

            localStorage.setItem("snapList", JSON.stringify(snapList)) //重新添加
            showSnapList() //重新渲染
        }
    })
}

//3.2 添加到播放列表的事件
function addPlayBtnEve() {
    let addPlayBtns = document.querySelectorAll(".addPlayBtn");
    addPlayBtns.forEach(item => {
        let src = item.previousElementSibling.getAttribute('data-music-src'); //音乐地址
        let name = item.parentElement.firstElementChild.innerText; //音乐名字
        let id = item.parentElement.firstElementChild.getAttribute("data-music-id"); //音乐id
        item.onclick = function () {
            //添加到临时列表中
            addSnapList({
                id,
                name,
                src
            });
        }
    })
}

//3.3 添加到收藏的事件
function addMyLoveBtnEve() {
    let addMyLoveBtns = document.querySelectorAll(".addMyLoveBtn");
    addMyLoveBtns.forEach(item => {
        item.onclick = function () {
            let musicSrc = item.previousElementSibling.previousElementSibling.getAttribute(
                'data-music-src'); //音乐地址
            let musicName = item.parentElement.firstElementChild.innerText; //音乐名字
            let musicId = item.parentElement.firstElementChild.getAttribute("data-music-id"); //音乐id
            let userId = getCookieByName("id");
            let userName = getCookieByName("name");

            if (!userId) {
                alert("您需要先登录哦")
            } else {
                // 验证是不是用户在点击
                axios.post('/isUser.do', {
                    id: userId,
                    name: userName
                }).then(res => {
                    if (res.data.length == 1) {
                        //说明这是用户，可以添加
                        axios.post('/addMyLove.do', {
                            musicId,
                            musicName,
                            musicSrc,
                            userId
                        }).then(res => {
                            if (res.data == 1) {
                                //显示收藏成功模态框
                                document.getElementById("success").innerText =
                                    "收藏成功";
                                document.getElementById("success").style.display =
                                    "block";
                                setTimeout(function () {
                                    document.getElementById("success").style
                                        .display = "none";
                                }, 1000)
                            } else if (res.data == 0) {
                                //已经存在，不必重复添加
                                document.getElementById("success").innerText =
                                    "列表已有，不必重复添加";
                                document.getElementById("success").style.display =
                                    "block";
                                setTimeout(function () {
                                    document.getElementById("success").style
                                        .display = "none";
                                }, 1000)
                            }
                        }).catch(err => console.log(err))
                    } else {
                        //如果不是一个用户
                        alert("管理员不配拥有此功能")
                    }
                }).catch(err => console.log(err))

            }

        }
    })
}

// 下一曲
document.querySelector(".next-music").onclick = switchMusic("next");
//当音频结束之后，自动执行下一曲
document.getElementById("audio").addEventListener("ended", switchMusic("next"));
//上一曲
document.querySelector(".prev-music").onclick = switchMusic("prev");

//下一曲思路找到正在播放的音乐id，然后去localstroage里面找到这一项的下一项，如果下一项不存在，则播放第一项
//上一曲思路，找到正在播放的音乐，然后去localstroage里面找到这一项的上一项，如果上一项不存在，则播放最后一项
//由于上下一区两个逻辑相似，为避免代码过于繁杂，封装成为一个切换音乐函数，switchMusic("next"||"prev")
function switchMusic(str) {
    let flag = str;
    return function () {
        let audio = document.getElementById("audio"); //音乐控件
        let playingName = document.querySelector('.music-name') //音乐控件上面的名字显示
        let id = playingName.getAttribute("data-music-id"); //获取当前播放音乐id
        let snapList = JSON.parse(localStorage.getItem("snapList")); //找到临时播放列表存放的数据
        let current = 0; //当前播放歌曲在数组中的位置
        //如果获取不到id，说明当前audio对象没有设置歌曲，直接播放第一首
        if (id == null) {
            //如果第一首存在则播放第一首，如果第一首都不在，弹出提示：播放列表没有歌曲
            if (snapList[0]) {
                audio.setAttribute('src', snapList[0].src);
                playingName.innerText = snapList[0].name;
                playingName.setAttribute("data-music-id", snapList[0].id);
                audio.play()
            } else {
                alert("列表中没有歌啦")
            }
        } else {
            //如果能获取到id，则通过遍历snapList，得到当前播放歌曲在数组中的位置
            for (let i in snapList) {
                if (snapList[i].id == id) {
                    current = i;
                    break;
                }
            }
            //如果是下一曲，则看当前项的下一项是否存在，如果存在则播放，不存在则播放第一项
            if(str=="next"){
                if (snapList[current * 1 + 1]) {
                    audio.setAttribute('src', snapList[current * 1 + 1].src);
                    playingName.innerText = snapList[current * 1 + 1].name;
                    playingName.setAttribute("data-music-id", snapList[current * 1 + 1].id);
                    audio.play()
                } else {
                    audio.setAttribute('src', snapList[0].src);
                    playingName.innerText = snapList[0].name;
                    playingName.setAttribute("data-music-id", snapList[0].id);
                    audio.play()
                }
            }
            //如果是上一曲，则看当前项的上一项是否存在，如果存在则播放，不存在则播放第一项
            if(str=="prev"){
                if (snapList[current * 1 -1]) {
                    audio.setAttribute('src', snapList[current * 1 -1].src);
                    playingName.innerText = snapList[current * 1 -1].name;
                    playingName.setAttribute("data-music-id", snapList[current * 1 -1].id);
                    audio.play()
                } else {
                    audio.setAttribute('src', snapList[snapList.length-1].src);
                    playingName.innerText =  snapList[snapList.length-1].name;
                    playingName.setAttribute("data-music-id",  snapList[snapList.length-1].id);
                    audio.play()
                }
            }
        }
    }
}