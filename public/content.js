(function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

	/**
	 * @template T
	 * @template S
	 * @param {T} tar
	 * @param {S} src
	 * @returns {T & S}
	 */
	function assign(tar, src) {
		// @ts-ignore
		for (const k in src) tar[k] = src[k];
		return /** @type {T & S} */ (tar);
	}

	/** @returns {void} */
	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	function create_slot(definition, ctx, $$scope, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, $$scope, fn) {
		return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
	}

	function get_slot_changes(definition, $$scope, dirty, fn) {
		if (definition[2] && fn) {
			const lets = definition[2](fn(dirty));
			if ($$scope.dirty === undefined) {
				return lets;
			}
			if (typeof lets === 'object') {
				const merged = [];
				const len = Math.max($$scope.dirty.length, lets.length);
				for (let i = 0; i < len; i += 1) {
					merged[i] = $$scope.dirty[i] | lets[i];
				}
				return merged;
			}
			return $$scope.dirty | lets;
		}
		return $$scope.dirty;
	}

	/** @returns {void} */
	function update_slot_base(
		slot,
		slot_definition,
		ctx,
		$$scope,
		slot_changes,
		get_slot_context_fn
	) {
		if (slot_changes) {
			const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
			slot.p(slot_context, slot_changes);
		}
	}

	/** @returns {any[] | -1} */
	function get_all_dirty_from_scope($$scope) {
		if ($$scope.ctx.length > 32) {
			const dirty = [];
			const length = $$scope.ctx.length / 32;
			for (let i = 0; i < length; i++) {
				dirty[i] = -1;
			}
			return dirty;
		}
		return -1;
	}

	/** @type {typeof globalThis} */
	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: // @ts-ignore Node typings have this
			  global;

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @template {keyof SVGElementTagNameMap} K
	 * @param {K} name
	 * @returns {SVGElement}
	 */
	function svg_element(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @returns {Text} */
	function empty() {
		return text('');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @returns {void} */
	function set_style(node, key, value, important) {
		if (value == null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, important ? 'important' : '');
		}
	}

	/**
	 * @returns {void} */
	function toggle_class(element, name, toggle) {
		// The `!!` is required because an `undefined` flag means flipping the current state.
		element.classList.toggle(name, !!toggle);
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	/**
	 * Schedules a callback to run immediately before the component is unmounted.
	 *
	 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	 * only one that runs inside a server-side component.
	 *
	 * https://svelte.dev/docs/svelte#ondestroy
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
	}

	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](https://svelte.dev/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
	 * ```ts
	 * const dispatch = createEventDispatcher<{
	 *  loaded: never; // does not take a detail argument
	 *  change: string; // takes a detail argument of type string, which is required
	 *  optional: number | null; // takes an optional detail argument of type number
	 * }>();
	 * ```
	 *
	 * https://svelte.dev/docs/svelte#createeventdispatcher
	 * @template {Record<string, any>} [EventMap=any]
	 * @returns {import('./public.js').EventDispatcher<EventMap>}
	 */
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail, { cancelable = false } = {}) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
				callbacks.slice().forEach((fn) => {
					fn.call(component, event);
				});
				return !event.defaultPrevented;
			}
			return true;
		};
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @returns {void} */
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}

	/**
	 * @returns {void} */
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	/**
	 * The current version, as set in package.json.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-version
	 * @type {string}
	 */
	const VERSION = '4.2.19';
	const PUBLIC_VERSION = '4';

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @returns {void}
	 */
	function dispatch_dev(type, detail) {
		document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append_dev(target, node) {
		dispatch_dev('SvelteDOMInsert', { target, node });
		append(target, node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert_dev(target, node, anchor) {
		dispatch_dev('SvelteDOMInsert', { target, node, anchor });
		insert(target, node, anchor);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach_dev(node) {
		dispatch_dev('SvelteDOMRemove', { node });
		detach(node);
	}

	/**
	 * @param {Node} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @param {boolean} [has_prevent_default]
	 * @param {boolean} [has_stop_propagation]
	 * @param {boolean} [has_stop_immediate_propagation]
	 * @returns {() => void}
	 */
	function listen_dev(
		node,
		event,
		handler,
		options,
		has_prevent_default,
		has_stop_propagation,
		has_stop_immediate_propagation
	) {
		const modifiers =
			options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
		if (has_prevent_default) modifiers.push('preventDefault');
		if (has_stop_propagation) modifiers.push('stopPropagation');
		if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');
		dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
		const dispose = listen(node, event, handler, options);
		return () => {
			dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
			dispose();
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr_dev(node, attribute, value) {
		attr(node, attribute, value);
		if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
		else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data_dev(text, data) {
		data = '' + data;
		if (text.data === data) return;
		dispatch_dev('SvelteDOMSetData', { node: text, data });
		text.data = /** @type {string} */ (data);
	}

	/**
	 * @returns {void} */
	function validate_slots(name, slot, keys) {
		for (const slot_key of Object.keys(slot)) {
			if (!~keys.indexOf(slot_key)) {
				console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
			}
		}
	}

	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 *
	 * Can be used to create strongly typed Svelte components.
	 *
	 * #### Example:
	 *
	 * You have component library on npm called `component-library`, from which
	 * you export a component called `MyComponent`. For Svelte+TypeScript users,
	 * you want to provide typings. Therefore you create a `index.d.ts`:
	 * ```ts
	 * import { SvelteComponent } from "svelte";
	 * export class MyComponent extends SvelteComponent<{foo: string}> {}
	 * ```
	 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
	 * to provide intellisense and to use the component like this in a Svelte file
	 * with TypeScript:
	 * ```svelte
	 * <script lang="ts">
	 * 	import { MyComponent } from "component-library";
	 * </script>
	 * <MyComponent foo={'bar'} />
	 * ```
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 * @template {Record<string, any>} [Slots=any]
	 * @extends {SvelteComponent<Props, Events>}
	 */
	class SvelteComponentDev extends SvelteComponent {
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Props}
		 */
		$$prop_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Events}
		 */
		$$events_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Slots}
		 */
		$$slot_def;

		/** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error("'target' is a required option");
			}
			super();
		}

		/** @returns {void} */
		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn('Component was already destroyed'); // eslint-disable-line no-console
			};
		}

		/** @returns {void} */
		$capture_state() {}

		/** @returns {void} */
		$inject_state() {}
	}

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	/* src/components/BackslashLogo.svelte generated by Svelte v4.2.19 */
	const file$7 = "src/components/BackslashLogo.svelte";

	function create_fragment$7(ctx) {
		let svg;
		let path;
		let path_stroke_value;
		let path_transform_value;

		const block = {
			c: function create() {
				svg = svg_element("svg");
				path = svg_element("path");
				attr_dev(path, "d", "M0 -10 L0 10");
				attr_dev(path, "stroke", path_stroke_value = "rgb(" + /*offsetColor*/ ctx[0] + ")");
				attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
				attr_dev(path, "fill", "none");

				attr_dev(path, "transform", path_transform_value = "\n            rotate(" + (/*position*/ ctx[1] === 'right'
				? 180 + /*angle*/ ctx[4]
				: /*angle*/ ctx[4]) + ")\n            scale(" + /*scale*/ ctx[3] + " " + /*scale*/ ctx[3] + ")\n        ");

				attr_dev(path, "class", "svelte-3fqbmu");
				add_location(path, file$7, 11, 4, 432);
				attr_dev(svg, "width", "100%");
				attr_dev(svg, "height", "100%");
				attr_dev(svg, "viewBox", "-15 -15 30 30");
				attr_dev(svg, "class", "svelte-3fqbmu");
				add_location(svg, file$7, 10, 0, 371);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, svg, anchor);
				append_dev(svg, path);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*offsetColor*/ 1 && path_stroke_value !== (path_stroke_value = "rgb(" + /*offsetColor*/ ctx[0] + ")")) {
					attr_dev(path, "stroke", path_stroke_value);
				}

				if (dirty & /*strokeWidth*/ 4) {
					attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
				}

				if (dirty & /*position, angle, scale*/ 26 && path_transform_value !== (path_transform_value = "\n            rotate(" + (/*position*/ ctx[1] === 'right'
				? 180 + /*angle*/ ctx[4]
				: /*angle*/ ctx[4]) + ")\n            scale(" + /*scale*/ ctx[3] + " " + /*scale*/ ctx[3] + ")\n        ")) {
					attr_dev(path, "transform", path_transform_value);
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(svg);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$7.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$7($$self, $$props, $$invalidate) {
		let angle;
		let scale;
		let strokeWidth;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('BackslashLogo', slots, []);
		let { isExpanded = false } = $$props;
		let { offsetColor = '255, 69, 0' } = $$props;
		let { position = 'left' } = $$props;
		const writable_props = ['isExpanded', 'offsetColor', 'position'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BackslashLogo> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('isExpanded' in $$props) $$invalidate(5, isExpanded = $$props.isExpanded);
			if ('offsetColor' in $$props) $$invalidate(0, offsetColor = $$props.offsetColor);
			if ('position' in $$props) $$invalidate(1, position = $$props.position);
		};

		$$self.$capture_state = () => ({
			isExpanded,
			offsetColor,
			position,
			strokeWidth,
			scale,
			angle
		});

		$$self.$inject_state = $$props => {
			if ('isExpanded' in $$props) $$invalidate(5, isExpanded = $$props.isExpanded);
			if ('offsetColor' in $$props) $$invalidate(0, offsetColor = $$props.offsetColor);
			if ('position' in $$props) $$invalidate(1, position = $$props.position);
			if ('strokeWidth' in $$props) $$invalidate(2, strokeWidth = $$props.strokeWidth);
			if ('scale' in $$props) $$invalidate(3, scale = $$props.scale);
			if ('angle' in $$props) $$invalidate(4, angle = $$props.angle);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*isExpanded*/ 32) {
				$$invalidate(4, angle = isExpanded ? 3 : 20); // Use 20 degrees when not expanded
			}

			if ($$self.$$.dirty & /*isExpanded*/ 32) {
				$$invalidate(3, scale = isExpanded ? 6 : 1);
			}

			if ($$self.$$.dirty & /*isExpanded*/ 32) {
				$$invalidate(2, strokeWidth = isExpanded ? 0.1 : 2); // Adjust stroke width based on expansion
			}
		};

		return [offsetColor, position, strokeWidth, scale, angle, isExpanded];
	}

	class BackslashLogo extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$7, create_fragment$7, safe_not_equal, {
				isExpanded: 5,
				offsetColor: 0,
				position: 1
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "BackslashLogo",
				options,
				id: create_fragment$7.name
			});
		}

		get isExpanded() {
			throw new Error("<BackslashLogo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isExpanded(value) {
			throw new Error("<BackslashLogo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get offsetColor() {
			throw new Error("<BackslashLogo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set offsetColor(value) {
			throw new Error("<BackslashLogo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get position() {
			throw new Error("<BackslashLogo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set position(value) {
			throw new Error("<BackslashLogo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Popup.svelte generated by Svelte v4.2.19 */

	const { console: console_1$1 } = globals;
	const file$6 = "src/components/Popup.svelte";

	// (28:2) {#if isExpanded}
	function create_if_block$2(ctx) {
		let div;
		let current;
		const default_slot_template = /*#slots*/ ctx[4].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				attr_dev(div, "class", "content svelte-ugjwt1");
				add_location(div, file$6, 28, 4, 761);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[3],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$2.name,
			type: "if",
			source: "(28:2) {#if isExpanded}",
			ctx
		});

		return block;
	}

	function create_fragment$6(ctx) {
		let div2;
		let div0;
		let backslashlogo0;
		let t0;
		let t1;
		let div1;
		let backslashlogo1;
		let current;
		let mounted;
		let dispose;

		backslashlogo0 = new BackslashLogo({
				props: {
					isExpanded: /*isExpanded*/ ctx[0],
					offsetColor: /*offsetColor*/ ctx[1],
					position: "left"
				},
				$$inline: true
			});

		let if_block = /*isExpanded*/ ctx[0] && create_if_block$2(ctx);

		backslashlogo1 = new BackslashLogo({
				props: {
					isExpanded: /*isExpanded*/ ctx[0],
					offsetColor: /*offsetColor*/ ctx[1],
					position: "right"
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				div2 = element("div");
				div0 = element("div");
				create_component(backslashlogo0.$$.fragment);
				t0 = space();
				if (if_block) if_block.c();
				t1 = space();
				div1 = element("div");
				create_component(backslashlogo1.$$.fragment);
				attr_dev(div0, "class", "logo-container left svelte-ugjwt1");
				add_location(div0, file$6, 24, 2, 630);
				attr_dev(div1, "class", "logo-container right svelte-ugjwt1");
				add_location(div1, file$6, 32, 4, 828);
				attr_dev(div2, "class", "speed-reader-popup svelte-ugjwt1");
				toggle_class(div2, "expanded", /*isExpanded*/ ctx[0]);
				add_location(div2, file$6, 23, 0, 544);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, div0);
				mount_component(backslashlogo0, div0, null);
				append_dev(div2, t0);
				if (if_block) if_block.m(div2, null);
				append_dev(div2, t1);
				append_dev(div2, div1);
				mount_component(backslashlogo1, div1, null);
				current = true;

				if (!mounted) {
					dispose = listen_dev(div2, "click", /*handleClick*/ ctx[2], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				const backslashlogo0_changes = {};
				if (dirty & /*isExpanded*/ 1) backslashlogo0_changes.isExpanded = /*isExpanded*/ ctx[0];
				if (dirty & /*offsetColor*/ 2) backslashlogo0_changes.offsetColor = /*offsetColor*/ ctx[1];
				backslashlogo0.$set(backslashlogo0_changes);

				if (/*isExpanded*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*isExpanded*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$2(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(div2, t1);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}

				const backslashlogo1_changes = {};
				if (dirty & /*isExpanded*/ 1) backslashlogo1_changes.isExpanded = /*isExpanded*/ ctx[0];
				if (dirty & /*offsetColor*/ 2) backslashlogo1_changes.offsetColor = /*offsetColor*/ ctx[1];
				backslashlogo1.$set(backslashlogo1_changes);

				if (!current || dirty & /*isExpanded*/ 1) {
					toggle_class(div2, "expanded", /*isExpanded*/ ctx[0]);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(backslashlogo0.$$.fragment, local);
				transition_in(if_block);
				transition_in(backslashlogo1.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(backslashlogo0.$$.fragment, local);
				transition_out(if_block);
				transition_out(backslashlogo1.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
				}

				destroy_component(backslashlogo0);
				if (if_block) if_block.d();
				destroy_component(backslashlogo1);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$6.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$6($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Popup', slots, ['default']);
		let { isExpanded = false } = $$props;
		let { offsetColor = '255, 69, 0' } = $$props;
		const dispatch = createEventDispatcher();

		onMount(() => {
			console.log('Popup component mounted');
		});

		function handleClick() {
			console.log('Popup clicked');
			dispatch('click');
		}

		const writable_props = ['isExpanded', 'offsetColor'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Popup> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('isExpanded' in $$props) $$invalidate(0, isExpanded = $$props.isExpanded);
			if ('offsetColor' in $$props) $$invalidate(1, offsetColor = $$props.offsetColor);
			if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
		};

		$$self.$capture_state = () => ({
			createEventDispatcher,
			onMount,
			BackslashLogo,
			isExpanded,
			offsetColor,
			dispatch,
			handleClick
		});

		$$self.$inject_state = $$props => {
			if ('isExpanded' in $$props) $$invalidate(0, isExpanded = $$props.isExpanded);
			if ('offsetColor' in $$props) $$invalidate(1, offsetColor = $$props.offsetColor);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*isExpanded*/ 1) {
				{
					console.log('Popup isExpanded changed:', isExpanded);
				}
			}
		};

		return [isExpanded, offsetColor, handleClick, $$scope, slots];
	}

	class Popup extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$6, create_fragment$6, safe_not_equal, { isExpanded: 0, offsetColor: 1 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Popup",
				options,
				id: create_fragment$6.name
			});
		}

		get isExpanded() {
			throw new Error("<Popup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isExpanded(value) {
			throw new Error("<Popup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get offsetColor() {
			throw new Error("<Popup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set offsetColor(value) {
			throw new Error("<Popup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/BeforeText.svelte generated by Svelte v4.2.19 */
	const file$5 = "src/components/BeforeText.svelte";

	function create_fragment$5(ctx) {
		let span;
		let t;

		const block = {
			c: function create() {
				span = element("span");
				t = text(/*before*/ ctx[0]);
				attr_dev(span, "class", "speed-reader-before svelte-15ms0k2");
				add_location(span, file$5, 4, 2, 54);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*before*/ 1) set_data_dev(t, /*before*/ ctx[0]);
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(span);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$5.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$5($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('BeforeText', slots, []);
		let { before = '' } = $$props;
		const writable_props = ['before'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BeforeText> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('before' in $$props) $$invalidate(0, before = $$props.before);
		};

		$$self.$capture_state = () => ({ before });

		$$self.$inject_state = $$props => {
			if ('before' in $$props) $$invalidate(0, before = $$props.before);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [before];
	}

	class BeforeText extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$5, safe_not_equal, { before: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "BeforeText",
				options,
				id: create_fragment$5.name
			});
		}

		get before() {
			throw new Error("<BeforeText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set before(value) {
			throw new Error("<BeforeText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/CenterText.svelte generated by Svelte v4.2.19 */
	const file$4 = "src/components/CenterText.svelte";

	function create_fragment$4(ctx) {
		let span;
		let t;

		const block = {
			c: function create() {
				span = element("span");
				t = text(/*center*/ ctx[0]);
				attr_dev(span, "class", "speed-reader-center svelte-1objx8a");
				add_location(span, file$4, 4, 0, 48);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*center*/ 1) set_data_dev(t, /*center*/ ctx[0]);
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(span);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$4.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('CenterText', slots, []);
		let { center = '' } = $$props;
		const writable_props = ['center'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CenterText> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('center' in $$props) $$invalidate(0, center = $$props.center);
		};

		$$self.$capture_state = () => ({ center });

		$$self.$inject_state = $$props => {
			if ('center' in $$props) $$invalidate(0, center = $$props.center);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [center];
	}

	class CenterText extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$4, safe_not_equal, { center: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "CenterText",
				options,
				id: create_fragment$4.name
			});
		}

		get center() {
			throw new Error("<CenterText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set center(value) {
			throw new Error("<CenterText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/AfterText.svelte generated by Svelte v4.2.19 */
	const file$3 = "src/components/AfterText.svelte";

	function create_fragment$3(ctx) {
		let span;
		let t;

		const block = {
			c: function create() {
				span = element("span");
				t = text(/*after*/ ctx[0]);
				attr_dev(span, "class", "speed-reader-after svelte-jqlppn");
				add_location(span, file$3, 4, 2, 53);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*after*/ 1) set_data_dev(t, /*after*/ ctx[0]);
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(span);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$3.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('AfterText', slots, []);
		let { after = '' } = $$props;
		const writable_props = ['after'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AfterText> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('after' in $$props) $$invalidate(0, after = $$props.after);
		};

		$$self.$capture_state = () => ({ after });

		$$self.$inject_state = $$props => {
			if ('after' in $$props) $$invalidate(0, after = $$props.after);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [after];
	}

	class AfterText extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { after: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "AfterText",
				options,
				id: create_fragment$3.name
			});
		}

		get after() {
			throw new Error("<AfterText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set after(value) {
			throw new Error("<AfterText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Text.svelte generated by Svelte v4.2.19 */
	const file$2 = "src/components/Text.svelte";

	// (18:4) {:else}
	function create_else_block(ctx) {
		let centertext;
		let current;

		centertext = new CenterText({
				props: { center: "Click to start" },
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(centertext.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(centertext, target, anchor);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(centertext.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(centertext.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(centertext, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block.name,
			type: "else",
			source: "(18:4) {:else}",
			ctx
		});

		return block;
	}

	// (14:4) {#if isReading || (center && center !== 'Click to start')}
	function create_if_block$1(ctx) {
		let beforetext;
		let t0;
		let centertext;
		let t1;
		let aftertext;
		let current;

		beforetext = new BeforeText({
				props: { before: /*before*/ ctx[0] },
				$$inline: true
			});

		centertext = new CenterText({
				props: { center: /*center*/ ctx[1] },
				$$inline: true
			});

		aftertext = new AfterText({
				props: { after: /*after*/ ctx[2] },
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(beforetext.$$.fragment);
				t0 = space();
				create_component(centertext.$$.fragment);
				t1 = space();
				create_component(aftertext.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(beforetext, target, anchor);
				insert_dev(target, t0, anchor);
				mount_component(centertext, target, anchor);
				insert_dev(target, t1, anchor);
				mount_component(aftertext, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const beforetext_changes = {};
				if (dirty & /*before*/ 1) beforetext_changes.before = /*before*/ ctx[0];
				beforetext.$set(beforetext_changes);
				const centertext_changes = {};
				if (dirty & /*center*/ 2) centertext_changes.center = /*center*/ ctx[1];
				centertext.$set(centertext_changes);
				const aftertext_changes = {};
				if (dirty & /*after*/ 4) aftertext_changes.after = /*after*/ ctx[2];
				aftertext.$set(aftertext_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(beforetext.$$.fragment, local);
				transition_in(centertext.$$.fragment, local);
				transition_in(aftertext.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(beforetext.$$.fragment, local);
				transition_out(centertext.$$.fragment, local);
				transition_out(aftertext.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t0);
					detach_dev(t1);
				}

				destroy_component(beforetext, detaching);
				destroy_component(centertext, detaching);
				destroy_component(aftertext, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$1.name,
			type: "if",
			source: "(14:4) {#if isReading || (center && center !== 'Click to start')}",
			ctx
		});

		return block;
	}

	function create_fragment$2(ctx) {
		let div1;
		let div0;
		let t;
		let current_block_type_index;
		let if_block;
		let current;
		const if_block_creators = [create_if_block$1, create_else_block];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*isReading*/ ctx[3] || /*center*/ ctx[1] && /*center*/ ctx[1] !== 'Click to start') return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				t = space();
				if_block.c();
				attr_dev(div0, "class", "speed-reader-line svelte-xsvelt");
				add_location(div0, file$2, 12, 4, 333);
				attr_dev(div1, "class", "speed-reader-content svelte-xsvelt");
				add_location(div1, file$2, 11, 2, 294);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div1, t);
				if_blocks[current_block_type_index].m(div1, null);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(div1, null);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				if_blocks[current_block_type_index].d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$2.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Text', slots, []);
		let { before = '' } = $$props;
		let { center = '' } = $$props;
		let { after = '' } = $$props;
		let { isReading = false } = $$props;
		const writable_props = ['before', 'center', 'after', 'isReading'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('before' in $$props) $$invalidate(0, before = $$props.before);
			if ('center' in $$props) $$invalidate(1, center = $$props.center);
			if ('after' in $$props) $$invalidate(2, after = $$props.after);
			if ('isReading' in $$props) $$invalidate(3, isReading = $$props.isReading);
		};

		$$self.$capture_state = () => ({
			BeforeText,
			CenterText,
			AfterText,
			before,
			center,
			after,
			isReading
		});

		$$self.$inject_state = $$props => {
			if ('before' in $$props) $$invalidate(0, before = $$props.before);
			if ('center' in $$props) $$invalidate(1, center = $$props.center);
			if ('after' in $$props) $$invalidate(2, after = $$props.after);
			if ('isReading' in $$props) $$invalidate(3, isReading = $$props.isReading);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [before, center, after, isReading];
	}

	class Text extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$2, create_fragment$2, safe_not_equal, {
				before: 0,
				center: 1,
				after: 2,
				isReading: 3
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Text",
				options,
				id: create_fragment$2.name
			});
		}

		get before() {
			throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set before(value) {
			throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get center() {
			throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set center(value) {
			throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get after() {
			throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set after(value) {
			throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get isReading() {
			throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isReading(value) {
			throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/ProgressBar.svelte generated by Svelte v4.2.19 */
	const file$1 = "src/components/ProgressBar.svelte";

	function create_fragment$1(ctx) {
		let div;

		const block = {
			c: function create() {
				div = element("div");
				attr_dev(div, "class", "speed-reader-progress svelte-1r2yrqc");
				set_style(div, "width", /*progress*/ ctx[0] + "%");
				add_location(div, file$1, 4, 2, 55);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*progress*/ 1) {
					set_style(div, "width", /*progress*/ ctx[0] + "%");
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$1.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('ProgressBar', slots, []);
		let { progress = 0 } = $$props;
		const writable_props = ['progress'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProgressBar> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('progress' in $$props) $$invalidate(0, progress = $$props.progress);
		};

		$$self.$capture_state = () => ({ progress });

		$$self.$inject_state = $$props => {
			if ('progress' in $$props) $$invalidate(0, progress = $$props.progress);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [progress];
	}

	class ProgressBar extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, { progress: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "ProgressBar",
				options,
				id: create_fragment$1.name
			});
		}

		get progress() {
			throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set progress(value) {
			throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/SpeedReader.svelte generated by Svelte v4.2.19 */

	const { console: console_1 } = globals;
	const file = "src/SpeedReader.svelte";

	// (77:2) {#if isExpanded}
	function create_if_block(ctx) {
		let div;
		let text_1;
		let t;
		let progressbar;
		let current;

		text_1 = new Text({
				props: {
					before: /*currentWord*/ ctx[2].before,
					center: /*currentWord*/ ctx[2].center,
					after: /*currentWord*/ ctx[2].after,
					isReading: /*isReading*/ ctx[4]
				},
				$$inline: true
			});

		progressbar = new ProgressBar({
				props: { progress: /*progress*/ ctx[3] },
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				create_component(text_1.$$.fragment);
				t = space();
				create_component(progressbar.$$.fragment);
				attr_dev(div, "class", "content-wrapper svelte-s3gzzj");
				add_location(div, file, 77, 4, 1905);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(text_1, div, null);
				append_dev(div, t);
				mount_component(progressbar, div, null);
				current = true;
			},
			p: function update(ctx, dirty) {
				const text_1_changes = {};
				if (dirty & /*currentWord*/ 4) text_1_changes.before = /*currentWord*/ ctx[2].before;
				if (dirty & /*currentWord*/ 4) text_1_changes.center = /*currentWord*/ ctx[2].center;
				if (dirty & /*currentWord*/ 4) text_1_changes.after = /*currentWord*/ ctx[2].after;
				if (dirty & /*isReading*/ 16) text_1_changes.isReading = /*isReading*/ ctx[4];
				text_1.$set(text_1_changes);
				const progressbar_changes = {};
				if (dirty & /*progress*/ 8) progressbar_changes.progress = /*progress*/ ctx[3];
				progressbar.$set(progressbar_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(text_1.$$.fragment, local);
				transition_in(progressbar.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(text_1.$$.fragment, local);
				transition_out(progressbar.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(text_1);
				destroy_component(progressbar);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block.name,
			type: "if",
			source: "(77:2) {#if isExpanded}",
			ctx
		});

		return block;
	}

	// (76:0) <Popup {isExpanded} {offsetColor} on:click={handleClick}>
	function create_default_slot(ctx) {
		let if_block_anchor;
		let current;
		let if_block = /*isExpanded*/ ctx[0] && create_if_block(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (/*isExpanded*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*isExpanded*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

				if (if_block) if_block.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot.name,
			type: "slot",
			source: "(76:0) <Popup {isExpanded} {offsetColor} on:click={handleClick}>",
			ctx
		});

		return block;
	}

	function create_fragment(ctx) {
		let popup;
		let current;

		popup = new Popup({
				props: {
					isExpanded: /*isExpanded*/ ctx[0],
					offsetColor: /*offsetColor*/ ctx[1],
					$$slots: { default: [create_default_slot] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		popup.$on("click", /*handleClick*/ ctx[5]);

		const block = {
			c: function create() {
				create_component(popup.$$.fragment);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(popup, target, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const popup_changes = {};
				if (dirty & /*isExpanded*/ 1) popup_changes.isExpanded = /*isExpanded*/ ctx[0];
				if (dirty & /*offsetColor*/ 2) popup_changes.offsetColor = /*offsetColor*/ ctx[1];

				if (dirty & /*$$scope, progress, currentWord, isReading, isExpanded*/ 4125) {
					popup_changes.$$scope = { dirty, ctx };
				}

				popup.$set(popup_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(popup.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(popup.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(popup, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function splitWord(word) {
		const length = word.length;
		const centerIndex = Math.floor((length - 1) / 2);

		return {
			before: word.slice(0, centerIndex),
			center: word[centerIndex],
			after: word.slice(centerIndex + 1)
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('SpeedReader', slots, []);
		let { words = [] } = $$props;
		let { wordsPerMinute = 400 } = $$props;
		let { isExpanded = false } = $$props;
		let { offsetColor = '255, 69, 0' } = $$props;
		let currentWord = { before: '', center: '', after: '' };
		let progress = 0;
		let isReading = false;
		let wordIndex = 0;
		let interval;

		onMount(() => {
			console.log('SpeedReader component mounted');
		});

		function startReading() {
			console.log('startReading called');
			$$invalidate(4, isReading = true);
			wordIndex = 0;

			interval = setInterval(
				() => {
					if (wordIndex < words.length) {
						$$invalidate(2, currentWord = splitWord(words[wordIndex]));
						$$invalidate(3, progress = (wordIndex + 1) / words.length * 100);
						wordIndex++;
					} else {
						stopReading();

						$$invalidate(2, currentWord = {
							before: '',
							center: 'Finished',
							after: ''
						});
					}
				},
				60000 / wordsPerMinute
			);
		}

		function stopReading() {
			console.log('stopReading called');
			$$invalidate(4, isReading = false);
			clearInterval(interval);
		}

		function handleClick() {
			console.log('handleClick called');

			if (isExpanded) {
				if (isReading) {
					stopReading();
				} else {
					startReading();
				}
			}
		}

		onDestroy(() => {
			if (interval) clearInterval(interval);
			console.log('SpeedReader component destroyed');
		});

		const writable_props = ['words', 'wordsPerMinute', 'isExpanded', 'offsetColor'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<SpeedReader> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('words' in $$props) $$invalidate(6, words = $$props.words);
			if ('wordsPerMinute' in $$props) $$invalidate(7, wordsPerMinute = $$props.wordsPerMinute);
			if ('isExpanded' in $$props) $$invalidate(0, isExpanded = $$props.isExpanded);
			if ('offsetColor' in $$props) $$invalidate(1, offsetColor = $$props.offsetColor);
		};

		$$self.$capture_state = () => ({
			onMount,
			onDestroy,
			Popup,
			Text,
			ProgressBar,
			words,
			wordsPerMinute,
			isExpanded,
			offsetColor,
			currentWord,
			progress,
			isReading,
			wordIndex,
			interval,
			splitWord,
			startReading,
			stopReading,
			handleClick
		});

		$$self.$inject_state = $$props => {
			if ('words' in $$props) $$invalidate(6, words = $$props.words);
			if ('wordsPerMinute' in $$props) $$invalidate(7, wordsPerMinute = $$props.wordsPerMinute);
			if ('isExpanded' in $$props) $$invalidate(0, isExpanded = $$props.isExpanded);
			if ('offsetColor' in $$props) $$invalidate(1, offsetColor = $$props.offsetColor);
			if ('currentWord' in $$props) $$invalidate(2, currentWord = $$props.currentWord);
			if ('progress' in $$props) $$invalidate(3, progress = $$props.progress);
			if ('isReading' in $$props) $$invalidate(4, isReading = $$props.isReading);
			if ('wordIndex' in $$props) wordIndex = $$props.wordIndex;
			if ('interval' in $$props) interval = $$props.interval;
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*isExpanded*/ 1) {
				{
					console.log('isExpanded changed:', isExpanded);
				}
			}
		};

		return [
			isExpanded,
			offsetColor,
			currentWord,
			progress,
			isReading,
			handleClick,
			words,
			wordsPerMinute
		];
	}

	class SpeedReader extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance, create_fragment, safe_not_equal, {
				words: 6,
				wordsPerMinute: 7,
				isExpanded: 0,
				offsetColor: 1
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "SpeedReader",
				options,
				id: create_fragment.name
			});
		}

		get words() {
			throw new Error("<SpeedReader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set words(value) {
			throw new Error("<SpeedReader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get wordsPerMinute() {
			throw new Error("<SpeedReader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set wordsPerMinute(value) {
			throw new Error("<SpeedReader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get isExpanded() {
			throw new Error("<SpeedReader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isExpanded(value) {
			throw new Error("<SpeedReader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get offsetColor() {
			throw new Error("<SpeedReader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set offsetColor(value) {
			throw new Error("<SpeedReader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	const HIDE_DELAY = 1000;
	const MIN_WORDS = 10;
	const SMALL_SIZE = 30;
	const FULL_WIDTH = 300;
	const FULL_HEIGHT = 100;
	const SHOW_DELAY = 500; // New constant for the 1-second delay before showing
	const CURSOR_OFFSET_X = 10; // Offset to the right of the cursor
	const CURSOR_OFFSET_Y = -10; // Offset above the cursor

	function debounce(func, wait) {
	  let timeout;
	  return function executedFunction(...args) {
	    const later = () => {
	      clearTimeout(timeout);
	      func(...args);
	    };
	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);
	  };
	}

	function throttle(func, limit) {
	  let inThrottle;
	  return function(...args) {
	    if (!inThrottle) {
	      func(...args);
	      inThrottle = true;
	      setTimeout(() => inThrottle = false, limit);
	    }
	  }
	}

	function isOverSpeedReaderOrParagraph(e) {
	  return (speedReaderDiv && speedReaderDiv.contains(e.target)) || 
	         (currentElement && currentElement.contains(e.target));
	}

	let speedReader;
	let currentElement = null;
	let speedReaderDiv = null;
	let isParagraphConsideredHovered = false;
	let isOverPopup = false;
	let lastMousePosition = { x: 0, y: 0 };
	let removalTimeout = null;

	function handleMouseMove(e) {
	  console.log('Mouse moved');
	  
	  if (isOverPopup) {
	    debugger;
	    isParagraphConsideredHovered = true;
	    stopRemovalCountdown('because im not over the paragraph');
	  } else {
	    console.log('Initiating popup removal');
	    initiatePopupRemoval();
	  }

	  lastMousePosition = { x: e.clientX, y: e.clientY };
	  const target = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
	  const text = target.innerText;
	  const words = text.split(/\s+/);
	  
	  if (words.length >= MIN_WORDS && target !== currentElement) {
	    debouncedShowPopup(target, words);
	  }

	  if (speedReaderDiv) {
	    debouncedHidePopup();
	  }
	}

	//create a function that will be called initiate popup removal. this will initiate the countdown to removing the popup. another function stop removal countdown will also be needed.

	function initiatePopupRemoval() {
	  console.log('Initiating popup removal');
	  if (removalTimeout) {
	    console.log('Removal countdown already initiated');
	    return;
	  }
	  console.log('>>>>Initiating removal countdown');
	  removalTimeout = setTimeout(() => {
	    console.log('>>>>Removal countdown complete');
	    hidePopup();
	  }, HIDE_DELAY); // Use SHOW_DELAY for consistency
	}

	function stopRemovalCountdown(a) {
	  if (removalTimeout) {
	    console.log('Stopping removal countdown',a);
	    clearTimeout(removalTimeout);
	    removalTimeout = null;
	  }
	  isParagraphConsideredHovered = true;
	}
	function showPopup(target, words) {
	  console.log('showPopup called');
	  stopRemovalCountdown('because im showing popup'); // Stop any ongoing removal countdown
	  if (speedReader) {
	    console.log('Destroying existing SpeedReader');
	    speedReader.$destroy();
	  }

	  speedReaderDiv = document.createElement('div');
	  document.body.appendChild(speedReaderDiv);

	  target.classList.add('paragraph-highlight');

	  speedReader = new SpeedReader({
	    target: speedReaderDiv,
	    props: {
	      words: words,
	      wordsPerMinute: 400,
	      isExpanded: false,
	      offsetColor: '255, 69, 0'
	    }
	  });

	  console.log('SpeedReader component created:', speedReader);

	  positionSpeedReader();

	  speedReaderDiv.addEventListener('mouseenter', () => {
	    isOverPopup = true;
	    isParagraphConsideredHovered = true;
	    expandSpeedReader();
	  });
	  speedReaderDiv.addEventListener('mouseleave', handleSpeedReaderLeave);

	  target.addEventListener('mouseleave', handleParagraphLeave);
	}

	function hidePopup() {
	  console.log('hidePopup called');
	  if (speedReader) {
	    speedReader.$destroy();
	    speedReader = null;
	  }
	  if (speedReaderDiv) {
	    speedReaderDiv.remove();
	    speedReaderDiv = null;
	  }
	  if (currentElement) {
	    currentElement.classList.remove('paragraph-highlight', 'expanded');
	    currentElement = null;
	  }
	  isParagraphConsideredHovered = false;
	  removalTimeout = null; // Reset the removal timeout
	}

	const debouncedShowPopup = debounce((target, words) => {
	  console.log('Debounced show popup');
	  currentElement = target;
	  isParagraphConsideredHovered = true;
	  showPopup(target, words);
	}, SHOW_DELAY);

	const debouncedHidePopup = debounce(() => {
	  console.log('Debounced hide popup');
	  if (!isParagraphConsideredHovered) {
	    hidePopup();
	  }
	}, SHOW_DELAY);

	function handleParagraphLeave(e) {
	  console.log('Paragraph left');
	  if (!isOverSpeedReaderOrParagraph(e)) {
	    initiatePopupRemoval();
	  }
	}

	function handleSpeedReaderLeave(e) {
	  console.log('SpeedReader left');
	  isOverPopup = false;
	  shrinkSpeedReader();
	}

	function positionSpeedReader() {
	  if (speedReaderDiv) {
	    const left = lastMousePosition.x + CURSOR_OFFSET_X;
	    const top = lastMousePosition.y + CURSOR_OFFSET_Y;

	    speedReaderDiv.style.position = 'fixed';
	    speedReaderDiv.style.left = `${Math.max(0, left)}px`;
	    speedReaderDiv.style.top = `${Math.max(0, top)}px`;
	    speedReaderDiv.style.width = `${SMALL_SIZE}px`;
	    speedReaderDiv.style.height = `${SMALL_SIZE}px`;
	    speedReaderDiv.style.overflow = 'hidden';
	    speedReaderDiv.style.transition = 'width 0.3s, height 0.3s';
	  }
	}

	function expandSpeedReader() {
	  console.log('Expanding SpeedReader');
	  if (speedReader && speedReaderDiv) {
	    speedReaderDiv.style.width = `${FULL_WIDTH}px`;
	    speedReaderDiv.style.height = `${FULL_HEIGHT}px`;
	    speedReader.$set({ isExpanded: true });
	    if (currentElement) {
	      currentElement.classList.add('expanded');
	    }
	  }
	}

	function shrinkSpeedReader() {
	  console.log('Shrinking SpeedReader');
	  if (speedReader && speedReaderDiv) {
	    speedReaderDiv.style.width = `${SMALL_SIZE}px`;
	    speedReaderDiv.style.height = `${SMALL_SIZE}px`;
	    speedReader.$set({ isExpanded: false });
	    if (currentElement) {
	      currentElement.classList.remove('expanded');
	    }
	  }
	}

	const throttledHandleMouseMove = throttle(handleMouseMove, 100);

	document.addEventListener('mousemove', throttledHandleMouseMove);

	// Clean up
	window.addEventListener('unload', () => {
	  document.removeEventListener('mousemove', throttledHandleMouseMove);
	  hidePopup();
	});

})();
//# sourceMappingURL=content.js.map
