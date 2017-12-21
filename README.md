# jquery 实现用户收藏/取消收藏，单项收藏，单项取消收藏

## 初始化
```html
<!-- begin 双项点击 收藏/取消 -->
<div class="icon-collection off-collection" data-id="kWg2insShnwF"></div>
<!-- end 双项点击 收藏/取消 -->
```
```js
$('.icon-collection').toggleCollection('on-collection','off-collection','/user/collect/addpoi/','/user/collect/delpoi/');
//第一个参数为已经成功收藏的class名称---<div class="icon-collection on-collection" data-id='itemId'></div>---
//第二个参数为已经取消收藏的class名称---<div class="icon-collection off-collection" data-id='itemId'></div>---
//第三个参数为用户点击收藏时，请求的地址；
//第四个参数为用户点击取消收藏时，请求的地址；
```
***
```html
<!-- begin 单项点击 收藏 -->
<b class="receive disable" data-id="">已经领取</b>
<!-- 去掉class属性中的 disable 为未领取状态 <b class="receive" data-id="">立即领取</b> -->
<!-- end 单项点击 收藏 -->
```

```js
$('.receive').addOperator('disable','/user/coupon/add/');
//第一个参数为收藏后 的样式 className
```
***
```html
<!-- begin 单项点击 取消 -->
<a class="delete-btn" href="javascript:void(0);">删除</a>
<!-- end 单项点击 取消 -->
```

```js
$('.delete-btn').delOperator('/user/coupon/del/');
```

***
### js逻辑处理
```js
$.fn.extend({
    toggleCollection (...parameters) {

        $(document).on('touchend',`.${this[0].classList[0]}`,function(){

            let _this = $(this),
                _className = _this.hasClass(parameters[0]),
                _id = _this.data('id'),     //id为要被（收藏/取消收藏）的项目id
                _url = '',
                _oldName,
                _newName;

                if(_className){
                    //如果是已收藏状态，那就执行-取消收藏-逻辑
                    _url = parameters[3] + _id;
                    _oldName = parameters[0];
                    _newName = parameters[1];
                }else{
                    //如果是未收藏状态，那就执行-收藏-逻辑
                    _url = parameters[2] + _id;
                    _oldName = parameters[1];
                    _newName = parameters[0];
                }
                return axios('toggle',_this,_url,_oldName,_newName);
            event.stopPropagation();

        });
    },

    addOperator (...parameters) {
        //只处理收藏
        $(document).on('touchend',`.${this[0].classList[0]}`,function(){
            let _this = $(this),
                _id = _this.data('id'),
                _url = parameters[1] + _id,
                _disName = parameters[0];
            if(_disName === this.classList[1]){
                return false;
            }
            return axios('add',_this,_url,_disName);
        })
        
    },
    delOperator (...parameters) {
        //只处理取消收藏
        $(document).on('touchend',`.${this[0].classList[0]}`,function(){
            let _this = $(this),
                _id = _this.data('id'),
                _url = parameters[1] + _id;
            return axios('del',_this,_url);
        })
        
    }

});

let axios = (type,obj,url,isClass,newClass) => {

    $.ajax(url)
    .done((data) => {
        
        if(data.result){
            //如果对返回的结果中：result的值为1时，表示成功
            switch(type){
                case 'del':
                obj.hide();
                break;
                case 'add':
                obj.addClass(isClass);
                break;
                default:
                obj.removeClass(isClass).addClass(newClass);
            }
            
        }else if(data.code === 10001){
            //如果返回的结果中：code值为10001时，表示用户未登录。执行跳转到 登陆界面
            window.location.href = '/account/login/';
        }
        //提示
        layer.open({
            content: data.msg
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
    })
    .catch((data) => {
        console.log(data);
    });

}
```

###### 技术一般简单的实现而已