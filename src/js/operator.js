import '../libs/layer/3.0.3/mobile/need/layer.css';
import layer from '../libs/layer/3.0.3/mobile/layer';

$.fn.extend({
    toggleCollection (...parameters) {

        $(document).on('touchend',`.${this[0].classList[0]}`,function(){

            let _this = $(this),
                _className = _this.hasClass(parameters[0]),
                _id = _this.data('id'),
                _url = '',
                _oldName,
                _newName;

                if(_className){
                    //已收藏
                    _url = parameters[3] + _id;
                    _oldName = parameters[0];
                    _newName = parameters[1];
                }else{
                    //未收藏
                    _url = parameters[2] + _id;
                    _oldName = parameters[1];
                    _newName = parameters[0];
                }
                return axios('toggle',_this,_url,_oldName,_newName);
            event.stopPropagation();

        });
    },
    addOperator (...parameters) {

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

        $(document).on('touchend',`.${this[0].classList[0]}`,function(){
            let _this = $(this),
                _id = _this.data('id'),
                _url = parameters[0] + _id;
            return axios('del',_this,_url);
        })
        
    }

});

let axios = (type,obj,url,isClass,newClass) => {

    $.ajax(url)
    .done((data) => {
        
        if(data.result){

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

