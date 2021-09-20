sap.ui.define([
	"sap/m/MessageToast"
], function (MessageToast) {
	"use strict";

	var objectCopy = function (data) {
		return JSON.parse(JSON.stringify(data));
	};

	var _token = function (url) {
		var payload = {
			url: url,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			headers: {
				"X-CSRF-Token": "Fetch"
			}
		};

		var def = jQuery.Deferred();

		jQuery.ajax(payload)
			.done(function (d, s, x) {
				var token = x.getResponseHeader('x-csrf-token');
				def.resolve(token);
			})
			.fail(function (d, s, x) {
				var token = d.getResponseHeader('x-csrf-token');
				if (d.status == 200) {
					def.resolve(token);
				} else {
					def.reject(d, s, x);
				}
			});

		return def.promise();
	};

	var _call = function (payload) {
		var def = jQuery.Deferred();
		_token(payload.url)
			.done(function (token) {
				payload.headers = {
					"X-CSRF-Token": token
				};
				jQuery.ajax(payload).done(function (d, s, x) {
						def.resolve(d, s, x);
					})
					.fail(function (d, s, x) {
						def.reject(d, s, x);
					});
			})
			.fail(function (d, s, x) {
				def.reject(d, s, x);
			});
		return def.promise();
	};

	var got = function (url, opts) {
		opts = (opts) ? opts : {};
		var payload = {
			url: url,
			type: 'GET',
			dataType: opts.dataType || 'json',
			contentType: opts.contentType || 'application/json'
		};
		// commenting because abort isnt returned if def.promise() is returned - Rohit Nambiar [I077573]
		// var def = jQuery.ajax(payload);
		// return def.promise();
		return jQuery.ajax(payload);
	};

	var post = function (url, data, opts) {
		opts = (opts) ? opts : {};
		var payload = {
			url: url,
			type: 'POST',
			dataType: opts.dataType || 'json',
			contentType: opts.contentType || 'application/json',
			data: data
		};
		return _call(payload);
		// return jQuery.ajax(payload);
	};

	var put = function (url, data, opts) {
		opts = (opts) ? opts : {};
		var payload = {
			url: url,
			type: 'PUT',
			dataType: opts.dataType || 'json',
			contentType: opts.contentType || 'application/json',
			data: data
		};
		return _call(payload);
	};

	var del = function (url, opts) {
		opts = (opts) ? opts : {};
		var payload = {
			url: url,
			type: 'DELETE',
			dataType: opts.dataType || 'json',
			contentType: opts.contentType || 'application/json'
		};
		return _call(payload);
		// return jQuery.ajax(payload);
	};

	/**
	 * Util Method - To create clone or deep copy of any object
	 * @public
	 * @param {object} data : JS object to clone
	 * @return {object} cloned object
	 * @authors Rohit Nambiar [I077573]
	 */
	var clone = function (data) {
		return jQuery.extend(true, {}, data);
	};

	return {
		
		post: post,
		got: got,
		put: put,
		del: del,
		objectCopy: objectCopy,
		clone: clone

	};
});