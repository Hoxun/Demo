/**
 * [ImgUpload description]
 * @chooseFileButton  element  input[type=file]
 * @showContainer element
 * @submitButton element
 */
var ImgUpload = {
	fileInput: null,
	showBox: null,
	submitBtn: null,
	url: "http://localhost/MYPHP/uploadImg/server/index.php",
	formData: new FormData(),
	arrFiles: [],
	_this: null,
	init: function(chooseFileButton, showContainer, submitButton) {
		_this = this;
		this.fileInput = chooseFileButton;
		this.showBox = showContainer;
		this.submitBtn = submitButton;
		this.showImg();
		this.submitImg();
	},
	showImg: function() {
		if (!this.fileInput.value) {
			return;
		}
		var fragment = document.createDocumentFragment(),
			arrTmp = [],
			isImg,
			imgEl,
			src,
			fileLen = this.fileInput.files.length;

		for (var i = 0; i < fileLen; i++) {
			isImg = this.checkImg(this.fileInput.files[i]);
			if (!isImg) {
				continue;
			}
			src = window.URL.createObjectURL(this.fileInput.files[i]);
			imgEl =  this.createImgEl(src);
			fragment.appendChild(imgEl);

			arrTmp.push(this.fileInput.files[i]);
			
		}
		// this.showBox.appendChild(fragment);
		this.showBox.insertBefore(fragment, this.showBox.firstChild);

		this.arrFiles = arrTmp.concat(this.arrFiles );
		// 清空 input 的内容，使得下次选择同一张图片时依然触发 onchange 事件；
		this.fileInput.value = '';
		this.submitBtn.style.display = 'inline-block';

		
	},
	createImgEl: function(src) {
		var figure,
			img,
			delBtn;
		figure = document.createElement('figure');
		img = document.createElement('img');
		img.setAttribute('src', src);
		figure.appendChild(img);

		delBtn = this.createDelBtn();
		figure.appendChild(delBtn);

		this.showDelBtn(delBtn);
		this.deleteImg(delBtn);
		return figure;
	},
	createDelBtn: function() {
		var figcaption = document.createElement('figcaption');
		figcaption.classList.add('delete-btn');
		figcaption.innerText = '删除';
		figcaption.style.display = 'none';
		return figcaption;
	},
	deleteImg: function(delBtn) {
		delBtn.onclick = function(e) {
			for (var i = 0; i < _this.showBox.children.length; i++) {
				if (_this.showBox.children[i] == e.target.parentElement) {
					_this.arrFiles.splice(i, 1);
					continue;
				}
			}
			var elTmp = this.parentNode;
			elTmp.parentNode.removeChild(elTmp);
		}
	},
	showDelBtn: function(delBtn) {
		var parentEl = delBtn.parentElement;
		parentEl.onmouseenter = function() {
			delBtn.style.display = 'block'
		}
		parentEl.onmouseleave = function() {
			delBtn.style.display = 'none'
		}
		delBtn.onmouseenter = function() {
			delBtn.style.color = '#FF4400'
		}
		delBtn.onmouseleave = function() {
			delBtn.style.color = '#000000'
		}
	},
	checkImg: function(file) {
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
	},
	submitImg: function() {
		this.submitBtn.onclick = function(event) {
			var xhr = new XMLHttpRequest(),
				fileLen = _this.arrFiles.length;
			if(!fileLen) {
				return;
			}
			xhr.open("POST", _this.url, true);
			// console.log('OPENED', xhr.readyState);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						var xhrData = xhr.responseText;
						_this.showBox.innerText = '';
						// console.log(xhrData);
						_this.arrFiles = [];
						_this.arrFiles.splice(0,_this.arrFiles.length);
						_this.formData.delete("Img[]");
						_this.submitBtn.style.display = 'none';
						alert(xhrData);
					} else {
						var xhrData = xhr.responseText;
						console.log(xhrData);
					}
				}
			};
			for (var i = 0; i < fileLen; i++) {
				_this.formData.append("Img[]", _this.arrFiles[i]);
			}
			// var x = _this.formData.entries();
			// console.log(x.next());
			// console.log(x.next());
			// console.log(x.next());
			// console.log(x.next());
			xhr.send(_this.formData);
		}
	}
}