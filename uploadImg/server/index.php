<?php
	// 设置编码格式
	header('Content-Type:text/html;charset=utf-8');
	// 允许 Ajax 跨域访问
	header('Access-Control-Allow-Origin:*');

	$arrLength = count($_FILES['Img']['name']);
	if($arrLength) {
		echo $arrLength . '张图片上传成功';
	}
	
	// print_r($_FILES);
	// print_r($_POST);
	// print_r($_REQUEST);
?>