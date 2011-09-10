/**
 * 插件： Cookie管理
 *
 */
 

exports.init_request = function (web, request, debug) {
	request.addListener(function (req) {
		// 解析cookie
		req.cookie = unserializeCookie(req.headers['cookie']);
		
		req.next();
	});
}

exports.init_response = function (web, response, debug) {

	/**
	 * 设置Cookie
	 *
	 * @param {string} name Cookie名称
	 * @param {string} val Cookie值
	 * @param {object} options 选项
	 */
	response.ServerResponse.prototype.setCookie = function (name, val, options) {
		if (typeof options != 'object')
			options = {}
		if (typeof options.path != 'string')
			options.path = '/';
		if (!(options.expires instanceof Date))
			options.expires = new Date();
		if (isNaN(options.maxAge))
			options.maxAge = 0;
			
		var cookie = serializeCookie(name, val, options);
		this.setHeader('Set-Cookie', cookie);
	}
	
	/**
	 * 清除Cookie
	 *
	 * @param {string} name Cookie名称
	 * @param {object} options 选项
	 */
	response.ServerResponse.prototype.clearCookie = function (name, options) {
		this.setCookie(name, '', options);
	}
}




/**
 * 序列化Cookie
 *
 * @param {string} name Cookie名称
 * @param {string} val Cookie值
 * @param {object} options 选项，包括 path, expires, domain, secure
 * @return {string}
 */
serializeCookie = function (name, val, options) {
    var ret = name + '=' + escape(val) + ';';
	if (options.path)
		ret += ' path=' + options.path + ';';
	if (options.expires)
		ret += ' expires=' + options.expires.toGMTString() + ';';
	if (options.domain)
		ret += ' domain=' + options.domain + ';';
	if (options.secure)
		ret += ' secure';
	return ret;
};

/**
 * 反序列Cookie
 *
 * @param {string} cookies Cookie字符串
 * @return {object}
 */
unserializeCookie = function (cookies) {
	if (!cookies)
		return {}
	var cookieline = cookies.toString().split(';');
	var ret = {};
	for (i in cookieline) {
		var line = cookieline[i].trim().split('=');
		if (line.length > 1) {
			var k = line[0].trim();
			var v = unescape(line[1].trim());
			ret[k] = v;
		}
	}
	return ret;
}