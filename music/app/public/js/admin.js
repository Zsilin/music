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
    let id = getCookieByName("id");
    if (!name) {
        window.location.href = "./user.html";
    } else {
        //验证该用户是不是管理员
        axios.post('/isAdmin.do', {
            id,
            name
        }).then(res => {
            //说明这是一个管理员
            if (res.data.length == 1) {
               console.log(1)
            } else {
                window.location.replace("./user.html");
            }
        }).catch(err => console.log(err))

    }
}
check()


window.addEventListener('load', function () {
    


    // 展示轮播图列表信息
    function showPicList() {
        document.querySelector("#picList table").innerHTML = "";
        axios.post("/getAllPic.do").then(res => {
            //创建表头放进table中
            let thead = createThead("图片名称", "操作")
            document.querySelector("#picList table").appendChild(thead)
            if (res.data.length == 0) {
                //如果数据库没有数据
                let p = document.createElement("p")
                p.style.textAlign = "center";
                p.innerText = "没有数据";
                document.querySelector("#picList").appendChild(p)
            } else {
                //如果有数据，清除“没有数据的字样”
                if (document.querySelectorAll("#picList p")[1]) {
                    document.querySelectorAll("#picList p")[1].remove()
                }
                //然后创建tbody
                let tbody = createTbody(res.data)
                document.querySelector("#picList table").appendChild(tbody)
                //再给tbody中的按钮添加事件
                picbtnAddEvent();
            }


        }).catch(err => console.log(err))
    }
    showPicList()

    //创建表头的函数//参数为表头的字样
    function createThead(...item) {
        let arr = item;
        // 创建表头
        let thead = document.createElement("thead");
        let tr = thead.appendChild(document.createElement("tr"))
        for (let i = 0; i < arr.length; i++) {
            let th = document.createElement("th");
            th.innerHTML = arr[i]
            tr.appendChild(th)
        }
        return thead;
    }
    // 创建tbody的函数
    function createTbody(arr) {
        let tbody = document.createElement("tbody");
        arr.forEach((item) => {
            let tr = document.createElement("tr")
            for (let i in item) {
                if (i == "name" || i == "type") {
                    let td = document.createElement("td");
                    td.innerHTML = item[i];
                    tr.appendChild(td)
                }
            }

            let td = document.createElement("td")
            let button = document.createElement('button');
            button.innerText = "删除";
            button.setAttribute("data-id", item.id)
            td.appendChild(button);
            tr.appendChild(td)
            tbody.appendChild(tr)
        })
        return tbody;
    }

    // 为删除图片按钮添加事件
    function picbtnAddEvent() {
        let btns = document.querySelectorAll("#picList table button");
        btns.forEach(item => {
            item.addEventListener('click', function () {
                let picId = this.getAttribute("data-id");
                axios.post('/deletePic.do', {
                    picId
                }).then(res => {
                    if (res.data == 1) {
                        //删除成功之后，清空table内容然后重新加载
                        alert('删除成功')

                        showPicList()
                    }
                }).catch(err => console.log(err))
            })
        })

    }

    //上传轮播图图片
    document.getElementById("upLoadPicBtn").onclick = function () {
        let file = document.getElementById("picFile").files[0]; //拿到图片
        let name = document.getElementById('picName').value;
        //如果没有选择文件，提示先选择文件
        if (!file) {
            alert("请先选择文件")
        } else if (document.querySelectorAll("#picList table tbody tr").length >= 8) {

            alert("轮播图数量超过限制，请删除再上传")
        } else {
            let formData = new FormData();
            formData.append("uploadFile", file, file.name);
            //如果有写名字就上传写入的名字，没有就上传文件本来的名字
            if (name) {
                formData.append("name", name)
            } else {
                formData.append("name", file.name)
            }
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data;boundary=" + new Date().getTime()
                }
            };
            axios.post("/uploadPic.do", formData, config)
                .then(res => {
                    if (res.data == 1) {
                        // 清空图片列表中的数据然后重新加载
                        alert("上传成功")

                        showPicList()
                    }
                })
                .catch(err => console.log(err));
        }

    }


    //更新音乐分类信息下拉列表的函数
    //在页面加载的时候使用，新增加了分类之后，需要使用
    //删除分类也可以使用
    function showTypeList() {
        document.querySelector("#musicType").innerHTML = ""; //清空select中的信息
        axios.get('/showTypeList.do').then(res => {
            //拿到结果之后给下拉菜单渲染数据
            let select = document.querySelector("#musicType");
            res.data.forEach(item => {
                let option = document.createElement("option");
                option.value = item.id;
                option.innerText = item.type;
                select.appendChild(option)
            })
            //渲染完下拉菜单之后，获取当前音乐种类的音乐信息
            document.querySelector("#musicList table").innerHTML = "";
            getMusicByType()
        }).catch(err => console.log(err))

    }
    showTypeList()

    // 为新增分类一系列按钮添加事件
    function addTypeEvent() {
        //点击新增按钮弹出弹框
        document.querySelector("#musicList .add").onclick = function () {
            document.querySelector("#addType").style.display = "block";
            document.querySelector("#editType").style.display = "none"; //防止两个弹框同时出现
        }
        //点击取消按钮关闭弹框
        document.querySelector("#addType .close").onclick = function () {
            document.querySelector("#addType").style.display = "none";
        }
        //点击确定按钮增添歌单种类数据
        document.querySelector("#addType .sure").onclick = function () {
            let newTypeName = document.querySelector("#newTypeName").value;
            if (newTypeName.trim().length) {
                axios.post("/addMusicType.do", {
                    newTypeName
                }).then(res => {
                    if (res.data == 1) {
                        //添加之后更新下拉菜单上面的数据
                        showTypeList(); //重新渲染列表
                        showType(); //重新渲染编辑列表弹框中的表格
                        document.querySelector("#addType").style.display = "none";
                    }
                }).catch(err => console.log(err))
            } else {
                alert("请填写歌单名字")
            }
        }
    }
    addTypeEvent()


    //更新编辑信息弹出框的表格信息
    //功能与showTypeList()相似，不过showTypeList是渲染下拉列表,可以使用同一请求
    function showType() {
        document.querySelector("#editType table").innerHTML = ""; //清空表格数据
        axios.get('/showTypeList.do').then(res => {
            let thead = createThead("分类名称", "操作")
            document.querySelector("#editType table").appendChild(thead)
            if (res.data.length == 0) {
                // 如果没有数据
                let p = document.createElement("p")
                p.style.textAlign = "center";
                p.innerText = "没有数据";
                document.querySelector("#editType").insertBefore(p, document.querySelector("#editType .btn"))
            } else {
                //如果有数据，清除“没有数据的字样”
                if (document.querySelectorAll("#editType p")[1]) {
                    document.querySelectorAll("#editType p")[1].remove()
                }
                let tbody = createTbody(res.data)
                document.querySelector("#editType table").appendChild(tbody)
            }

            // 渲染完成之后,为内部的删除按钮和修改信息增加事件(td双击可编辑)
            updAndDelTypeEvent();
        }).catch(err => console.log(err))
    }
    showType()

    // 修改或删除音乐分类 的事件
    function updAndDelTypeEvent() {
        //添加删除按钮的事件,当删除某个音乐分类时，type_id 为这个分类id 的歌曲也相应全部删除
        let btns = document.querySelectorAll("#editType table button");
        btns.forEach(item => {
            item.addEventListener('click', function () {
                let typeId = this.getAttribute("data-id");
                if (confirm("删除该分类对应的歌曲也将删除，确定？")) {
                    axios.post('/delMusicType.do', {
                        typeId
                    }).then(res => {
                        if (res.data == 1) {
                            //删除成功
                            alert("删除成功")
                            showType() //重新渲染编辑表格
                            showTypeList() //重新渲染下拉列表
                        }
                    }).catch(err => console.log(err))
                }
            })
        })
        //添加更改分类名字的事件
        //双击变成可编辑的状态
        //失焦后获取数据发送请求进行更改
        let tds = document.querySelectorAll("#editType tbody tr td:nth-of-type(1)");
        //我们需要获取当前音乐分类的id，该id在对应的btn上面可以获取
        for (let i in Array.from(tds)) {
            // console.log(btns[i].getAttribute("data-id"))
            //双击变成可编辑状态,并改变背景颜色
            tds[i].addEventListener('dblclick', function () {
                this.setAttribute("contenteditable", "true");
                this.style.backgroundColor = "#fff";
            })
            //失焦获取数据并发送请求
            tds[i].addEventListener('blur', function () {
                let typeId = btns[i].getAttribute("data-id");
                let updTypeName = this.innerText;
                //如果更改后的名称不为空
                if (updTypeName.trim().length) {
                    axios.post('/changeTypeName.do', {
                        typeId,
                        updTypeName
                    }).then(res => {
                        if (res.data == 1) {
                            //修改之后更新表格内容
                            showType();
                            //更新下拉菜单中的数据
                            showTypeList();
                        } else {
                            alert("修改失败")
                        }
                    }).catch(err => console.log(err))
                } else {
                    alert("不能为空")
                    showType();
                }



                this.setAttribute("contenteditable", "false");
                this.style.backgroundColor = "rgb(243, 246, 243)";
            })
        }
    }


    //为编辑分类一系列按钮添加事件
    function editTypeEvent() {
        //点击编辑按钮弹出弹框
        document.querySelector("#musicList .edit").onclick = function () {
            document.querySelector("#addType").style.display = "none";
            document.querySelector("#editType").style.display = "block";
        }
        //点击取消按钮关闭弹框
        document.querySelector("#editType .close").onclick = function () {
            document.querySelector("#editType").style.display = "none";
        }

    }
    editTypeEvent();




    //根据select的value来取出相应歌曲的函数
    //这样在表单的oninput事件中可以进行重新利用
    //在删除歌曲的时候也可以重新利用
    //页面刚加载的时候可以利用，需要渲染默认列表，但是下拉列表是异步生成的，所以需要在创建之后再调用函数
    function getMusicByType() {
        let typeId = document.querySelector("#musicType").value; //得到当前的分类id
        document.querySelector("#musicList table").innerHTML = ""; //先清空表格中的数据
        //在音乐列表中查找相应的数据
        axios.post('/getMusicByType.do', {
            typeId
        }).then(res => {
            //渲染到table中
            let thead = createThead("歌曲名", "操作") //创建td
            document.querySelector("#musicList table").append(thead)
            if (res.data.length == 0) {
                // 如果没有数据
                if (document.querySelectorAll("#musicList p")[1]) {
                    document.querySelectorAll("#musicList p")[1].remove();
                }
                let p = document.createElement("p")
                p.style.textAlign = "center";
                p.innerText = "没有数据";
                document.querySelector("#musicList").appendChild(p)
            } else {
                //如果有数据，先清除没有数据字样(如果有)，然后添加tbody
                if (document.querySelectorAll("#musicList p")[1]) {
                    document.querySelectorAll("#musicList p")[1].remove();
                }
                let tbody = createTbody(res.data);
                document.querySelector("#musicList table").append(tbody)
            }
            //为tbody中生成的删除按钮添加事件
            musicbtnAddEvent();
        }).catch(err => console.log(err))
    }

    //为删除音乐按钮添加事件
    function musicbtnAddEvent() {
        let btns = document.querySelectorAll("#musicList table button");
        btns.forEach(item => {
            item.addEventListener('click', function () {
                let musicId = this.getAttribute("data-id");
                axios.post('/deleteMusic.do', {
                    musicId
                }).then(res => {
                    if (res.data == 1) {
                        //删除成功之后，清空table内容然后重新加载
                        alert('删除成功')

                        getMusicByType()
                    }
                }).catch(err => console.log(err))
            })
        })
    }

    //对下拉框的改变进行监听，每一次改变需要得到当前分类的音乐列表
    document.querySelector("#musicType").oninput = function () {
        getMusicByType()
    }




    //上传音乐文件
    document.getElementById("upLoadMusicBtn").onclick = function () {
        let file = document.getElementById("musicFile").files[0]; //拿到图片
        let name = document.getElementById('musicName').value;
        let typeId = document.getElementById("musicType").value;
        //如果没有选择文件，提示先选择文件
        if (!file) {
            alert("请先选择文件")
        } else {
            let formData = new FormData();
            formData.append("uploadFile", file, file.name);
            //如果有写名字就上传写入的名字，没有就上传文件本来的名字
            if (name) {
                formData.append("name", name)
            } else {
                formData.append("name", file.name)
            }
            formData.append("typeId", typeId)
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data;boundary=" + new Date().getTime()
                }
            };
            axios.post("/uploadMusic.do", formData, config)
                .then(res => {
                    // console.log(res.data)
                    if (res.data == 1) {
                        alert("上传成功")
                        getMusicByType()
                    } else {
                        alert("上传失败")
                    }
                }).catch(err => console.log(err));
        }

    }


})