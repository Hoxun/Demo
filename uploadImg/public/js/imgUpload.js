/**
 * [ImgUpload description]
 * @chooseFileButton object element  input[type=file]
 * @showImgContainer object element
 * @submitButton object element
 * @uploadAddress string
 */
(function() {
	window.imgUpload = imgUpload;
	function imgUpload(chooseFileButton, showImgContainer, submitButton, uploadAddress) {
		return new imgUpload.prototype.init(chooseFileButton, showImgContainer, submitButton, uploadAddress);
	}
	var formData = new FormData(),
		arrFiles = [];

	var init = imgUpload.prototype.init = function(fileInput, showBox, submitBtn, url) {
		if (!fileInput || !showBox || !submitBtn || !url) {
			return this;
		}
		fileInput.onchange = function() {
			showImg(fileInput, showBox, submitBtn);
		};
		submitBtn.onclick = function() {
			submitImg(url, resetFb(showBox, submitBtn));
		};
	}
	init.prototype = imgUpload.prototype;

	function resetFb(showBox, submitBtn) {
		var showBox = showBox,
			submitBtn = submitBtn;
		return function(message) {
			showBox.innerText = '';
			// arrFiles = [];
			arrFiles.splice(0, arrFiles.length);
			formData.delete("Img[]");
			submitBtn.style.display = 'none';
		}
	}

	function showImg(fileInput, showBox, submitBtn) {
		if (!fileInput.value) {
			return;
		}
		var fragment = document.createDocumentFragment(),
			arrTmp = [],
			isImg,
			imgEl,
			src,
			fileLen = fileInput.files.length;

		for (var i = 0; i < fileLen; i++) {
			isImg = checkImg(fileInput.files[i]);
			if (!isImg) {
				continue;
			}
			src = window.URL.createObjectURL(fileInput.files[i]);
			imgEl = createImgEl(src);
			fragment.appendChild(imgEl);
			arrTmp.push(fileInput.files[i]);
			deleteImg(imgEl, showBox);
		}
		// this.showBox.appendChild(fragment);
		// arrFiles = arrFiles.concat(arrTmp );
		showBox.insertBefore(fragment, showBox.firstElementChild);
		arrFiles = arrTmp.concat(arrFiles );
		// 清空 input 的内容，使得下次选择同一张图片时依然触发 onchange 事件；
		fileInput.value = '';
		submitBtn.style.display = 'inline-block';

	}
	
	// 检测是不是图片格式
	function checkImg(file) {
		var isImg;
		if (file.type.indexOf("image") == 0) {
			if (file.size >= 1024 * 1024) {
				alert('您这张"'+ file.name +'"图片大小过大，应小于1M');
				isImg = false;
			} else {
				isImg = true;
			}
		} else {
			alert('只能上传图片！\n 文件"' + file.name + '"不是图片。');
			isImg = false;
		}
		return isImg;
	}

	function createImgEl(src) {
		var figure,
			img,
			delBtn;
		figure = document.createElement('figure');
		img = document.createElement('img');
		img.setAttribute('src', src);
		figure.appendChild(img);

		delBtn = createDelBtn();
		figure.appendChild(delBtn);
		return figure;
	}

	function createDelBtn() {
		var figcaption = document.createElement('figcaption');
		figcaption.classList.add('delete-btn');
		figcaption.innerText = '删除';
		figcaption.style.display = 'none';
		return figcaption;
	}

	function deleteImg(imgEl, showBox) {
		var delBtn = imgEl.lastElementChild;
		showDelBtn(delBtn, imgEl);
		delBtn.onclick = function(e) {
			var imgLen = showBox.children.length;
			for (var i = 0; i < imgLen; i++) {
				if (showBox.children[i] == imgEl) {
					arrFiles.splice(i, 1);
					continue;
				}
			}
			showBox.removeChild(imgEl);
		}
	}

	function showDelBtn(delBtn, imgEl) {
		imgEl.onmouseenter = function() {
			delBtn.style.display = 'block';
		}
		imgEl.onmouseleave = function() {
			delBtn.style.display = 'none';
		}
		delBtn.onmouseenter = function() {
			delBtn.style.color = '#FF4400';
		}
		delBtn.onmouseleave = function() {
			delBtn.style.color = '#000000';
		}
	}
	function submitImg(url, fn) {
		var fileLen = arrFiles.length;
		if(!fileLen) {
			return;
		}
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		// console.log('OPENED', xhr.readyState);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var xhrData = xhr.responseText;
					alert(xhrData);
					fn(xhrData);
				} else {
					var xhrData = xhr.responseText;
					console.log(xhrData);
				}
			}
		};
		for (var i = 0; i < fileLen; i++) {
			formData.append("Img[]", arrFiles[i]);
		}
		xhr.send(formData);
	}
}());