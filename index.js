/**
 * @typedef {(a: number, b: number) => number} PriorityFn
 */

const HEAP_PEEK_INDEX = 0;

class PriorityQueue {
  /**
   * The heap is a array where all the values will be stored
   *
   * @type {number[]}
   * @private
   */
  _heap = [];

  /**
   *
   * @private
   */
  _heap_last_index = -1;

  /**@type {PriorityFn} */
  priority_fn;

  /**
   *
   * @param {PriorityFn} priority_fn
   */
  constructor(priority_fn) {
    if (typeof priority_fn !== "function") {
      throw new TypeError(`new PriorityQueue(...) 1# arg expects a function`);
    }

    this.priority_fn = priority_fn;
  }

  /**
   *
   * @param {number} item
   */
  enqueue(item) {
    // add new item
    this._heap_push(item);

    // sets current_index to last heap index
    let current_index = this._heap_last_index;

    // re-structure heap
    while (current_index > 0) {
      const parent_index = get_heap_parent_index(current_index);

      const swapped = this.priority_swap(parent_index, current_index);
      // if cant swap end the loop
      if (!swapped) {
        break;
      }

      current_index = parent_index;
    }
  }

  /**
   *
   * @param {number} items
   */
  enqueue_array(items) {
    for (const item of items) {
      this.enqueue(item);
    }
  }

  /**
   *
   * @returns {number | undefined}
   */
  dequeue() {
    const peek_value = this.peek();

    // swap peak and last heap items
    this.swap(HEAP_PEEK_INDEX, this._heap_last_index);

    // pops the old peek item
    this._heap_pop();

    // sets parent_index to heap peek index
    let parent_index = HEAP_PEEK_INDEX;

    // re-structure heap
    while (true) {
      const child_index = this.get_priority_child_index(parent_index);
      // if parent dont have at least one child end the loop
      if (child_index === -1) {
        break;
      }

      const swapped = this.priority_swap(parent_index, child_index);
      // if cant swap end the loop
      if (!swapped) {
        break;
      }

      parent_index = child_index;
    }

    return peek_value;
  }

  /**
   *
   * @returns {number | undefined}
   */
  peek() {
    return this._heap[HEAP_PEEK_INDEX];
  }

  /**
   * Swap `parent` with `child` if `parent` priority is lower than its `child`.
   *
   * @param {number} parent_index
   * @param {number} child_index
   * @returns `true` if swapped, `false` if not swapped.
   */
  priority_swap(parent_index, child_index) {
    if (this.priority_diff(parent_index, child_index) < 0) {
      return false;
    }

    this.swap(parent_index, child_index);

    return true;
  }

  /**
   * Executes `this.priority_fn` with heap values at `a_index` and `b_index`
   *
   * @param {number} a_index index of `a` value
   * @param {number} b_index index of `b` value
   * @returns {number} `number` result < 0 if `a` priority is higher, result > 0 if `b` priority is higher and result == 0 if `a` & `b` have same priority
   */
  priority_diff(a_index, b_index) {
    return this.priority_fn(this._heap[a_index], this._heap[b_index]);
  }

  swap(a_index, b_index) {
    const temp = this._heap[a_index];
    this._heap[a_index] = this._heap[b_index];
    this._heap[b_index] = temp;
  }

  get_priority_child_index(parent_index) {
    const children_indexes = get_heap_children_index(parent_index);

    if (children_indexes.left > this._heap_last_index) {
      return -1;
    }

    if (children_indexes.right > this._heap_last_index) {
      return children_indexes.left;
    }

    return this.priority_diff(children_indexes.right, children_indexes.left) < 0
      ? children_indexes.right
      : children_indexes.left;
  }

  /**
   *
   * @private
   */
  _heap_push(item) {
    this._heap_last_index += 1;

    return this._heap.push(item);
  }

  /**
   *
   * @private
   */
  _heap_pop() {
    if (this._heap_last_index >= 0) {
      this._heap_last_index -= 1;
    }

    return this._heap.pop();
  }
}

/**
 *
 * @param {number} parent_index
 */
function get_heap_children_index(parent_index) {
  const left = parent_index * 2 + 1;
  const right = left + 1;

  return {
    left,
    right,
  };
}

function get_heap_parent_index(child_index) {
  return Math.floor((child_index - 1) / 2);
}

const priority_queue = {
  PriorityQueue,
};

module.exports = priority_queue;
