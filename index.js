function enqueue(heap, priority_fn, item) {
  heap.push(item) - 1;
  let current_index = heap.length - 1;

  // re-structure heap after insertion
  while (current_index > 0) {
    let parent_index = get_parent_index(current_index);
    const current_value = heap[current_index];
    const parent_value = heap[parent_index];

    // stop loop if parent node not is priority above current node
    if (priority_fn(parent_value, current_value) < 0) {
      break;
    }

    heap[parent_index] = current_value;
    heap[current_index] = parent_value;
    current_index = parent_index;
  }
}

function dequeue(heap, priority_fn) {
  let last_index = heap.length - 1;
  let front_item = heap[0];
  heap[0] = heap[last_index];
  heap.pop();

  last_index -= 1;
  let parent_index = 0;

  // re-structure heap after deletion
  while (true) {
    let [current_child_index] = get_children_index(parent_index);

    if (current_child_index > last_index) {
      break;
    }

    let right_child_index = current_child_index + 1;

    const is_right_child_in_boundary = right_child_index <= last_index;

    // change current index to right child index if current child is priority
    if (
      is_right_child_in_boundary &&
      priority_fn(heap[right_child_index], heap[current_child_index]) <= 0
    ) {
      current_child_index = right_child_index;
    }

    const parent_value = heap[parent_index];
    const current_child_value = heap[current_child_index];

    // stop loop if parent node not is priority above current node
    if (priority_fn(parent_value, current_child_value) < 0) {
      break;
    }

    heap[parent_index] = current_child_value;
    heap[current_child_index] = parent_value;

    parent_index = current_child_index;
  }

  return front_item;
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
