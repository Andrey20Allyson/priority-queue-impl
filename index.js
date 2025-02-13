/**
 * @typedef {(a: number, b: number) => number} PriorityFn
 */

class PriorityQueue {
  /**@type {number[]} */
  heap = [];
  heap_last_index = -1;

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
    this._heap_push(item);
    let current_index = this.heap_last_index;

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
    this.swap(0, this.heap_last_index);

    const dequeue_result = this._heap_pop();

    let parent_index = 0;

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

    return dequeue_result;
  }

  /**
   *
   * @returns {number | undefined}
   */
  peek() {
    return this.heap[0];
  }

  priority_swap(parent_index, child_index) {
    if (this.priority_diff(parent_index, child_index) < 0) {
      return false;
    }

    this.swap(parent_index, child_index);

    return true;
  }

  /**
   *
   * @param {number} a_index
   * @param {number} b_index
   * @returns {number} `number` result < 0 if a priority is higher, result > 0 if b priority is higher and result == 0 if a & b have same priority
   */
  priority_diff(a_index, b_index) {
    return this.priority_fn(this.heap[a_index], this.heap[b_index]);
  }

  swap(a_index, b_index) {
    const temp = this.heap[a_index];
    this.heap[a_index] = this.heap[b_index];
    this.heap[b_index] = temp;
  }

  get_priority_child_index(parent_index) {
    const children_indexes = get_heap_children_index(parent_index);

    if (children_indexes.left > this.heap_last_index) {
      return -1;
    }

    if (children_indexes.right > this.heap_last_index) {
      return children_indexes.left;
    }

    return this.priority_diff(children_indexes.right, children_indexes.left) < 0
      ? children_indexes.right
      : children_indexes.left;
  }

  _heap_push(item) {
    this.heap_last_index += 1;

    return this.heap.push(item);
  }

  _heap_pop() {
    if (this.heap_last_index >= 0) {
      this.heap_last_index -= 1;
    }

    return this.heap.pop();
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
