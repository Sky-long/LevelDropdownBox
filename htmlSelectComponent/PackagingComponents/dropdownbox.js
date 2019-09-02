(function ($) {
    //使用js的严格模式
    'use strict';

    $.fn.selectTree = function (options) {
        //合并默认参数和用户传过来的参数
        options = $.extend({},$.fn.selectTree.defaults,options||{});
         var that = $(this);
         var strHtml="";
        var partmentList=[];
        var GafatherName=options.DataParam;
        var fatherId=options.fatherId;
        var childId=options.childId;
         //如果用户传了data的值，则使用data值，否则发送ajax请求去取data
        if (options.data){
            trunData(options.data);
            strHtml=initTree(partmentList);
            fatherChange(options.GafatherId);
            childrenChange(fatherId);
        }else {
            options.onBeforeLoad.call(that,options.param);
            if (!options.url)
                return;
            //发送远程请求获得data
            $.ajax({
                url: options.url,
                type:'get',
                success:function (data) {
                    trunData(data);
                    strHtml=initTree(partmentList);
                    fatherChange(options.GafatherId);
                    childrenChange(fatherId);
                }
            })

        }
        //将一维数组转成三级下拉框的数据格式
        function trunData(data) {
            //将一维数组转换成三级数据，返回partmentList
            for ( var i in data) {
                var n=i-1; // n=1 i=2   3
                var len = partmentList.length - 1;
                if (n >= 0) {
                    if (data[i].departmentName == data[n].departmentName) {
                        partmentList[len].father.push({
                            groupName:data[i].groupName,
                            children:[{
                                users: data[i].users
                            }]
                        })
                    }else {
                        partmentList.push({
                            "departmentName":data[i].departmentName,
                            "father":[{
                                groupName:data[i].groupName,
                                children:[{
                                    users: data[i].users
                                }]
                            }]
                        })
                    }
                }else {
                    partmentList.push({
                        "departmentName":data[i].departmentName,
                        "father":[{
                            groupName:data[i].groupName,
                            children:[{
                                users: data[i].users
                            }]
                        }]
                    })
                }
            }
            return  partmentList;
        }
        //初始化下拉框的值为数组下标[0]的值
        function initTree(data) {
            var strHtml = "";
            var GafatherName=options.DataParam;
            //==========Level3dropdownbox==============
            //一级初始值
            for (var i in data) {

                var str=GafatherName[0];
                $("#"+ options.GafatherId).append('<option>'+data[i][str]+'</option>');
            }
            //二级初始值
            var childData = data[0].father;
            for (var j in childData){
                var str=GafatherName[1];
                $("#"+ options.fatherId).append('<option>'+childData[j][str]+'</option>');
            }
            //三级初始值
            var userData = data[0].father[0].children
            for (var a in userData){
               // $('#Users_Manager').empty()
                var str=GafatherName[2];
                var t=userData[a][str]
                var ss=t.split(",")
                for (var s = 0; s < ss.length; s++) {
                    $("#"+ options.childId).append('<option>'+ss[s]+'</option>');
                }
            }
            return strHtml;
        };
        //二级下拉框点击事件
        function fatherChange(id) {
            $("#"+id).change(function () {
               var parentval=$(this).find('option:selected').val();
                console.log(parentval);
                for (var i in partmentList){
                    var strfather=GafatherName[0];
                    if (parentval==partmentList[i][strfather]) {
                        $('#'+fatherId).empty();
                        var childData=partmentList[i].father;
                        for ( var j in childData){
                            var strchild=GafatherName[1];
                            $('#'+fatherId).append('<option>'+childData[j][strchild]+'</option>');
                            var userData = partmentList[i].father[0].children
                            for (var a in userData){
                                $('#'+childId).empty()
                                var strchildren=GafatherName[2];
                                var t=userData[a][strchildren]
                                var ss=t.split(",")
                                for (var s = 0; s < ss.length; s++) {
                                    $('#'+childId).append('<option>'+ss[s]+'</option>');
                                }
                            }
                        }
                        break;
                    }
                }
            })
        }
        //三级下拉框点击事件
        function childrenChange(id) {
            $("#"+id).change(function () {
               var childval=$(this).find('option:selected').val();
                outerloop:
                    for (var i in partmentList){
                        var childData=partmentList[i].father;
                        for (var q in childData){
                            if (childval==childData[q].groupName) {
                                $('#'+childId).empty();
                                var Data=childData[q].children;
                                for (var a in Data){
                                    var t=Data[a].users
                                    var ss=t.split(",")
                                    for (var s = 0; s < ss.length; s++) {
                                        $('#'+childId).append('<option>'+ss[s]+'</option>');
                                    }
                                    break outerloop;
                                }
                            }
                        }
                    }
            })
        }
    };

    //默认参数
    $.fn.selectTree.defaults = {
        DataParam:null,
        GafatherId: null,
        fatherId: null,
        childId: null,
        url: null,
        param: null,
        data: null,
        onBeforeLoad: function (param) { },
        Success: function (data) { },
        onClickNode: function (selector) { }
    };
})(jQuery)