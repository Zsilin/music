window.addEventListener('load',function(){
     //防抖措施
     function debonce(fn,time){
        let timer=null;  //这句代码只会执行一次
        return function(){
            //利用闭包的原理来使用debonce 里面的局部变量
            if(timer){
                clearTimeout(timer);
            }
            timer=setTimeout(fn,time); 
        }
    }
    
    //调整登录框位置的函数
    function fn(){
        let target=document.getElementById("login-regist-box");//登录框
        target.style.top=`${window.scrollY+(window.innerHeight-target.offsetHeight)/2}px`;
        target.style.left=`${window.scrollX+(window.innerWidth-target.offsetWidth)/2}px`;
        let target2=document.getElementById("success")// 收藏成功的小模态框
        target2.style.top=`${window.scrollY+(window.innerHeight-target.offsetHeight)/2}px`;
        target2.style.left=`${window.scrollX+(window.innerWidth-target.offsetWidth)/2-75}px`;
    }                   
    //让登录框和收藏成功的小模态框始终处于页面中间的位置
    window.addEventListener('scroll',debonce(fn,300))
    window.addEventListener('resize',debonce(fn,300))

    //点击关闭登录框
    document.querySelector(".close").addEventListener('click',function(){
        document.getElementById("login-regist-box").style.display="none";
    })





    //切换注册和登录
    let loginBtn = document.getElementById('login-btn');
    let registBtn = document.getElementById("regist-btn");
    let loginBox = document.getElementById("login-box");
    let registBox = document.getElementById("regist-box");
    loginBtn.addEventListener('click', function () {
        loginBox.style.display = 'block';
        registBox.style.display = 'none';
        loginBtn.classList.add('choose');
        registBtn.classList.remove("choose");
    })
    registBtn.addEventListener('click', function () {
        registBox.style.display = 'block';
        loginBox.style.display = 'none';
        registBtn.classList.add('choose');
        loginBtn.classList.remove("choose");
    })


    //登录验证
    document.getElementById('login').addEventListener("click", function () {
        let loginName = document.querySelector('#login-name').value;
        let loginPwd = document.querySelector("#login-pwd").value;
        //1、判断是管理员登录还是普通用户登录
        let typeValue = document.querySelector(".type input[name='type']:checked").value;

        //封装一个登录请求，适用两种登录
        function axiosAjax(type) {
            //发送登录请求
            return axios.post(`/${type}Login.do`, {
                loginName,
                loginPwd
            }).then(res => {
                console.log(res.data)
                if (res.data.length == 0) {
                    //说明用户名或者密码错误
                    document.querySelector(".login-tip").style.display = "block";
                    setTimeout(() => {
                        document.querySelector(".login-tip").style.display = "none";
                    }, 2000)
                } else {
                    //说明用户账户密码正确，登录成功
                    //添加cookie
                    alert("登录成功")
                    document.cookie = `name=${res.data[0].name}`;
                    document.cookie=`id=${res.data[0].id}`;
                    if(type=="user"){
                        window.location.href=`../html/user.html`;
                    }else if(type=="admin"){
                        window.location.href="../html/admin.html";
                    }
                   
                }
            }).catch(e => console.log(e))
        }


        if (typeValue == "user") {
            //1.1用户登录
            axiosAjax("user")
        } else if (typeValue == "admin") {
            //1.2密码登录
            axiosAjax("admin")
        }
    })


    //注册验证
   
    //1.1用户名验证
    let registNameTip = document.querySelector('p.regist-name-tip');//用户名提示
    let registNameInput = document.querySelector("#regist-name"); //用户名输入框
    

    //当用户名输入框获得焦点时做的事
    registNameInput.addEventListener('focus', function () {
        registNameTip.classList.remove("success","fail")
        registNameTip.style.display = "block";
        registNameTip.innerHTML = "用户名为 2-10个字符";
    })
    
    let flag1 = false; //用于判断用户名和密码是否合法
    let flag2 = false;
    //当用户名输入框失去焦点时，判断有没有足够的字符长度
    registNameInput.addEventListener('blur', function () {
        let registName = registNameInput.value; //获得输入的用户名
        //    如果字符长度不够,显示提示
        if (registName.length < 2 || registName.length > 10) {
            registNameTip.classList.remove("success","fail")
            registNameTip.classList.add("fail")
            registNameTip.style.display = "block";
            registNameTip.innerHTML = "用户名长度不符合规范";
            flag1=false;
        } else {
            //如果字符长度够，隐藏提示，并发送请求进行验证
            registNameTip.classList.remove("success","fail")
            registNameTip.style.display = "none";
            registNameTip.innerHTML = "用户名为 2-10个字符";

            //验证该用户名是否已经存在
            axios.post('/isHaveUser.do',{
                registName
            }).then(res=>{
                if(res.data.length==1){
                    //说明已经存在这个用户
                    registNameTip.classList.remove("success","fail")
                    registNameTip.classList.add("fail")
                    registNameTip.style.display = "block";
                    registNameTip.innerHTML = "该账户名已经存在";
                    flag1=false;
                }else{
                    //说明这个账户名是可以用的，别忘了flag1置为true
                    registNameTip.classList.remove("success","fail")
                    registNameTip.classList.add("success")
                    registNameTip.style.display = "block";
                    registNameTip.innerHTML = "恭喜该账户名可以使用";
                    flag1=true;
                }
            }).catch(e=>console.log(e))
        }
    })

    //1.2密码验证
    let registPwdTip = document.querySelector('p.regist-pwd-tip');//用户名提示
    let registPwdInput = document.querySelector("#regist-pwd"); //用户名输入框

    //当密码输入框获得焦点时做的事
    registPwdInput.addEventListener('focus', function () {
        registPwdTip.classList.remove("success","fail")
        registPwdTip.style.display = "block";
        registPwdTip.innerHTML = "密码为6-18位";
    })
    //当密码输入框失去焦点时，判断有没有足够的字符长度
    registPwdInput.addEventListener('blur', function () {
        let registPwd = registPwdInput.value;
        console.log(registPwd)
        //    如果字符长度不够,显示提示
        if (registPwd.length < 6 || registPwd.length > 18) {
            registPwdTip.classList.remove("success","fail")
            registPwdTip.classList.add("fail")
            registPwdTip.style.display = "block";
            registPwdTip.innerHTML = "密码长度不符合规范";
            flag2=false;
        }else{
            //如果字符长度符合规范，隐藏提示，flag2置为true
            registPwdTip.style.display = "none";
            flag2=true;
        }
    })



    //点击注册
    document.getElementById("regist").addEventListener('click',function(){
        if(flag1&&flag2){
            console.log('可以注册')
            let registName=registNameInput.value;
            let registPwd=registPwdInput.value;
            //发送请求进行注册
            axios.post('/userRegist.do',{
                registName,
                registPwd
            }).then(res=>{
                console.log(res)
               if(res.data==1){
                   //说明添加成功
                   alert('注册成功，请前往登录')
                   registNameInput.value='';
                   registPwdInput.value='';
                   registNameTip.style.display="none";
               }
            }).catch(e=>console.log(e))
        }else{
            alert("请正确填写数据")
        }
    })
})