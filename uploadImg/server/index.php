<?php
	// print_r($_FILES);
	$arrLength = count($_FILES['Img']['name']);
	if($arrLength) {
		echo $arrLength . '张图片上传成功';
	}

	// print_r($_POST);
	// print_r($_REQUEST);
	// print_r(['a','d']);
?>