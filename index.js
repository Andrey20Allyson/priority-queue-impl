/**
 * @typedef {(a: number, b: number) => number} PriorityFn
 */

/**
 *
 * @param {number[]} heap
 * @param {PriorityFn} priority_fn
 * @param {number} item
 */
function enqueue(heap, priority_fn, item) {
  heap.push(item) - 1;
  let current_index = heap.length - 1;

  // re-structure heap after insertion
  while (current_index > 0) {
    let parent_index = get_parent_index(current_index);

    const swapped = heap_priority_swap(
      heap,
      priority_fn,
      parent_index,
      current_index
    );

    // stop loop if parent node not is priority above current node
    if (!swapped) {
      break;
    }

    current_index = parent_index;
  }
}

/**
 *
 * @param {number[]} heap
 * @param {PriorityFn} priority_fn
 * @returns {number | undefined}
 */
function dequeue(heap, priority_fn) {
  let last_index = heap.length - 1;

  // get peek element, place last element in peek position
  // and remove last position
  let front_item = heap[0];
  heap[0] = heap[last_index];
  heap.pop();

  // updates last index
  last_index -= 1;

  // sets parent index to peek position
  let parent_index = 0;

  // re-structure heap after deletion
  while (true) {
    const child_index = get_priority_child_index(
      heap,
      priority_fn,
      parent_index
    );

    if (child_index === -1) {
      break;
    }

    const swapped = heap_priority_swap(
      heap,
      priority_fn,
      parent_index,
      child_index
    );
    if (!swapped) {
      break;
    }

    parent_index = child_index;
  }

  return front_item;
}

/**
 *
 * @param {number[]} heap
 * @param {PriorityFn} priority_fn
 * @param {number} parent_index
 * @param {number} child_index
 * @returns {boolean} true if swapped, false otherwise
 */
function heap_priority_swap(heap, priority_fn, parent_index, child_index) {
  // return false if parent node not is priority above current node
  if (priority_fn(heap[parent_index], heap[child_index]) < 0) {
    return false;
  }

  // swap nodes
  const temp = heap[parent_index];
  heap[parent_index] = heap[child_index];
  heap[child_index] = temp;

  return true;
}

/**
 *
 * @param {number[]} heap
 * @param {PriorityFn} priority_fn
 * @param {number} right_child_index
 * @param {number} left_child_index
 * @returns {number}
 */
function get_priority_child_index(heap, priority_fn, parent_index) {
  const last_index = heap.length - 1;

  let [left_child_index, right_child_index] = get_children_index(parent_index);

  if (left_child_index > last_index) {
    return -1;
  }

  const is_right_child_in_boundary = right_child_index <= last_index;

  // change current index to right child index if current child is priority
  if (
    is_right_child_in_boundary &&
    priority_fn(heap[right_child_index], heap[left_child_index]) <= 0
  ) {
    return right_child_index;
  }

  return left_child_index;
}

function get_children_index(parent_index) {
  const lci = parent_index * 2 + 1;
  const rci = lci + 1;

  return [lci, rci];
}

function get_parent_index(child_index) {
  return Math.floor((child_index - 1) / 2);
}

function peek(heap) {
  return heap[0];
}

const priority_queue = {
  enqueue,
  dequeue,
  peek,
};

module.exports = priority_queue;
