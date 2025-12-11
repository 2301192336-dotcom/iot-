window.onload = function(){
    
    let imglist = document.querySelectorAll('.iot_imglist>div');
    let leftBtn = document.querySelector('.iot_leftBtn');
    let rightBtn = document.querySelector('.iot_rightBtn');
    let btnlist = document.querySelectorAll('.iot_btnlist>span');
    let box = document.querySelector('.iot_box'); 
    let index = 0;
    let time;
    let isHovering = false;
    let isAnimating = false;//记录动画状态，防止点击过快




    autoPlay();
    btnClick();




    // 鼠标悬停处理：悬停时重置
    box.onmouseenter = function() {
        isHovering = true;
        clearInterval(time);
    }

    box.onmouseleave = function() {
        isHovering = false;
        autoPlay();
    }





    // 计时 循环执行主函数
    function autoPlay(){
        if(isHovering) return; 
        time = setInterval(() => {
            slideTo('right');
        }, 3000);
    }





    // 箭头分别左右滑
    leftBtn.onclick = function(){
        if(isAnimating) return;
        clearInterval(time);
        slideTo('left');
    }

    rightBtn.onclick = function(){
        if(isAnimating) return;
        clearInterval(time);
        slideTo('right');
    }






    // 修改：增加 targetIndex 参数，支持点击圆点直接跳转
    function slideTo(direction, targetIndex = -1){
        if(isAnimating) return; 
        isAnimating = true; 
    


        // 找下一张图，获得编号，给下面用
        let currentIndex = index;
        let nextIndex;

        // 如果指定了图片，则直接使用序号
        if (targetIndex != -1) {
            nextIndex = targetIndex;
        } else {
            // 否则根据方向计算
            if(direction == 'right'){
                nextIndex = (index + 1) % imglist.length;  //华为官网前几天更新了一下直接三张图变两张图了，然后我是根据最新的网站复刻的，但其实这里就是2
            } else {
                nextIndex = (index - 1 + imglist.length) % imglist.length;
            }
        }


        // 移除所有状态
        for(let i = 0; i < imglist.length; i++){
            imglist[i].classList.remove('iot_show', 'iot_slide-left', 'iot_slide-right', 'iot_slide-center');
            btnlist[i].classList.remove('iot_che');
        }
    




        // 准备完毕 开始写过渡





        // 1. 当前图先显示，再划走
        imglist[currentIndex].classList.add('iot_show');

        if(direction == 'right'){
            imglist[currentIndex].style.transform = 'translateX(-100%)';
        } else {
            imglist[currentIndex].style.transform = 'translateX(100%)';
        }
    

        // 3. 下一张图滑来
        imglist[nextIndex].classList.add('iot_show');
        
        if(direction == 'right'){
            imglist[nextIndex].classList.add('iot_slide-right'); 
            imglist[nextIndex].style.transform = 'translateX(100%)';
            setTimeout(() => {  // 不加延迟不行！
                imglist[nextIndex].style.transform = 'translateX(0)';
            }, 10);
        } else {
            imglist[nextIndex].classList.add('iot_slide-left'); 
            imglist[nextIndex].style.transform = 'translateX(-100%)';
            setTimeout(() => {
                imglist[nextIndex].style.transform = 'translateX(0)';
            }, 10);
        }
    


        // 更新
        index = nextIndex;
        // 添加che类，CSS伪元素动画会自动开始
        btnlist[index].classList.add('iot_che');
    
        
        // 结束
        setTimeout(() => {
            imglist[currentIndex].classList.remove('iot_show');
            imglist[currentIndex].style.transform = '';
            imglist[nextIndex].style.transform = '';
            isAnimating = false; 
        }, 400); // 对应CSS transition 0.2s 等动画完成再清除
    }







    function btnClick(){
        for(let i = 0; i < btnlist.length; i++){
            btnlist[i].onclick = () => {
                if(isAnimating || i == index) return; 
                clearInterval(time);
                
                // 判断方向并传入目标索引 i
                let direction = i > index ? 'right' : 'left';
                slideTo(direction, i);
            }
        }
    }
}