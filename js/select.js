function Selects(options) {
    this.defaultOptions = {
        button: null
        , dropdown: null
        , search: null
        , option: null
        , issearch: false
        , didoption: null
        , placeholder: 'Select'
        , searchplaceholder: 'search'
        , odabrano: 'Selected'
        , ajaxUrl: ''
        , data: {
            q: 'q'
        }
        , ismultiselect: false
        , find: null
        , onSelect: null
    , };
    this.config = Object.assign({}, this.defaultOptions, options || {});
		this.config.option = typeof this.config.option  === 'string' ?  document.querySelector(this.config.option ) : this.config.option ;
    this.isDropdownOpen = false;
    this.currentOptionIndex = 0;
    this.lastTypedChar = '';
    this.lastMatchingIndex = 0;
    this.optionName = '';
    this.options = null;
    this.didoption = null;
    this.ids = null;
    this.create();
};
Selects.prototype.create = function() {
    let opts = this.config.option.options;
    let name = this.config.option.getAttribute("name");
    let ids = this.config.option.getAttribute("id");
    let css = this.config.option.getAttribute("style");
    if (ids === null) {
        ids = name;
    }
    if (css === null) {
        css = '';
    }
    this.ids = ids;
    this.optionName = name;
    if (this.config.option.getAttribute("multiple") !== null) {
        this.config.ismultiselect = true;
    }
    if (!this.config.ismultiselect) {
        for (i = 0; i < opts.length; i++) {
            if (opts[i].getAttribute("selected") !== null) {
                this.config.placeholder = opts[i].textContent;
            }
        }
    }
    let counter = document.querySelectorAll('.select-container');
    let zindex = 99999 - counter.length;
    let html = '<button\
			role="combobox' + ids + '"\
			value="';
    html += this.config.placeholder + '"\
			aria-controls="listbox"\
			aria-haspopup="listbox"\
			tabindex="0"\
			aria-expanded="false">';
    html += this.config.placeholder + '</button>\
		<ul role="listbox' + ids + '" >';
    if (this.config.issearch) {
        html += '<li class="select-search-box"><input type="text" class="select-search select-search' + ids + '" placeholder="' + this.config.searchplaceholder + '" title="' + this.config.searchplaceholder + '"> </li>';
    }
    for (i = 0; i < opts.length; i++) {
        selected = false;
        if (opts[i].getAttribute("selected") !== null) {
            selected = true;
        }
        if (!this.config.ismultiselect) {
            if (selected) {
                html += '<li role="option' + ids + '" class="active" data-value="' + opts[i].value + '" aria-selected="true">' + opts[i].textContent + '</li>';
            } else {
                html += '<li role="option' + ids + '" data-value="' + opts[i].value + '" >' + opts[i].textContent + '</li>';
            }
        } else {
            if (selected) {
                html += '<li role="option' + ids + '" class="active" data-value="' + opts[i].value + '" aria-selected="true"><label><input type="checkbox" checked="checked" name="' + name + '[]" value="' + opts[i].value + '" />' + opts[i].textContent + '</label></li>';
            } else {
                html += '<li role="option' + ids + '" data-value="' + opts[i].value + '" ><label><input type="checkbox" name="' + name + '[]" value="' + opts[i].value + '" />' + opts[i].textContent + '</label></li>';
            }
        }
    }
    html += '</ul>';
    let selectedid = '';
    if (!this.config.ismultiselect) {
        html += '<div  class="select-hidden-accessible"><select id="' + ids + '" name="' + name + '">';
        for (i = 0; i < opts.length; i++) {
            selected = '';
            if (opts[i].getAttribute("selected") !== null) {
                selected = 'selected="selected"';
            }
            html += '<option  value="' + opts[i].value + '" ' + selected + ' >' + opts[i].textContent + '</option>';
        }
        html += ' </select></div>';
    }
    let element = document.createElement('div');
    element.classList.add("select-container");
    element.innerHTML = html;
    css = css + "z-index:" + zindex + ";"
    element.setAttribute('style', css);
    this.config.option.replaceWith(element);
    this.didoption = document.querySelector('#' + ids);
    this.config.button = document.querySelector('[role="combobox' + ids + '"]');
    this.config.dropdown = document.querySelector('[role="listbox' + ids + '"]');
    this.options = document.querySelectorAll('[role="option' + ids + '"]');
    if (this.config.issearch) {
        this.config.search = document.querySelector('.select-search' + ids);
    }
    if (this.config.ismultiselect) {
        let broj = 0;
        let ukupno = 0;
        this.options.forEach(option => {
            ukupno++;
            if (option.firstElementChild.firstChild === null) {
                if (option.firstElementChild.checked == true) {
                    broj++;
                }
            } else {
                if (option.firstElementChild.firstChild.checked == true) {
                    broj++;
                }
            }
        });
        if (broj > 0) {
            this.config.button.innerHTML = this.config.odabrano + " " + broj + '/' + ukupno;
        }
    }
    this.bindEvent();
};
Selects.prototype.Search = function(text) {
    if (text == '') {
        this.options.forEach(option => {
            option.style.display = 'flex';
        });
        return;
    }
    if (typeof this.config.find === 'function') {
        this.config.find(text, option, this);
        return;
    }
    this.options.forEach(option => {
        option.style.display = option.innerHTML.toLowerCase().indexOf(text.toLowerCase()) > -1 ? 'flex' : 'none';
    });
};
Selects.prototype.handleDocumentInteraction = function(event) {
    const isClickInsideButton = this.config.button.contains(event.target);
    const isClickInsideDropdown = this.config.dropdown.contains(event.target);
    if (isClickInsideButton || (!isClickInsideDropdown && this.isDropdownOpen)) {
        this.toggleDropdown();
    }
    const clickedOption = event.target.closest('[role="option' + this.ids + '"]');
    if (clickedOption === null) {
        return;
    }
    if (!this.config.ismultiselect) {
        if (typeof clickedOption !== "undefined") {
            if (clickedOption !== null) {
                for (var i = 0; i < this.didoption.length; i++) {
                    option = this.didoption.options[i];
                    if (option.value == clickedOption.getAttribute("data-value")) {
                        option.setAttribute('selected', 'selected');
                    } else {
                        option.removeAttribute("selected");
                    }
                }
            }
        }
        if (clickedOption) {
            this.selectOptionByElement(clickedOption);
        }
    } else {
        if (clickedOption.firstElementChild.firstChild === null) {
            if (clickedOption.firstElementChild.checked == true) {
                clickedOption.firstElementChild.setAttribute("checked", 'checked');
                clickedOption.classList.add('active');
            } else {
                clickedOption.firstElementChild.removeAttribute("checked");
                clickedOption.classList.remove('active');
            }
        } else {
            if (clickedOption.firstElementChild.firstChild.checked == true) {
                clickedOption.firstElementChild.firstChild.setAttribute("checked", 'checked');
                clickedOption.classList.add('active');
            } else {
                clickedOption.firstElementChild.firstChild.removeAttribute("checked");
                clickedOption.classList.remove('active');
            }
        }
        let broj = 0;
        let ukupno = 0;
        this.options.forEach(option => {
            ukupno++;
            if (option.firstElementChild.firstChild === null) {
                if (option.firstElementChild.checked == true) {
                    broj++;
                }
            } else {
                if (option.firstElementChild.firstChild.checked == true) {
                    broj++;
                }
            }
        });
        this.config.button.innerHTML = this.config.odabrano + ' ' + broj + '/' + ukupno;
    }
};
Selects.prototype.selectOptionByElement = function(optionElement) {
    const optionValue = optionElement.textContent;
    if (typeof this.config.onSelect === 'function') {
        element = optionElement.getAttribute('data-value');
        this.config.onSelect(element, this.options);
    }
    this.didoption.value = optionElement.getAttribute('data-value');
    this.config.button.textContent = optionValue;
    this.options.forEach(option => {
        option.classList.remove('active');
        option.setAttribute('aria-selected', 'false');
    });
    optionElement.classList.add('active');
    optionElement.setAttribute('aria-selected', 'true');
    this.toggleDropdown();
};
Selects.prototype.toggleDropdown = function() {
    this.config.dropdown.classList.toggle('active');
    this.isDropdownOpen = !this.isDropdownOpen;
    this.config.button.setAttribute('aria-expanded', this.isDropdownOpen.toString());
    if (this.isDropdownOpen) {
        this.focusCurrentOption();
    } else {
        if (this.config.issearch) {
            this.config.search.value = '';
        }
        this.options.forEach(option => {
            option.style.display = 'flex';
        });
        this.config.button.focus();
    }
};
Selects.prototype.ajax = function(text) {
    let $this = this;
    let obj = {};
    Object.entries(this.config.data).forEach(entry => {
        const [key, value] = entry;
        if (key == 'q') {
            obj[value] = text;
        } else {
            obj[key] = value;
        }
    });
    $this.opajax({
        url: $this.config.ajaxUrl
        , type: 'POST'
        , data: obj
        , dataType: "json"
        , success: function(msg) {
            $this.options.forEach(option => {
                if (!$this.config.ismultiselect) {
                    option.remove();
                } else {
                    if (option.firstElementChild.firstChild.checked !== true) {
                        option.remove();
                    }
                }
            });
            if (!$this.config.ismultiselect) {
                while ($this.didoption.options.length > 0) {
                    $this.didoption.remove(0);
                }
            }
            for (var i = 0; i < msg.length; i++) {
                $this.addelement(msg[i].name, msg[i].id);
            }
        }
    });
};
Selects.prototype.opajax = function(opt) {
    opt.type = (opt.type || 'GET').toUpperCase();
    opt.async = opt.async != null ? opt.async : true;
    opt.contentType = opt.contentType != null ? opt.contentType : true;
    opt.dataType = opt.dataType != null ? opt.dataType : "html";
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                if (opt.dataType == 'json') {
                    opt.success && opt.success(JSON.parse(xhr.responseText), xhr.responseXML);
                } else {
                    opt.success && opt.success(xhr.responseText, xhr.responseXML);
                }
            } else {
                opt.fail && opt.fail(status);
            }
        }
    }
    if (opt.contentType) {
        if (this.isJson(opt.data)) {
            var arr = [];
            for (var name in opt.data) arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(opt.data[name]));
            opt.data = arr.join("&");
        }
    }
    if (opt.type == "GET") {
        xhr.open("GET", opt.url + "?" + opt.data, opt.async);
        xhr.send(null);
    } else if (opt.type == "POST") {
        xhr.open("POST", opt.url, opt.async);
        if (opt.contentType) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(opt.data);
    }
}
Selects.prototype.isJson = function(str) {
    if (typeof str === "string") {
        return false;
    }
    try {
        JSON.parse(JSON.stringify(str));
    } catch (e) {
        return false;
    }
    return true;
};
Selects.prototype.clear = function() {
    this.options.forEach(option => {
        option.remove();
    });
    this.config.dropdown = document.querySelector('[role="listbox' + this.ids + '"]');
    this.options = document.querySelectorAll('[role="option' + this.ids + '"]');
}
Selects.prototype.addelement = function(name, value) {
    if (!this.config.ismultiselect) {
        let li = document.createElement("li");
        li.textContent = name;
        li.setAttribute("role", "option");
        li.setAttribute("data-value", value);
        this.config.dropdown.appendChild(li);
    } else {
        html = '<li role="option' + this.ids + '" data-value="' + value + '" ><label><input type="checkbox" name="' + this.optionName + '[]" value="' + value + '" />' + name + '</label></li>';
        this.config.dropdown.innerHTML += html
    }
    this.config.dropdown = document.querySelector('[role="listbox' + this.ids + '"]');
    this.options = document.querySelectorAll('[role="option' + this.ids + '"]');
    if (!this.config.ismultiselect) {
        const option = new Option(name, value);
        this.didoption.add(option);
    }
};
Selects.prototype.handleSearch = function(e) {
    let text = e.target.value;
    if (this.config.ajaxUrl == '') {
        if (text == '') {
            this.options.forEach(option => {
                option.style.display = 'flex';
            });
            return;
        }
        this.Search(text);
        return;
    }
    if (text.length < 2) {
        return;
    }
    this.ajax(text);
};
Selects.prototype.bindEvent = function() {
    if (this.config.issearch) {
        this.config.search.addEventListener('keyup', this.handleSearch.bind(this));
    }
    document.addEventListener('click', this.handleDocumentInteraction.bind(this));
};
Selects.prototype.focusCurrentOption = function() {
    if (this.currentOptionIndex == '0') {
        return;
    }
    const currentOption = this.options[this.currentOptionIndex];
    if (typeof currentOption === "undefined") {
        this.config.button.focus();
        return;
    }
    if (typeof currentOption.textContent === "undefined") {
        return;
    }
    const optionLabel = currentOption.textContent;
    currentOption.classList.add('current');
    currentOption.focus();
    currentOption.scrollIntoView({
        block: 'nearest'
    , });
    this.options.forEach((option, index) => {
        if (option !== currentOption) {
            option.classList.remove('current');
        }
    });
};
(function($) {
    $.prototype.Selects = function(options) {
        this.each(function() {
            defaultOptions = {
                option: this
            };
            config = Object.assign({}, defaultOptions, options || {});
            new Selects(config);
        });
    }
})(EdJS);
