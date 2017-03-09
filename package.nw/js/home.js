$(function() {
	getL();

	$("#addIBtn").click(function() {
		var iName = $("#iName").val();
		var iIn = $("#iIn").val();
		var iOut = $("#iOut").val();
		var iDescription = $("#iDescription").val();
		var iMName = $("#iMName").val();
		var iMDescription = $("#iMDescription").val();

		if (iName == "" || iOut == "" || iMName == "") {
			alert("信息不完整");
			return;
		}
		$.ajax({
			type : "post",
			url : "http://192.168.1.115:8080/geti/addInterface",
			cache : false,
			dataType : "json",
			data : {
				"name" : iName,
				"input" : iIn,
				"output" : iOut,
				"description" : iDescription,
				"mName" : iMName,
				"mDescription" : iMDescription
			},
			success : function(data) {
				if (data.data) {
					$("#addIModal").modal('toggle');
					window.location.reload();
				} else {
					alert(data.msg);
					$("#addIModal").modal('toggle');
				}
			},
			error : function(jqXHR) {
				alert("error");
			}
		});
	});
	$("#addMBtn").click(function() {
		var mName = $("#amName").val();
		var mDescription = $("#amDescription").val();
		if (mName == "") {
			alert("信息不完整");
			return;
		}
		$.ajax({
			type : "post",
			url : "http://192.168.1.115:8080/geti/addModule",
			cache : false,
			dataType : "json",
			data : {
				"mName" : mName,
				"mDescription" : mDescription
			},
			success : function(data) {
				if (data.data) {
					$("#addMModal").modal('toggle');
					window.location.reload();
				} else {
					alert(data.msg);
					$("#addMModal").modal('toggle');
				}
			},
			error : function(jqXHR) {
				alert("error");
			}
		});
	});

	function getL() {
		$.ajax({
			type : "post",
			url : "http://192.168.1.115:8080/geti/getIM",
			cache : false,
			dataType : "json",
			success : function(data) {
				if (data.code === 1) {
					var li = "";
					for ( var i = 0; i < data.data.length; i++) {
						var mn = data.data[i].mName;
						var il = data.data[i].iName;
						li += "<ul class='nav nav-stacked nav-pills pi'>"
								+ "<p class='liHead'>" + mn + "</p>";
						for ( var j = 0; j < il.length; j++) {
							li += "<li><a href='#''>" + il[j] + "</a></li>";
						}
						li += "</ul>";
					}
					$("#lList").html(li);

					$(".liHead").click(function() {
						$(this).siblings().slideToggle();
					});
					$(".pi li").click(function() {
						$(".pi li").removeClass("active");
						$(this).addClass("active");
						var v = $(this).children().html();

						// ==============动态生成接口内容===============
						getR(v);
					});
				}
			},
			error : function(jqXHR) {
				alert("error");
			}
		});
	}
	function getR(v) {
		$.ajax({
			type : "post",
			url : "http://192.168.1.115:8080/geti/getInterface",
			dataType : "json",
			data : {
				"iName" : v
			},
			success : function(data) {
				if (data.code === 1) {
					// =========================动态生成接口信息==============================
					$("#itName").html("<u>" + data.data.name + "</u><hr>");
					// $("#itId").html(data.data.id);
					// $("#itMid").html(data.data.mid);
					$("#itInput").html(
							"<strong>输入参数：</strong><kbd>" + data.data.input
									+ "</kbd><hr>");
					var o = data.data.output;
					$("#itOutput").html(
							"<strong>输出参数：</strong><pre style='background: lemonchiffon'><h5>" + o
									+ "</h5></pre><hr>");
					$("#itDescription").html(
							"<strong>接口描述：</strong><p>" + data.data.description + "</p><hr>");
					$("#itTime").html(changeTime(data.data.time * 1000));
					$("#itEdit").html(
							"<button type='button'"
									+ " class='btn btn-primary'" + " id='itEI'"
									+ " data-toggle='modal'"
									+ " data-target='#itEModal' >编辑</button>"
									+ "&nbsp"
									+"<button type='button'"
									+ " class='btn btn-danger'" + " id='itDI'"
									+ " data-toggle='modal' data-target='#itDModal'"
									+ "  >删除</button>");
					
					//?为什么会显示两次
					var iid =data.data.id;
					$("#delIBtn").click(function(){
						alert(iid);
					});
//					$("#itDel").html(
//							"<button type='button'"
//							+ " class='btn btn-primary'" + " id='itDI'"
//							+ "  >删除</button>");

					// =========================动态生成模态框信息========================
					// itEModal 模态框id
					$("#imId").val(data.data.id);
					$("#imName").val(data.data.name);
					$("#imInput").val(data.data.input);
					$("#imOutput").val(data.data.output);
					$("#imDescription").val(data.data.description);
					$("#imTime").val(changeTime(data.data.time * 1000));
					$("#imMid").val(data.data.mid);

					// =========================编辑接口模态框提交事件========================
					$("#editIBtn").click(function() {
						var id = $("#imId").val();
						var name = $("#imName").val();
						var i = $("#imInput").val();
						var o = $("#imOutput").val();
						var de = $("#imDescription").val();
						var t = $("#imTime").val();
						var mid = $("#imMid").val();
						$.ajax({
							type : "post",
							url : "http://192.168.1.115:8080/geti/updateInterface",
							dataType : "json",
							data : {
								"id" : id,
								"name" : name,
								"input" : i,
								"output" : o,
								"description" : de,
								"MId" : mid
							},
							success : function(data) {
								if(data.data){
									$("#itEModal").modal('toggle');
									window.location.reload();
								}else{
									alert(data.msg);
									$("#itEModal").modal('toggle');
									window.location.reload();
								}
							},
							error : function(jqXHR) {
								alert("error");
							}
						});
					});
				} else {
					alert(data.msg);
				}
			},
			error : function(jqXHR) {
				alert("error");
			}
		});
	}

	function changeTime(ts) { // 时间戳转时间函数
		var timestamp = new Date(ts);
		var dtime = timestamp.toLocaleDateString().replace(/\//g, "/") + " "
				+ timestamp.toTimeString().substr(0, 8);
		return dtime;
	};
	
});